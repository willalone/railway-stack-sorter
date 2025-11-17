# Railway Stack Sorter

Симулятор Т-образного сортировочного узла на железной дороге, реализующий основные концепции объектно-ориентированного программирования и паттерны проектирования.

## Описание проекта

Программа моделирует работу Т-образного сортировочного узла, который разделяет железнодорожный состав на два направления в зависимости от типа вагонов. Состав состоит из вагонов двух типов (A и B), и каждый тип направляется в соответствующее направление.

## Реализованные концепции

1. **Множественное наследование (MRO)** - через миксины
2. **Класс Stack** - реализация структуры данных "стек"
3. **Т-образный сортировочный узел** - основная логика программы
4. **Паттерн Factory Method** - для создания вагонов

## Архитектура и подходы

### 1. Множественное наследование через миксины (MRO)

В JavaScript нет прямого множественного наследования, поэтому используется подход с **миксинами** (mixins) - объектами, содержащими методы, которые можно "примешать" к классам.

```javascript
const Loggable = { 
    log(msg) { 
        console.log(`[${this.constructor.name}] ${msg}`); 
    } 
};

const Serializable = { 
    serialize() { 
        return JSON.stringify(this); 
    } 
};

class BaseClass {
    constructor() { 
        Object.assign(this, Loggable, Serializable); 
    }
}
```

**Как это работает:**
- `Object.assign()` копирует методы из миксинов в экземпляр класса
- Это позволяет классам наследовать функциональность от нескольких источников
- Порядок разрешения методов (MRO) определяется порядком применения миксинов в `Object.assign()`

### 2. Класс Stack

Реализация структуры данных **стек** (LIFO - Last In, First Out) с использованием массива.

```javascript
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
```

**Методы:**
- `push(item)` - добавляет элемент в вершину стека
- `pop()` - извлекает и возвращает элемент с вершины стека
- `peek()` - возвращает элемент с вершины без удаления
- `isEmpty()` - проверяет, пуст ли стек
- `size()` - возвращает количество элементов
- `clear()` - очищает стек
- `getAll()` - возвращает копию всех элементов (для отладки)

**Использование в проекте:**
- `inputStack` - входной состав для сортировки
- `directionA` - стек для вагонов типа A
- `directionB` - стек для вагонов типа B

### 3. Паттерн Factory Method

**Factory Method** - порождающий паттерн проектирования, который предоставляет интерфейс для создания объектов без указания их конкретных классов.

```
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
```

### 4. Т-образный сортировочный узел

Основной класс `RailwaySortingYard` моделирует работу сортировочного узла.

**Ключевые методы:**

```
_parseWagons(lines) {
    return lines
        .map(line => line.trim())
        .filter(line => line)
        .map(line => WagonFactory.createFromString(line))
        .filter(w => w !== null);
}
```

Приватный метод для парсинга строк в объекты вагонов. Использует цепочку методов (method chaining) для обработки данных.

```javascript
sort() {
    while (!this.inputStack.isEmpty()) {
        const wagon = this.inputStack.pop();
        (wagon.type === 'A' ? this.directionA : this.directionB).push(wagon);
    }
}
```

Алгоритм сортировки:
1. Извлекает вагон из входного стека
2. Определяет тип вагона
3. Направляет в соответствующий стек направления

### Запуск программы

```bash
node railway-stack-sorter.js
```

### Использование в коде

```
const { RailwaySortingYard, WagonFactory } = require('./railway-stack-sorter.js');

// Создание экземпляра сортировочного узла
const yard = new RailwaySortingYard();

// Загрузка с клавиатуры
yard.loadFromKeyboard(['A-1', 'B-1', 'A-2', 'B-2']);

// Или загрузка из файла
const fileContent = 'A-1\nB-1\nA-2\nB-2';
yard.loadFromFile(fileContent);

// Сортировка
yard.sort();

// Вывод результатов
yard.printResults();
```

### Формат входных данных

Вагоны задаются в формате: `ТИП-НОМЕР`

Примеры:
- `A-1` - вагон типа A с номером 1
- `B-10` - вагон типа B с номером 10

При загрузке из файла каждая строка должна содержать один вагон:
```
A-1
B-1
A-2
B-2
```

## Примеры работы

### Пример 1: Загрузка с клавиатуры

```javascript
const yard = new RailwaySortingYard();
yard.loadFromKeyboard(['A-1', 'B-1', 'A-2', 'B-2', 'A-3', 'B-3']);
yard.sort();
yard.printResults();
```

**Результат:**
```
=== Результаты сортировки ===
Направление A: 3 вагонов
  Вагоны: Вагон A-3, Вагон A-2, Вагон A-1
Направление B: 3 вагонов
  Вагоны: Вагон B-3, Вагон B-2, Вагон B-1
```

### Пример 2: Загрузка из файла

```javascript
const fileContent = 'A-10\nB-10\nA-11\nA-12\nB-11\nB-12\nA-13';
yard.loadFromFile(fileContent);
yard.sort();
yard.printResults();
```
