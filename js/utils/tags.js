import { getTagValues } from "./fetch.js";

async function tagToList(tag, tagType) {
    const values = [];
    
    for (const ench of await getTagValues(tag, tagType)) {
        if (ench.startsWith("#"))
            values.push(...await tagToList(ench, tagType));
        else
            values.push(ench)
    }
    return values;
}

/**
 * @param {'enchantment' | 'item'} argType
 */
export async function idOrArrayOrTagToList(arg, argType) {
    if (Array.isArray(arg))
        return arg;
    if (typeof arg !== "string")
        throw new Error(`Invalid id or array or tag: ${arg}`);
    if (arg.startsWith("#"))
        return await tagToList(arg, argType);
    return [arg];
}