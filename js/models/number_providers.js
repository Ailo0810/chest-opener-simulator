export default class NumberProvider {
    static from(value) {
        if (typeof value == "number") return new NumberConstant(value);
        switch (value.type) {
            case "minecraft:uniform": return new NumberUniform(value);
            default:                  throw new Error(`Unsupported number provider type: ${value.type}`);
        }
    }
}

class NumberConstant extends NumberProvider {
    constructor(value) {
        super();
        this.value = value;
    }
    get() {
        return this.value;
    }
    toStr() {
        return `${this.value}`;
    }
}

class NumberUniform extends NumberProvider {
    constructor(value) {
        super();
        this.min = value.min;
        this.max = value.max;
    }
    get() {
        if (this.max <= this.min) 
            return this.min;
        if (Number.isInteger(this.min) && Number.isInteger(this.max)) 
            return this.min + Math.floor(Math.random() * (this.max - this.min + 1));
        return this.min + Math.random() * (this.max - this.min);
    }
    toStr() {
        return `${this.min}-${this.max}`;
    }
}