
const { ccclass, property } = cc._decorator;
@ccclass
class Stack<T> {
    private items: T[];
    constructor() {
        this.items = [];
    }

    push(item: T) {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
    }

    size(): number {
        return this.items.length;
    }
}
