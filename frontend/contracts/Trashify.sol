// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {CoordinatesHelper} from "./CoordinatesHelper.sol";

contract Trashify is CoordinatesHelper {
    /* Events */

    event NewReportSubmited(uint256 indexed reportId, address indexed creator);

    /* Data Structures */

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
        Coordinates location; //location of the field
    }

    Report[] public reports;
    uint256 reportIdCounter = 1;
    // Mapping to store the index of a report based on its ID
    mapping(uint256 => uint256) public reportIdToIndex;

    /* Functions */

    function submitReport(
        string memory _metadata,
        uint256 latitude,
        uint256 longitude
    ) public {
        uint256 nextId = reportIdCounter;

        Report memory newReport;
        newReport.id = nextId;
        newReport.creator = msg.sender;
        newReport.state = ReportState.InReview;
        newReport.metadata = _metadata;
        newReport.totalRewards = 0;
        newReport.location = Coordinates({
            latitude: latitude,
            longitude: longitude
        });

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

    // Function to retrieve reports close to a specific point
    //TODO: simplify (through a mapping??) the possibility to find nearby reports,
    //at the moment we have to loop through all the reports
    function getNearbyReports(
        uint256 _latitude,
        uint256 _longitude,
        uint256 _proximity
    ) public view returns (Report[] memory) {
        uint256 counter = 0;
        Report[] memory nearbyReports;

        for (uint256 i = 0; i < reports.length; i++) {
            if (reports[i].state != ReportState.Available) {
                continue;
            }

            if (
                isWithinProximity(
                    reports[i].location,
                    _latitude,
                    _longitude,
                    _proximity
                )
            ) {
                nearbyReports[counter] = reports[i];
                counter++;
            }
        }

        return nearbyReports;
    }
}
