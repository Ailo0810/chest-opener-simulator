import { removePrefixAndCapitalize, formatPotionId, arabicToRoman } from "../utils/formatting.js"

export class ItemStack {
    constructor(name) {
        this.name = name;
        this.count = 1;
        this.components = {};
    }
    
    format() {
        let result = "";
        result += removePrefixAndCapitalize(this.name);

        if (Object.hasOwn(this.components, "potionContents"))
            result += ` of ${formatPotionId(this.components.potionContents.potion)}`;

        if (Object.hasOwn(this.components, "ominousBottleAmplifier"))
            result += " " + arabicToRoman(this.components.ominousBottleAmplifier);

        if (Object.hasOwn(this.components, "itemName"))
            result = `${this.components.itemName} (${result})`

        if (this.count > 1)
            result += ` × ${this.count}`

        if (Object.hasOwn(this.components, "durability"))
            result += `, ${Math.floor(this.components.durability * 100)}% durability`
        
        if (Object.hasOwn(this.components, "enchantments")) {
            for (const [ench, value] of Object.entries(this.components.enchantments))
                result += `, ${removePrefixAndCapitalize(ench)} ${arabicToRoman(value)}`
        }
        return result;
    }
    appendToHtmlList(list) {
        const li = document.createElement("li");
        li.textContent = this.format();
        list.append(li);
    }
}

export class EmptyStack {
    constructor() {
        this.name = "Nothing"
        this.count = 0;
    }
    format() {
        return "Nothing"
    }
    appendToHtmlList(list) {
        // left blank intentionally because nothing should be appended
    }
}