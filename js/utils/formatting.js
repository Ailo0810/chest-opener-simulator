export function removePrefixAndCapitalize(str) {
    const strFormatted = str
        .replace(/^minecraft:/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
    if (strFormatted === "Tnt") return "TNT";
    return strFormatted;
}

export function formatPotionId(potion) {
    potion = removePrefixAndCapitalize(potion);
    if (potion.startsWith("Strong "))
        potion = potion.slice("Strong ".length) + " II";
    if (potion.startsWith("Long "))
        potion = potion.slice("Long ".length) + " I (extended)";
    return potion;
}

export function arabicToRoman(number) {
    if (number === 1) return "I"
    if (number === 2) return "II"
    if (number === 3) return "III"
    if (number === 4) return "IV"
    if (number === 5) return "V"
    if (number === 6) return "VI"
}