import { idOrArrayOrTagToList } from "../utils/tags.js"

export default class Enchantment {
    constructor(enchantment) {
        this.id = enchantment.id;
        this.exclusiveSet = enchantment.exclusive_set ?? [];
        this.supportedItems = enchantment.supported_items;
        this.maxLevel = enchantment.max_level;
        this.weight = enchantment.weight;
        this.minCost = {
            base: enchantment.min_cost.base,
            perLevelAboveFirst: enchantment.min_cost.per_level_above_first
        };
        this.maxCost = {
            base: enchantment.max_cost.base,
            perLevelAboveFirst: enchantment.max_cost.per_level_above_first
        };
    }
    async supportsItem(itemStack) {
        if (itemStack.name === "minecraft:enchanted_book") return true;

        const supportedItems = await idOrArrayOrTagToList(this.supportedItems, "item");
        return supportedItems.includes(itemStack.name);
    }
    async incompatibleIdsList() {
        if (this.exclusiveSet.length === 0) return [];
        return await idOrArrayOrTagToList(this.exclusiveSet, "enchantment");
    }
    getMinCostAtLevel(level) {
        return this.minCost.base + (level - 1) * this.minCost.perLevelAboveFirst;
    }
    getMaxCostAtLevel(level) {
        return this.maxCost.base + (level - 1) * this.maxCost.perLevelAboveFirst;
    }
}