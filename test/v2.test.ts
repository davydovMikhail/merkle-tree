import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import * as mocha from "mocha-steps";
import { parseEther } from '@ethersproject/units';
import { AirdropV2, Token20 } from '../typechain-types';
import  keccak256  from "keccak256";

describe("AirdropV2.sol testing", async () => {
    let airdrop: AirdropV2;
    let dropToken: Token20;
    let admin: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, user4: SignerWithAddress, 
        user5: SignerWithAddress, user6: SignerWithAddress, user7: SignerWithAddress, user8: SignerWithAddress, user9: SignerWithAddress, 
        user10: SignerWithAddress, unwhitelisted: SignerWithAddress;
    
    let dropAmount: BigNumber;

    beforeEach(async () => {
        [admin, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, unwhitelisted] = await ethers.getSigners();
    });

    mocha.step("Деплой токена ERC20, который мы будем раздавать", async function() {
        const dropTokenFactory = await ethers.getContractFactory("Token20");
        dropToken = await dropTokenFactory.connect(admin).deploy(
            'Drop Token',
            'DTN',
            parseEther('100000')
        )
    });

    mocha.step("Деплой контракта аирдропа", async function() {
        const airdropFactory = await ethers.getContractFactory("AirdropV2");
        dropAmount = parseEther('1000');
        airdrop = await airdropFactory.deploy(dropToken.address, dropAmount);
    });

    mocha.step("Трансфер раздаваемого токена на адрес контракта аирдропа", async function() {
        await dropToken.connect(admin).transfer(airdrop.address, parseEther('100000'));
    });

    // mocha.step("Добавление пользователей в вайтлист", async function() {
    //     const whitelist = [
    //         user1.address, user2.address, user3.address, 
    //         user4.address, user5.address, user6.address, 
    //         user7.address, user8.address, user9.address,
    //         user10.address
    //     ];
    //     await airdrop.connect(admin).addToWhitelist(whitelist);
    // });

    // mocha.step("Вызов функции claim, пользователями из вайтлиста", async function() {
    //     await airdrop.connect(user1).claim();
    //     await airdrop.connect(user2).claim();
    //     await airdrop.connect(user3).claim();
    // });

    // mocha.step("Проверка баланса пользователей после claim", async function() {
    //     expect(await dropToken.balanceOf(user1.address)).to.be.equal(dropAmount);              
    //     expect(await dropToken.balanceOf(user2.address)).to.be.equal(dropAmount);              
    //     expect(await dropToken.balanceOf(user3.address)).to.be.equal(dropAmount);              
    // });

    // mocha.step("Проверка защиты от несанкционированного клейма", async function() {
    //     await expect(airdrop.connect(unwhitelisted).claim()).to.be.revertedWith('You are not whitelisted.');
    // });
});