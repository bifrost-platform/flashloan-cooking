require('@nomiclabs/hardhat-ethers');
const { expect } = require("chai");

const ABI = [
  'function balanceOf(address) external view returns (uint)',
  'function transfer(address, uint) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)'
]

function expectEqual(title, expectValue, actualValue) {
  try{
    expect(expectValue).to.equal(actualValue);
    console.log('[' + title, '] => True');
  }
  catch(exception){
    console.log("[" + title, "] => False");
    console.log(exception);
  }
}

task('flashLoanCooking', async (_, hre) => {

  // The address that has DAI on mainnet
  const faucetAddr = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
  const daiAddr = '0x6b175474e89094c44da98b954eedeac495271d0f'

  // below flashLender and Manager addresses In BIFI V1
  const mangerAddr = '0x913F2DEe2746CdA2ab34106c47aBC4a8f4e36fa5'

  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [faucetAddr]
  });

  const faucet = await hre.ethers.provider.getSigner(faucetAddr);
  const factoryContract = await hre.ethers.getContractFactory('FlashloanReceiver');

  // Deploy flashloanReceiver contract
  const flashloanReceiver = await factoryContract.deploy(mangerAddr);
  const flashloanAmount = await ethers.utils.parseUnits('1000');

  // This is flashloan's fee calculation part
  const feeRate = 0.0008;
  const feeAmount = Number(flashloanAmount) * feeRate;

  console.log('Deploy FlashloanReceiver Contract:', flashloanReceiver.address);
  console.log('Expected FlashloanAmount: ' + flashloanAmount);
  console.log('Expected FeeAmount: ' + feeAmount.toString());

  const dai = new ethers.Contract(daiAddr, ABI, faucet);

  // Send DAI equal to flashloan fee to flashloanReceiver contract.
  let tx = await dai.transfer(flashloanReceiver.address, feeAmount.toString());
  await expectEqual("Checking user transfer feeAmount(DAI) to flashloanReceiver Contract", feeAmount.toString(), (await dai.balanceOf(flashloanReceiver.address)).toString());

  // Requests a flashloan by 1000 DAI.
  tx = await flashloanReceiver.flashloan(2, flashloanAmount, '0x0000000000000000000000000000000000000000000000000000000000000000');
  await expectEqual("Checking flashloanReceiver transfer feeAmount(DAI) to flashLoan Contract", "0", (await dai.balanceOf(flashloanReceiver.address)).toString());

  await hre.network.provider.request({
    method: 'hardhat_stopImpersonatingAccount',
    params: [faucetAddr]
  });

});

module.exports = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.6.12' ,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://mainnet.infura.io/v3/[INFURA_KEY]'
      }
    }
  },
};
