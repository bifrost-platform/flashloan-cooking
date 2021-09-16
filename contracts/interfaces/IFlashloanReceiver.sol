// SPDX-License-Identifier: BSD-3-Clause
pragma solidity 0.6.12;

/**
 * @title BiFi's FlashloanReceiver contract
 * @notice Implement Execution logic of Flashloan
 * @author BiFi(seinmyung25, Miller-kk, tlatkdgus1, dongchangYoo)
 */

interface IFlashloanReceiver {
    function executeOperation(
      address reserve,
      uint256 amount,
      uint256 fee,
      bytes calldata params
    ) external returns (bool);
}
