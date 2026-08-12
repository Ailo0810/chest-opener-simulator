import Chest from "./models/chest.js";
import { getChestFromURLParam } from "./utils/fetch.js";
import { poolToHtmlTable } from "./utils/pool_info.js";

function waitForClick(button) {
    return new Promise(resolve => {
        button.addEventListener('click', resolve, { once: true });
    });
}

async function main() {
    const chest = await getChestFromURLParam();
    document.querySelector("h1").textContent = chest.name;

    const rewardDiv     = document.querySelector("#rewardDiv");
    const poolCountInfo = document.querySelector("#poolCountInfo");
    const rollCountInfo = document.querySelector("#rollCountInfo");
    const rollButton    = document.querySelector("#rollButton");
    const poolDiv       = document.querySelector("#poolDiv");
    const obtainedList  = document.querySelector("#obtainedList");

    const lootTable = chest.content;
    const maxPools = lootTable.pools.length;

    for (let poolCounter = 1; poolCounter <= maxPools; poolCounter++) {
        const pool = lootTable.pools[poolCounter-1];
        const maxRolls = pool.rolls.get();

        rewardDiv.textContent = "?";
        rollButton.textContent = "Roll";

        poolCountInfo.textContent = `Pool ${poolCounter}/${maxPools}.`;
        rollCountInfo.textContent = `Remaining rolls: ${maxRolls}`

        poolDiv.textContent = "";
        poolDiv.append(`Pool ${poolCounter}:`);
        poolDiv.append(poolToHtmlTable(pool));
        poolDiv.append(`(possible rolls: ${pool.rolls.toStr()})`);

        for (let rollCounter = 1; rollCounter <= maxRolls; rollCounter++) {
            await waitForClick(rollButton);
            rollButton.disabled = true;
            const reward = await pool.roll();
            rollButton.disabled = false;

            rollCountInfo.textContent = `Remaining rolls: ${maxRolls - rollCounter}`
            rewardDiv.textContent = reward.format();
            reward.appendToHtmlList(obtainedList);
        }
        
        rollButton.textContent = "Next pool";
        if (poolCounter === maxPools) rollButton.textContent = "Finish";
        await waitForClick(rollButton);
    }

    rewardDiv.textContent = "";
    rewardDiv.append("All done! Your rewards:");
    rewardDiv.append(obtainedList);

    rollButton.disabled = true;
    poolDiv.textContent = "";
    document.querySelector("#pObtained").textContent = "";
    document.querySelector("#reloadPageLink").textContent = "Open again";
    document.querySelector("#mainPageLink").textContent = "Choose another chest";
}

main();
