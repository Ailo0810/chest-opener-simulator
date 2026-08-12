import NumberProvider from "./number_providers.js";
import { getSupportedEnchantments, ENCHANTABILITY_REF } from "../utils/enchantments.js";

export default class ItemModifier {
    static from(modifier) {
        const Type = MODIFIER_TYPES[modifier.function];
        if (!Type) throw new Error(`Unsupported item modifier: ${modifier.function}`);
        return new Type(modifier);
    }
}

class SetCount extends ItemModifier {
    constructor(modifier) {
        super();
        this.count = NumberProvider.from(modifier.count);
    }
    apply(itemStack) {
        itemStack.count = this.count.get();
    }
}

class SetDamage extends ItemModifier {
    constructor(modifier) {
        super();
        this.damage = NumberProvider.from(modifier.damage);
    }
    apply(itemStack) {
        itemStack.components.durability = this.damage.get();
    }
}

class SetEnchantments extends ItemModifier {
    constructor(modifier) {
        super();
        this.enchantments = modifier.enchantments;
    }
    apply(itemStack) {
        if (itemStack.name === "minecraft:book") itemStack.name = "minecraft:enchanted_book";

        itemStack.components.enchantments = {};
        for (const [ench, value] of Object.entries(this.enchantments))
            itemStack.components.enchantments[ench] = NumberProvider.from(value).get();
    }
}

class EnchantRandomly extends ItemModifier {
    constructor(modifier) {
        super();
        this.options = modifier.options;
    }
    #roll(enchantments) {
        const index = Math.floor(Math.random() * enchantments.length);
        return enchantments[index];
    }
    async apply(itemStack) {
        if (itemStack.name === "minecraft:book") itemStack.name = "minecraft:enchanted_book";

        const enchantments = await getSupportedEnchantments(itemStack, this.options);
        const enchantment = this.#roll(enchantments);
        const level = 1 + Math.floor(Math.random() * enchantment.maxLevel);

        itemStack.components.enchantments = {};
        itemStack.components.enchantments[enchantment.id] = level;
    }
}

class EnchantWithLevels extends ItemModifier {
    constructor(modifier) {
        super();
        this.levels = NumberProvider.from(modifier.levels);
        this.options = modifier.options;
    }
    #getReducedEnchantability(itemStack) {
        const enchantability = ENCHANTABILITY_REF[itemStack.name];
        if (enchantability === undefined) return 0;
        return Math.floor(enchantability / 4);
    }
    #getCost(itemStack) {
        const reducedEnchantability = this.#getReducedEnchantability(itemStack);
        const int1 = Math.floor(Math.random() * (1 + reducedEnchantability));
        const int2 = Math.floor(Math.random() * (1 + reducedEnchantability));
        const float1 = 0.15 * Math.random();
        const float2 = 0.15 * Math.random();
        return Math.round(
            (this.levels.get() + 1 + int1 + int2) * (0.85 + float1 + float2)
        );
    }
    #getCandidates(enchantments, cost) {
        const candidates = [];
        for (const ench of enchantments) {
            for (let lvl = ench.maxLevel; lvl >= 1; lvl--) {
                if (ench.getMinCostAtLevel(lvl) <= cost && cost <= ench.getMaxCostAtLevel(lvl)) {
                    candidates.push({enchantment: ench, level: lvl});
                    break;
                }
            }
        }
        return candidates;
    }
    #roll(candidates) {
        let totalWeight = 0;
        for (const candidate of candidates) totalWeight += candidate.enchantment.weight;

        const threshold = Math.random() * totalWeight;
        let cumulative = 0;
        for (const candidate of candidates) {
            cumulative += candidate.enchantment.weight;
            if (cumulative > threshold) return candidate;
        } 
    }
    async #getNewCandidates(candidates, selectedCandidate) {
        const newCandidates = [];
            for (const candidate of candidates) {
                if (selectedCandidate.enchantment.id == candidate.enchantment.id) continue;
                if ((await selectedCandidate.enchantment.incompatibleIdsList()).includes(candidate.enchantment.id)) continue;
                newCandidates.push(candidate);
            }
        return newCandidates;
    }
    async apply(itemStack) {
        if (itemStack.name === "minecraft:book") itemStack.name = "minecraft:enchanted_book";

        const enchantments = await getSupportedEnchantments(itemStack, this.options);
        let cost = this.#getCost(itemStack);
        let candidates = this.#getCandidates(enchantments, cost);

        itemStack.components.enchantments = {};
        let isSelecting = true;
        while (isSelecting) {
            const selectedCandidate = this.#roll(candidates);
            itemStack.components.enchantments[selectedCandidate.enchantment.id] = selectedCandidate.level;

            candidates = await this.#getNewCandidates(candidates, selectedCandidate);
            if (candidates.length === 0) isSelecting = false;

            if (Math.random() > (cost + 1) / 50) isSelecting = false;
            cost = Math.floor(cost / 2);
        }
    }
}

class SetPotion extends ItemModifier {
    constructor(modifier) {
        super();
        this.id = modifier.id;
    }
    apply(itemStack) {
        itemStack.components.potionContents = {};
        itemStack.components.potionContents.potion = this.id;
    }
}

class SetOminousBottleAmplifier extends ItemModifier {
    constructor(modifier) {
        super();
        this.amplifier = NumberProvider.from(modifier.amplifier);
    }
    apply(itemStack) {
        itemStack.components.ominousBottleAmplifier = this.amplifier.get();
    }
}

class ExplorationMap extends ItemModifier {
    constructor(modifier) {
        super();
        this.destination = modifier.destination ?? "on_treasure_maps";
        this.decoration = modifier.decoration ?? "mansion";
        this.zoom = modifier.zoom ?? 2;
        this.searchRadius = modifier.search_radius ?? 50;
    }
    apply(itemStack) {
        itemStack.components.map = {destination: this.destination}; // matching the actual game mechanics is useless here
    }
}

class SetName extends ItemModifier {
    constructor(modifier) {
        super();
        this.name = modifier.name;
        this.target = modifier.target;
    }
    apply(itemStack) {
        itemStack.components.itemName = "Buried Treasure"; // works for this set of loot tables but should be changed in the future
    }
}

class SetStewEffect extends ItemModifier {
    constructor(modifier) {
        super();
        this.effects = modifier.effects.map(effect => ({
            type: effect.type, 
            duration: NumberProvider.from(effect.duration)
        }));
    }
    apply(itemStack) {
        itemStack.components.suspicious_stew_effects = this.effects.map(effect => ({
            id: effect.type, 
            duration: effect.duration.get()
        }));
    }
}

const MODIFIER_TYPES = {
    "minecraft:set_count":                    SetCount,
    "minecraft:set_damage":                   SetDamage,
    "minecraft:set_enchantments":             SetEnchantments,
    "minecraft:enchant_randomly":             EnchantRandomly,
    "minecraft:enchant_with_levels":          EnchantWithLevels,
    "minecraft:set_potion":                   SetPotion,
    "minecraft:set_ominous_bottle_amplifier": SetOminousBottleAmplifier,
    "minecraft:exploration_map":              ExplorationMap,
    "minecraft:set_name":                     SetName,
    "minecraft:set_stew_effect":              SetStewEffect
}