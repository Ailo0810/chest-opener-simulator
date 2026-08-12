import Entry from "./entries.js";
import NumberProvider from "./number_providers.js";
import ItemModifier from "./item_modifiers.js";

class Pool {
    constructor(pool) {
        this.rolls = NumberProvider.from(pool.rolls);
        this.entries = pool.entries.map(entry => Entry.from(entry));
        this.functions = (pool.functions ?? []).map(modif => ItemModifier.from(modif));
        this.totalWeight = 0;
        for (const entry of this.entries) this.totalWeight += entry.weight;
    }
    async roll() {
        const threshold = Math.random() * this.totalWeight;
        let cumulative = 0;
        for (const entry of this.entries) {
            cumulative += entry.weight;
            if (cumulative > threshold) {
                const itemStack = await entry.generateStack();
                for (const func of this.functions) await func.apply(itemStack);
                return itemStack;
            }
        }
    }
}

class LootTable {
    constructor(lootTable) {
        this.pools = lootTable.pools.map(pool => new Pool(pool))
    }
}

export default class Chest {
    constructor(chest) {
        this.name = chest.name;
        this.content = new LootTable(chest.content)
        this.id = chest.id;
    }
}