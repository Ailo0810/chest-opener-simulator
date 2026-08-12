import Chest from "../models/chest.js";
import Enchantment from "../models/enchatment.js"

export async function getChestFromURLParam() {
    const targetChestId = new URLSearchParams(location.search).get("id");    
    const chestsRef = await fetch("../manifest/chest_ref.json").then(r => r.json());

    for (const ref of chestsRef) {
        if (ref.id !== targetChestId) continue;

        const lootTable = await fetch("../" + ref.path).then(r => r.json());
        const chest = { name: ref.name, content: lootTable, id: ref.id };
        return new Chest(chest);
    }
    throw new Error(`Unknown chest: ${targetChestId}`);
}

export async function getEnchantment(enchantmentId) {
    const enchantmentsRef = await fetch("../manifest/enchantment_ref.json").then(r => r.json());

    for (const ref of enchantmentsRef) {
        if (ref.id !== enchantmentId) continue;
        
        const enchantment = await fetch("../" + ref.path).then(r => r.json());
        enchantment.id = ref.id;
        return new Enchantment(enchantment);
    }
    throw new Error(`Unknown enchantment: ${enchantmentId}`);
}

/**
 * @param {'enchantment' | 'item'} argType
 */
export async function getTagValues(tag, tagType) {
    if (!tag.startsWith("#"))
        throw new Error(`${tag} is not a tag`);

    const path = tag.slice(1).replace(/^minecraft:/, "");
    const tagJson = await fetch(`../data/tag/${tagType}/${path}.json`).then(r => r.json());
    return tagJson.values;
}
