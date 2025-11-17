// 1. Множественное наследование (MRO)
const Loggable = { log(msg) { console.log(`[${this.constructor.name}] ${msg}`); } };
const Serializable = { serialize() { return JSON.stringify(this); } };

class BaseClass {
    constructor() { Object.assign(this, Loggable, Serializable); }
}

// 2. Класс Stack
class Stack extends BaseClass {
    constructor() {
        super();
        this.items = [];
    }
    push(item) { this.items.push(item); }
    pop() { return this.isEmpty() ? null : this.items.pop(); }
    peek() { return this.isEmpty() ? null : this.items[this.items.length - 1]; }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
    clear() { this.items = []; }
    getAll() { return [...this.items]; }
}

// 3. Factory Method
class Wagon {
    constructor(type, number) {
        this.type = type;
        this.number = number;
    }
    toString() { return `Вагон ${this.type}-${this.number}`; }
}

class WagonTypeA extends Wagon {
    constructor(number) { super('A', number); }
}

class WagonTypeB extends Wagon {
    constructor(number) { super('B', number); }
}

class WagonFactory {
    static createWagon(type, number) {
        return type.toUpperCase() === 'A' ? new WagonTypeA(number) : 
               type.toUpperCase() === 'B' ? new WagonTypeB(number) : 
               null;
    }
    static createFromString(str) {
        const [type, number] = str.split('-');
        return this.createWagon(type, parseInt(number));
    }
}

// 4. Т-образный сортировочный узел
class RailwaySortingYard {
    constructor() {
        this.inputStack = new Stack();
        this.directionA = new Stack();
        this.directionB = new Stack();
    }

    _parseWagons(lines) {
        return lines
            .map(line => line.trim())
            .filter(line => line)
            .map(line => WagonFactory.createFromString(line))
            .filter(w => w !== null);
    }

    loadFromFile(fileContent) {
        this.inputStack.clear();
        const wagons = this._parseWagons(fileContent.trim().split('\n'));
        wagons.forEach(w => this.inputStack.push(w));
        return wagons.length;
    }

    loadFromKeyboard(inputLines) {
        this.inputStack.clear();
        const wagons = this._parseWagons(inputLines);
        wagons.forEach(w => this.inputStack.push(w));
        return wagons.length;
    }

    sort() {
        while (!this.inputStack.isEmpty()) {
            const wagon = this.inputStack.pop();
            (wagon.type === 'A' ? this.directionA : this.directionB).push(wagon);
        }
    }

    printResults() {
        console.log('\n=== Результаты сортировки ===');
        console.log(`Направление A: ${this.directionA.size()} вагонов`);
        if (this.directionA.size() > 0) {
            console.log('  Вагоны:', this.directionA.getAll().map(w => w.toString()).join(', '));
        }
        console.log(`Направление B: ${this.directionB.size()} вагонов`);
        if (this.directionB.size() > 0) {
            console.log('  Вагоны:', this.directionB.getAll().map(w => w.toString()).join(', '));
        }
    }
}

// Демонстрация
function demonstrate() {
    const yard = new RailwaySortingYard();
    
    console.log('--- Пример 1: Загрузка с клавиатуры ---');
    yard.loadFromKeyboard(['A-1', 'B-1', 'A-2', 'B-2', 'A-3', 'B-3']);
    yard.sort();
    yard.printResults();
    
    console.log('\n--- Пример 2: Загрузка из файла ---');
    yard.inputStack.clear();
    yard.directionA.clear();
    yard.directionB.clear();
    yard.loadFromFile('A-10\nB-10\nA-11\nA-12\nB-11\nB-12\nA-13');
    yard.sort();
    yard.printResults();
    
    console.log('\n--- Пример 3: MRO и миксины ---');
    const stack = new Stack();
    stack.push('test');
    console.log('Сериализация:', stack.serialize());
    stack.log('Тест миксина');
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Stack, Wagon, WagonTypeA, WagonTypeB, WagonFactory, RailwaySortingYard, demonstrate };
}

// Запуск
if (typeof require !== 'undefined' && require.main === module) {
    demonstrate();
}
