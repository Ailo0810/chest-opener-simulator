import { removePrefixAndCapitalize } from "./formatting.js";

function poolToMatrix(pool) {
    let table = [["Item", "Weight", "Probability"]];
    for (const entry of [...pool.entries].sort((a, b) => a.weight - b.weight)) {
        table.push([
            entry.enchantmentPrefix() + removePrefixAndCapitalize(entry.name) + entry.countSuffix(),
            `${entry.weight}/${pool.totalWeight}`,
            (entry.weight / pool.totalWeight * 100).toFixed(1) + "%"
        ]);
    }
    return table;
}

export function poolToHtmlTable(pool) {
    const table = document.createElement("table");
    const poolMatrix = poolToMatrix(pool);
    poolMatrix.forEach((rowItems, rowIndex) => {
        const tr = document.createElement("tr");
        rowItems.forEach(cellContent => {
            const cell = document.createElement(rowIndex === 0 ? "th" : "td");
            cell.textContent = cellContent;
            tr.append(cell);
        });
        table.append(tr);
    });
    table.className = "lootTableTable";
    return table;
}