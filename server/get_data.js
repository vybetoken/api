/* @flow */
import fs from 'fs';
import BigNumber from 'bignumber.js';
import axios from 'axios';

export async function pullData(apikey: string): Promise < void > {
    try {
        const config = {
            headers: {
                Accept: "application/json"
            }
        };

        const supplyRes = await axios.get(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x3A1c1d1c06bE03cDDC4d3332F7C20e1B37c97CE9&apikey=${ apikey }`, config);
        const priceRes = await axios.get("https://api.coingecko.com/api/v3/coins/vybe?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false", config);
        const price = Number(priceRes.data.market_data.current_price.usd.toFixed(2));
        const volume = priceRes.data.market_data.total_volume.usd;
        const totalSupply = Number(new BigNumber(supplyRes.data.result).shiftedBy(-18).toNumber().toFixed(0)); // format number down to single digits millions - 2.1M

        let today = Date.now();
        let lockedSupply;

        if (today < 1601510400000) {
            // Current
            lockedSupply = 1500000;
        } else if (today < 1604188800000) {
            // Oct 2020 - Nov 2020
            // 200K unlocks
            lockedSupply = 1300000;
        } else if (today < 1606780800000) {
            // Nov 2020 - Dec 2020
            // 300K unlocks
            lockedSupply = 1000000;
        } else if (today < 1614556800000) {
            // Dec 2020 - Mar 2021
            // 350K unlocks
            lockedSupply = 650000;
        } else if (today < 1622505600000) {
            // Mar 2021 - Jun 2021
            // 350K unlocks
            lockedSupply = 300000;
        } else {
            // After Jun 2021
            // 300K unlocks
            lockedSupply = 0;
        }

        const circulatingSupply = Number((totalSupply - lockedSupply).toFixed(0));

        const current_data = {
            price,
            volume,
            total_supply: totalSupply,
            circulating_supply: circulatingSupply
        };
        fs.writeFileSync((__dirname, 'data.json'), JSON.stringify(current_data));
    } catch (err) {
        console.log(err);
    }

    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(0);
}
