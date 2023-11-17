// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Trashify is AccessControl {
    constructor(address[] memory moderators, address[] memory admins) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MODERATORS, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(ADMINS, DEFAULT_ADMIN_ROLE);

        for (uint256 i = 0; i < moderators.length; i++) {
            _grantRole(MODERATORS, moderators[i]);
        }

        for (uint256 i = 0; i < admins.length; i++) {
            _grantRole(ADMINS, admins[i]);
        }
    }

    /* Events */

    event NewReportSubmited(uint256 indexed reportId, address indexed creator);
    event ReportDeleted(uint256 indexed reportId, address indexed creator);
    event ReportStateChanged(uint256 indexed reportId, ReportState newState);
    event UserSubscribedToClean(uint256 indexed reportId, address subscriber);

    /* Data Structures */
    bytes32 public constant MODERATORS = keccak256("MODERATORS");
    bytes32 public constant ADMINS = keccak256("ADMINS");

    enum ReportState {
        InReview, // user submitted a report and moderators are reviewing it
        Available, // moderators verified the content and approved it
        PendingVerification, // user cleaned the field and submitted the proof for verification
        Cleaned, // moderators verified the proof and closed the report
        Rewarded // users claimed their rewards and the report can be considered closed
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

    Report[] public reports;
    uint256 reportIdCounter = 1;
    // Mapping to store the index of a report based on its ID
    mapping(uint256 => uint256) public reportIdToIndex;

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

    // owner can close a report if no one subscribed to it and reward pool is empty
    function deleteReport(
        uint256 _reportId
    ) public onlyAdminModeratorAndReportCreator(_reportId) {
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

    /* Modifiers */
    modifier onlyAdminModeratorAndReportCreator(uint256 _reportId) {
        require(
            hasRole(MODERATORS, msg.sender) ||
                hasRole(ADMINS, msg.sender) ||
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
}
