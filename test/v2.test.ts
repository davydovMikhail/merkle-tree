import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import * as mocha from "mocha-steps";
import { parseEther } from '@ethersproject/units';
import { AirdropV2, Token20 } from '../typechain-types';
import  keccak256  from "keccak256";
import { MerkleTree } from "merkletreejs";

describe("AirdropV2.sol testing", async () => {
    let airdrop: AirdropV2;
    let dropToken: Token20;
    let admin: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, user4: SignerWithAddress, 
        user5: SignerWithAddress, user6: SignerWithAddress, user7: SignerWithAddress, user8: SignerWithAddress, user9: SignerWithAddress,
        user10: SignerWithAddress, user11: SignerWithAddress, user12: SignerWithAddress, user13: SignerWithAddress, user14: SignerWithAddress,
        unwhitelisted: SignerWithAddress;
    
    let dropAmount: BigNumber;
    let Tree: MerkleTree;
    let RootTree: string;

    beforeEach(async () => {
        [admin, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12, user13, user14, unwhitelisted] = await ethers.getSigners();
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

    mocha.step("Формирование дерева меркла и получение корневого хэша", async function () {
        const whitelist = [
            user1.address, user2.address, 
            user3.address, user4.address, 
            user5.address, user6.address, 
            user7.address, user8.address,
            user9.address, user10.address,
            user11.address, user12.address,
            user13.address, user14.address,
        ];        
        const leafs = whitelist.map(address => keccak256(address));        
        Tree = new MerkleTree(leafs, keccak256, {sortPairs: true});
        RootTree = Tree.getHexRoot();
    });

    mocha.step("Установка корневого хэша в контракт аирдропа", async function () {      
        console.log('RootTree', RootTree);
        await airdrop.connect(admin).setRoot(RootTree);  
    });

    mocha.step("Вызов функции claim, пользователями из вайтлиста", async function() {
        await airdrop.connect(user1).claim(Tree.getHexProof(keccak256(user1.address)));
        await airdrop.connect(user2).claim(Tree.getHexProof(keccak256(user2.address)));
        await airdrop.connect(user3).claim(Tree.getHexProof(keccak256(user3.address)));
        await airdrop.connect(user4).claim(Tree.getHexProof(keccak256(user4.address)));
        await airdrop.connect(user5).claim(Tree.getHexProof(keccak256(user5.address)));
        await airdrop.connect(user6).claim(Tree.getHexProof(keccak256(user6.address)));
        await airdrop.connect(user7).claim(Tree.getHexProof(keccak256(user7.address)));
        await airdrop.connect(user8).claim(Tree.getHexProof(keccak256(user8.address)));
        await airdrop.connect(user9).claim(Tree.getHexProof(keccak256(user9.address)));
        await airdrop.connect(user10).claim(Tree.getHexProof(keccak256(user10.address)));
        await airdrop.connect(user11).claim(Tree.getHexProof(keccak256(user11.address)));
        await airdrop.connect(user12).claim(Tree.getHexProof(keccak256(user12.address)));
        await airdrop.connect(user13).claim(Tree.getHexProof(keccak256(user13.address)));
        await airdrop.connect(user14).claim(Tree.getHexProof(keccak256(user14.address)));


    });

    mocha.step("Проверка баланса пользователей после claim", async function() {
        expect(await dropToken.balanceOf(user1.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user2.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user3.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user4.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user5.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user6.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user7.address)).to.be.equal(dropAmount);              
        expect(await dropToken.balanceOf(user8.address)).to.be.equal(dropAmount);
        expect(await dropToken.balanceOf(user9.address)).to.be.equal(dropAmount);
        expect(await dropToken.balanceOf(user10.address)).to.be.equal(dropAmount);
        expect(await dropToken.balanceOf(user11.address)).to.be.equal(dropAmount);
        expect(await dropToken.balanceOf(user12.address)).to.be.equal(dropAmount);
        expect(await dropToken.balanceOf(user13.address)).to.be.equal(dropAmount);
        expect(await dropToken.balanceOf(user14.address)).to.be.equal(dropAmount);
    });

    mocha.step("Проверка на повторный клейм", async function() {
        await expect(airdrop.connect(user1).claim(Tree.getHexProof(keccak256(user1.address)))).to.be.revertedWith('Already claimed');
    });

    mocha.step("Проверка защиты от несанкционированного клейма", async function() {
        await expect(airdrop.connect(unwhitelisted).claim(Tree.getHexProof(keccak256(unwhitelisted.address)))).to.be.revertedWith('You are not whitelisted.');
    });
});