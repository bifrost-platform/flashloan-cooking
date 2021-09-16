// SPDX-License-Identifier: BSD-3-Clause

pragma solidity 0.6.12;

interface IManagerFlashloan {
  function withdrawFlashloanFee(uint256 handlerID) external returns (bool);

  function flashloan(
    uint256 handlerID,
    address receiverAddress,
    uint256 amount,
    bytes calldata params
  ) external returns (bool);

  function getFee(uint256 handlerID, uint256 amount) external view returns (uint256);

  function getFeeTotal(uint256 handlerID) external view returns (uint256);

  function getFeeFromArguments(uint256 handlerID, uint256 amount, uint256 bifiAmo) external view returns (uint256);
}
