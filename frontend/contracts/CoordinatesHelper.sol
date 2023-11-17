// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CoordinatesHelper {
    // Structure to store coordinates
    struct Coordinates {
        uint256 latitude;
        uint256 longitude;
    }

    // Helper function to determine if a point is within a certain proximity
    function isWithinProximity(
        Coordinates memory coords,
        uint256 _latitude,
        uint256 _longitude,
        uint256 _proximity
    ) internal pure returns (bool) {
        // Simple distance calculation (more complex formula might be required for real-world applications)
        uint256 latDiff = (coords.latitude > _latitude)
            ? (coords.latitude - _latitude)
            : (_latitude - coords.latitude);
        uint256 longDiff = (coords.longitude > _longitude)
            ? (coords.longitude - _longitude)
            : (_longitude - coords.longitude);

        return (latDiff <= _proximity) && (longDiff <= _proximity);
    }
}
