/* @flow */
import fs from 'fs';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import { ethers } from "ethers";

const vybeABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const provider = new ethers.providers.JsonRpcProvider("https://eth.vybe.finance");
const vybeContract = new ethers.Contract("0x3A1c1d1c06bE03cDDC4d3332F7C20e1B37c97CE9", vybeABI, provider);

export async function pullData(): Promise < void > {
    try {
        const config = {
            headers: {
                Accept: "application/json"
            }
        };

        const priceRes = await axios.get("https://api.coingecko.com/api/v3/coins/vybe?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false", config);
        const usdPrice = Number(priceRes.data.market_data.current_price.usd.toFixed(2));
        const ethPrice = Number(priceRes.data.market_data.current_price.eth);
        const volume = priceRes.data.market_data.total_volume.usd;
        const totalRawSupply = await vybeContract.totalSupply();
        const totalSupply = Number(ethers.utils.formatUnits(totalRawSupply, 18)).toFixed(0);

        const lockedSupply = await vybeContract.balanceOf("0x661cedb088918820e6893F01356F8D745010452a");
        const daoSupply = await vybeContract.balanceOf("0x9E6a97d3a65BFd1dDC6D15025f985eBc9c8f2b0A");

        const cirWithoutLock = totalRawSupply.sub(lockedSupply);
        const circulatingSupply = Number(ethers.utils.formatUnits(cirWithoutLock, 18)).toFixed(0);;

        const marketCap = Number(circulatingSupply * usdPrice).toFixed(0);

        const current_data = {
            usd: usdPrice,
            eth: ethPrice,
            volume,
            total_supply: totalSupply,
            circulating_supply: circulatingSupply,
            market_cap: marketCap
        };
        fs.writeFileSync((__dirname, 'data.json'), JSON.stringify(current_data));
    } catch (err) {
        console.log(err);
    }

    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(0);
}
