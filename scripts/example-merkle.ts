import { ethers } from "ethers";

async function main() {
    const addresses = [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
        '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f' 
    ]

    const dataArray = addresses.map(address => BigInt(address));

    // console.log(dataArray[0].toString(16).padStart(64, '0'));
    
    const hash = (x: BigInt) => BigInt(ethers.utils.keccak256("0x" + x.toString(16).padStart(64, '0')));
    const hash1 = (x: BigInt) => BigInt(ethers.utils.keccak256("0x" + x.toString(16)).padStart(64, '0'));


    const example = hash(dataArray[0]);
    const examplt1 = hash1(dataArray[0]);

    

    // const pairHash = (a: BigInt, b: BigInt) => hash(hash(a) ^ hash(b))
    // const firstLevel = [];
    
    console.log('example.toString(16).padStart(64, 0)', example.toString(16)); 
    console.log('example.toString(16)', examplt1.toString(16)); 
    // 00314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0
    //   314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0
    //   314e565e0574cb412563df634608d76f5c59d9f817e85966100ec1d48005c0
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
