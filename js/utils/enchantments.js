import { getEnchantment } from "./fetch.js"
import { idOrArrayOrTagToList } from "./tags.js"

async function getEnchantmentsFromOptions(options) {
    const enchantmentIds = await idOrArrayOrTagToList(options, "enchantment");
    return Promise.all(enchantmentIds.map(ench => getEnchantment(ench)));
}

export async function getSupportedEnchantments(itemStack, options) {
    const enchantments = await getEnchantmentsFromOptions(options);
    const supportedEnchantments = [];
    await Promise.all(
        enchantments.map(async ench => {
            if (await ench.supportsItem(itemStack)) supportedEnchantments.push(ench);
        })
    );
    return supportedEnchantments;
}

export const ENCHANTABILITY_REF = {
    "minecraft:golden_helmet": 25,
    "minecraft:golden_chestplate": 25,
    "minecraft:golden_leggings": 25,
    "minecraft:golden_boots": 25,
    "minecraft:golden_sword": 22,
    "minecraft:golden_spear": 22,
    "minecraft:golden_pickaxe": 22,
    "minecraft:golden_axe": 22,
    "minecraft:golden_shovel": 22,
    "minecraft:golden_hoe": 22,
    "minecraft:mace": 15,
    "minecraft:netherite_helmet": 15,
    "minecraft:netherite_chestplate": 15,
    "minecraft:netherite_leggings": 15,
    "minecraft:netherite_boots": 15,
    "minecraft:netherite_sword": 15,
    "minecraft:netherite_spear": 15,
    "minecraft:netherite_pickaxe": 15,
    "minecraft:netherite_axe": 15,
    "minecraft:netherite_shovel": 15,
    "minecraft:netherite_hoe": 15,
    "minecraft:leather_helmet": 15,
    "minecraft:leather_chestplate": 15,
    "minecraft:leather_leggings": 15,
    "minecraft:leather_boots": 15,
    "minecraft:wooden_sword": 15,
    "minecraft:wooden_spear": 15,
    "minecraft:wooden_pickaxe": 15,
    "minecraft:wooden_axe": 15,
    "minecraft:wooden_shovel": 15,
    "minecraft:wooden_hoe": 15,
    "minecraft:iron_helmet": 9,
    "minecraft:iron_chestplate": 9,
    "minecraft:iron_leggings": 9,
    "minecraft:iron_boots": 9,
    "minecraft:iron_sword": 14,
    "minecraft:iron_spear": 14,
    "minecraft:iron_pickaxe": 14,
    "minecraft:iron_axe": 14,
    "minecraft:iron_shovel": 14,
    "minecraft:iron_hoe": 14,
    "minecraft:copper_helmet": 8,
    "minecraft:copper_chestplate": 8,
    "minecraft:copper_leggings": 8,
    "minecraft:copper_boots": 8,
    "minecraft:copper_sword": 13,
    "minecraft:copper_spear": 13,
    "minecraft:copper_pickaxe": 13,
    "minecraft:copper_axe": 13,
    "minecraft:copper_shovel": 13,
    "minecraft:copper_hoe": 13,
    "minecraft:diamond_helmet": 10,
    "minecraft:diamond_chestplate": 10,
    "minecraft:diamond_leggings": 10,
    "minecraft:diamond_boots": 10,
    "minecraft:diamond_sword": 10,
    "minecraft:diamond_spear": 10,
    "minecraft:diamond_pickaxe": 10,
    "minecraft:diamond_axe": 10,
    "minecraft:diamond_shovel": 10,
    "minecraft:diamond_hoe": 10,
    "minecraft:turtle_helmet": 9,
    "minecraft:chainmail_helmet": 12,
    "minecraft:chainmail_chestplate": 12,
    "minecraft:chainmail_leggings": 12,
    "minecraft:chainmail_boots": 12,
    "minecraft:stone_sword": 5,
    "minecraft:stone_spear": 5,
    "minecraft:stone_pickaxe": 5,
    "minecraft:stone_axe": 5,
    "minecraft:stone_shovel": 5,
    "minecraft:stone_hoe": 5,
}