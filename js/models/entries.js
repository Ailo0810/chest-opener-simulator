import ItemModifier from "./item_modifiers.js";
import { ItemStack, EmptyStack } from "./item_stacks.js";

export default class Entry {
    static from(entry) {
        const Type = entryTypes[entry.type];
        if (!Type) throw new Error(`Unsupported entry type: ${entry.type}`);
        return new Type(entry);
    }
    constructor(entry) {
        this.weight = entry.weight ?? 1;
        this.functions = (entry.functions ?? []).map(modif => ItemModifier.from(modif));
    }
    enchantmentPrefix() {
        for (const func of this.functions) {
            if (Object.hasOwn(func, "enchantments") || Object.hasOwn(func, "options"))
                return "Enchanted "; 
        }
        return ""
    }
    countSuffix() {
        for (const func of this.functions) {
            if (!Object.hasOwn(func, "count"))
                continue
            if (!Object.hasOwn(func.count, "value"))
                return " × " + func.count.toStr();
            if (func.count.value <= 1)
                return "";  
        }
        return ""
    }
}

class ItemEntry extends Entry {
    constructor(entry) {
        super(entry);
        this.name = entry.name;
    }
    async generateStack() {
        const itemStack = new ItemStack(this.name);
        for (const func of this.functions) await func.apply(itemStack);
        return itemStack;
    }
}

class EmptyEntry extends Entry {
    constructor(entry) {
        super(entry);
        this.name = "Nothing";
    }
    generateStack() {
        return new EmptyStack();
    }
}

const entryTypes = {
    "minecraft:item":  ItemEntry,
    "minecraft:empty": EmptyEntry
}