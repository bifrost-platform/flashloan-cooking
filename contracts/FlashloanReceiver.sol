// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.12;

import "./interfaces/IFlashloanReceiver.sol";
import "./interfaces/IManagerFlashloan.sol";
import "./interfaces/IERC20.sol";
import "./utils/SafeMath.sol";

contract FlashloanReceiver is IFlashloanReceiver {
	using SafeMath for uint256;

  modifier onlyOwner {
		require(msg.sender == owner, "onlyOwner");
		_;
	}

  modifier onlyManager {
    require(msg.sender == managerAddr, "onlyManager");
    _;
  }

  address public immutable owner;
  address public immutable managerAddr;

  event Loan(address reserve, uint256 amount, uint256 fee);

  constructor(address _managerAddr) public {
    owner = msg.sender;

    managerAddr = _managerAddr;
  }

  function flashloan(
      uint256 handlerID,
      uint256 amount,
      bytes calldata params
    ) external onlyOwner returns (bool) {
      IManagerFlashloan loan = IManagerFlashloan(managerAddr);

      return loan.flashloan(handlerID, address(this), amount, params);
  }

  // callback function when use flashloan
  function executeOperation(
      address reserve,
      uint256 amount,
      uint256 fee,
      bytes calldata params
    ) external override onlyManager returns (bool) {
    // logic


    // return with fee
    uint256 totalDebt = amount.add(fee);


    // if lend token
    if(reserve != address(0)) {
      IERC20 token = IERC20(reserve);
      emit Loan(reserve, amount, fee);
      token.transfer(msg.sender, totalDebt);
      return true;
    }

      // if lend coin
    emit Loan(reserve, amount, fee);
    payable(msg.sender).transfer(totalDebt);

    return true;
  }

  /**
	* @dev fallback function where handler can receive native coin
	*/
	fallback () external payable
	{

	}
}
