// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Cleanify
 * @dev Implements the core functionality of the Cleanify platform
 *
 * Cleanify is a decentralized application that allows users to report trash fields and
 * reward people that clean them.
 *
 * The platform is composed of the following actors:
 * - Report creator: the person that reports a trash field
 * - Contoributor: the person that contributes to the reward pool of a report
 * - Cleaner: the person that cleans the field and claims the reward
 * - Moderator: the person that verifies the report, the cleaning proof and have control over the platform
 *
 * When a user reports a trash field, the report will be in a InReview state until a moderator approves it.
 * After the report is approved, the report will be in a Available state and users can subscribe to clean it.
 * When a user cleans the field, they have to provide a proof of the cleaning and the report will be in a PendingVerification state.
 * A moderator or the cretor of the report will verify the proof and approve or deny the cleaning verification.
 * If the cleaning verification is approved, the rewards will be distributed and the report will be in considered complete.
 * If the cleaning verification is denied, the report will be in a Available state and users can subscribe to clean it again or provide more proofs.
 */
contract Cleanify is AccessControl {
    constructor(address[] memory moderators) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MODERATORS, DEFAULT_ADMIN_ROLE);

        for (uint256 i = 0; i < moderators.length; i++) {
            _grantRole(MODERATORS, moderators[i]);
        }
    }

    /* Events */

    event NewReportSubmited(uint256 indexed reportId, address indexed creator);
    event ReportDeleted(uint256 indexed reportId, address indexed creator);
    event ReportStateChanged(uint256 indexed reportId, ReportState newState);
    event UserSubscribedToClean(uint256 indexed reportId, address subscriber);
    event ReportSetAsCleaned(uint256 indexed reportId, address indexed cleaner);
    event NewProofAdded(
        uint256 indexed reportId,
        address indexed cleaner,
        string proof
    );
    event CleaningVerificationApproved(uint256 indexed reportId);
    event CleaningVerificationDenied(uint256 indexed reportId);
    event RewardAdded(
        uint256 indexed reportId,
        address indexed contributor,
        uint256 amount
    );
    event RewardsDistributed(uint256 indexed reportId, address[] cleaners);

    /* Data Structures */
    bytes32 public constant MODERATORS = keccak256("MODERATORS");

    enum ReportState {
        InReview, // user submitted a report and moderators are reviewing it
        Available, // moderators verified the content and approved it
        PendingVerification, // user cleaned the field and submitted the proof for verification
        Cleaned // moderators verified the proof and closed the report
    }

    struct Report {
        uint256 id;
        address creator;
        ReportState state;
        address[] cleaners; //people than intend to clean the field
        string metadata; //contains off chain information like images, videos, written details, etc.
        string[] proofs; //contains off chain information provided as proofs by the cleaners that cleaned the field
        uint256 totalRewards; //amount of ETH that the report contains as reward
    }

    //TODO: return all the reports a use has subscribed to clean

    Report[] public reports;
    uint256 reportIdCounter = 1;
    // Mapping to store the index of a report based on its ID
    mapping(uint256 => uint256) public reportIdToIndex;

    struct Reward {
        address contributor;
        uint256 amount;
    }

    mapping(uint256 => Reward[]) reportContributors; // people that donated to the report (reportId => Supporter[])
    mapping(address => uint256[]) userContributions; // mapping to get all donations of a user (user => reportId[])

    /* Functions */

    // Function to submit a new report by the user
    // The report will need to be reviewed by a moderator before being available for cleaning
    function submitReport(string memory _metadata) public {
        uint256 nextId = reportIdCounter;

        Report memory newReport;
        newReport.id = nextId;
        newReport.creator = msg.sender;
        newReport.state = ReportState.InReview;
        newReport.metadata = _metadata;
        newReport.totalRewards = 0;

        reports.push(newReport);

        // Update the mapping with the new report's index
        reportIdToIndex[nextId] = reports.length - 1;

        reportIdCounter++;

        emit NewReportSubmited(nextId, msg.sender);
    }

    // Function to get the total number of reports
    function totalReports() public view returns (uint256) {
        return reports.length;
    }

    // Function to get a report by its ID
    function getReportById(
        uint256 _reportId
    ) public view returns (Report memory) {
        return reports[reportIdToIndex[_reportId]];
    }

    // Function to get a paginated list of reports
    function getPaginatedReports(
        uint256 page,
        uint256 pageSize
    ) public view returns (Report[] memory) {
        require(page > 0 && pageSize > 0, "Invalid page or pageSize");

        uint256 startIndex = (page - 1) * pageSize;

        if (startIndex >= reports.length) {
            // If the startIndex is beyond the array length, return an empty array
            return new Report[](0);
        }

        uint256 endIndex = startIndex + pageSize;

        if (endIndex > reports.length) {
            endIndex = reports.length;
        }

        Report[] memory paginatedList = new Report[](endIndex - startIndex);

        for (uint256 i = startIndex; i < endIndex; i++) {
            paginatedList[i - startIndex] = reports[i];
        }

        return paginatedList;
    }

    // The creator of the report can update the metadata
    // while the report is still in review
    function updateReportMetadata(
        uint256 _reportId,
        string memory _metadata
    ) public onlyReportCreator(_reportId) {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.InReview,
            "Report not available for modification"
        );

        report.metadata = _metadata;
    }

    // owner can close a report if no one subscribed to it and reward pool is empty
    function deleteReport(
        uint256 _reportId
    ) public onlyModeratorAndReportCreator(_reportId) {
        uint256 index = reportIdToIndex[_reportId];
        Report storage report = reports[index];

        require(report.id != 0, "Report ID does not exist");
        require(report.state == ReportState.Available, "Report not available");
        require(
            report.cleaners.length == 0,
            "Report has cleaners, cannot delete"
        );
        require(report.totalRewards == 0, "Report has rewards, cannot delete");

        // Deleting an element creates a gap in the array.
        // One trick to keep the array compact is to move the last element into the place to delete.
        // Move the last element into the place to delete (and also overwrite it)
        reports[index] = reports[reports.length - 1];
        // Update the mapping for the moved report
        reportIdToIndex[reports[index].id] = index;

        // Remove the last element
        reports.pop();
        // Delete the mapping for the removed report
        delete reportIdToIndex[_reportId];

        emit ReportDeleted(_reportId, msg.sender);
    }

    // Moderators can change the state of a report to Available
    // and make it available for cleaning
    function approveReport(uint256 _reportId) public onlyModerator {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.InReview,
            "Report is not awaiting to be reviewd"
        );

        report.state = ReportState.Available;

        emit ReportStateChanged(_reportId, ReportState.Available);
    }

    // When a user wants to clean a field, they have to subscribe to it
    // otherwise they want receive any reward
    function subscribeToClean(uint256 _reportId) public {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.Available,
            "Report not available for subscription"
        );
        require(
            !isUserSubscribedAsCleaner(report.id, msg.sender),
            "Already subscribed"
        );

        report.cleaners.push(msg.sender);

        emit UserSubscribedToClean(_reportId, msg.sender);
    }

    // Return if user has subscribed to clean a specific report
    function isUserSubscribedAsCleaner(
        uint256 _reportId,
        address user
    ) public view returns (bool) {
        uint256 index = reportIdToIndex[_reportId];
        address[] memory cleaners = reports[index].cleaners;
        for (uint256 i = 0; i < cleaners.length; i++) {
            if (cleaners[i] == user) {
                return true;
            }
        }

        return false;
    }

    // After a user cleaned a field, they have call this function
    // to set the report as cleaned and provide a proof of the cleaning.
    // The report will be in a PendingVerification state until a moderator
    // verifies the proof and enables users to claim their rewards.
    function setReportAsCleaned(
        uint256 _reportId,
        string memory _proof
    ) public onlyCleaner(_reportId) {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(report.state == ReportState.Available, "Report not available");
        require(
            isUserSubscribedAsCleaner(report.id, msg.sender),
            "User is not subscribed to clean"
        );

        report.proofs.push(_proof);
        report.state = ReportState.PendingVerification;

        emit ReportStateChanged(_reportId, ReportState.PendingVerification);
        emit ReportSetAsCleaned(_reportId, msg.sender);
    }

    // While the cleaning verification is pending, the user can add more proofs
    function addAdditionalProofs(
        uint256 _reportId,
        string memory _proof
    ) public onlyCleanerAndReportCreatore(_reportId) {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.PendingVerification,
            "Report not pending verification"
        );
        require(
            isUserSubscribedAsCleaner(report.id, msg.sender),
            "User is not subscribed to clean"
        );

        report.proofs.push(_proof);
        emit NewProofAdded(_reportId, msg.sender, _proof);
    }

    // Moderators and the Creator of the report will call this function
    // to approve or deny the cleaning verification
    // after analyzing the proofs provided by the user.
    function handleVerificationRequest(
        uint256 _reportId,
        bool _isCleaned
    ) public onlyModeratorAndReportCreator(_reportId) {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.PendingVerification,
            "Report not pending verification"
        );

        if (_isCleaned) {
            report.state = ReportState.Cleaned;
            emit ReportStateChanged(_reportId, ReportState.Cleaned);
            emit CleaningVerificationApproved(_reportId);

            _distributeRewards(_reportId);
        } else {
            report.state = ReportState.Available;
            emit ReportStateChanged(_reportId, ReportState.Available);
            emit CleaningVerificationDenied(_reportId);
        }
    }

    // Users can contribute to the reward pool of a report by sending ETH to this function
    function addRewards(uint256 _reportId) public payable {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.Available,
            "Report not available for rewards"
        );
        require(msg.value > 0, "Reward amount must be greater than 0");

        Reward memory newReward = Reward({
            contributor: msg.sender,
            amount: msg.value
        });

        reportContributors[report.id].push(newReward);
        report.totalRewards += msg.value;

        emit RewardAdded(_reportId, msg.sender, msg.value);
    }

    // When a report is in the Cleaned state, whoever can call this function
    // and the contract will distribute the rewards equally between the cleaners
    function _distributeRewards(uint256 _reportId) internal {
        Report storage report = reports[reportIdToIndex[_reportId]];

        require(report.id != 0, "Report ID does not exist");
        require(
            report.state == ReportState.Cleaned,
            "Report not available for claiming rewards"
        );
        require(
            report.cleaners.length > 0,
            "No cleaners to distribute rewards"
        );

        uint256 reward = report.totalRewards / report.cleaners.length;

        for (uint256 i = 0; i < report.cleaners.length; i++) {
            payable(report.cleaners[i]).transfer(reward);
        }

        emit RewardsDistributed(_reportId, report.cleaners);
    }

    /* Modifiers */
    modifier onlyModeratorAndReportCreator(uint256 _reportId) {
        require(
            hasRole(MODERATORS, msg.sender) ||
                reports[reportIdToIndex[_reportId]].creator == msg.sender,
            "Only admins, moderators and report creator can call this function"
        );
        _;
    }

    modifier onlyModerator() {
        require(
            hasRole(MODERATORS, msg.sender),
            "Only moderators can call this function"
        );
        _;
    }

    modifier onlyCleaner(uint256 _reportId) {
        require(
            isUserSubscribedAsCleaner(_reportId, msg.sender),
            "Only a user registered as a cleaner can call this function"
        );
        _;
    }

    modifier onlyCleanerAndReportCreatore(uint256 _reportId) {
        require(
            isUserSubscribedAsCleaner(_reportId, msg.sender) ||
                reports[reportIdToIndex[_reportId]].creator == msg.sender,
            "Only a user registered as a cleaner or the report creator can call this function"
        );
        _;
    }

    modifier onlyReportCreator(uint256 _reportId) {
        require(
            reports[reportIdToIndex[_reportId]].creator == msg.sender,
            "Only the report creator can call this function"
        );
        _;
    }
}
