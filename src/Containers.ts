

//container
interface Container {
    peek: () => any;
    poll: () => any;
    appendItem: (item: any) => void;
    combine: (container: Container) => void;
    size: () => number;
    getList: () => LinkedList;
}

//queue
class Queue implements Container {
    linkedList: LinkedList;
    length: number = 0;
    constructor(linkedList: LinkedList = new LinkedList()) {
        this.linkedList = linkedList;
    }

    peek(): any {
        if (this.linkedList !== null) {
            return this.linkedList.item;
        }
        return null;
    }

    poll(): any {
        let temp = this.linkedList.item;
        if (this.linkedList.next === null) {
            this.linkedList.item = null;
            this.length = 0;
        } else {
            this.linkedList = this.linkedList.next;
            this.length --;
        }
        return temp;
    }

    appendItem(item: any) {
        this.linkedList.appendItem(item)
        this.length ++;
    }

    combine(container: Container) {
        this.length += container.size();
        this.linkedList.combine(container.getList());
    }

    getList(): LinkedList {
        return this.linkedList;
    }

    size(): number {
        return this.length;
    }
}

//LinkedList class
class LinkedList {
    item: any | null = null;
    next: LinkedList | null = null;
    constructor(item: any | null = null, next: LinkedList | null = null) {
        this.item = item;
        this.next = next;
    }
    length(): number {
        if (this.next === null || this.item === null) {
            return 0;
        }
        return 1 + this.next.length();
    }
    appendItem(item: any) {
        if (this.next === null || this.item === null) {
            this.item = item;
            this.next = new LinkedList(null, null);
        } else if (this.next != null) {
            this.next.appendItem(item);
        } else {
            console.error("Attempted to append to null, LinkedList.isEmpty() must be broken");
        }
    }
    combine(other: LinkedList) {
        let end = this.advance(this.length() - 1);
        if (end === null) {
            console.error("bad advance!");
        } else {
            end.next = other;
        }
        
    }
    removeItem(item: any): boolean {
        if (this.next === null || this.item === null) {
            return false;
        } else if (this.item == item) {
            this.remove();
            return true;
        }
        return this.next.removeItem(item);
    }
    remove(): any {
        if (this.next !== null && this.item !== null) {
            let temp = this.item
            this.item = this.next.item;
            this.next = this.next.next;
            return temp;
        }
        return null;
    }
    advance(n: number): LinkedList | null {
        if (n <= 0) {
            return this;
        } else if (this.next === null || this.item === null) {
            return null;
        } else {
            return this.next.advance(n - 1);
        }
    }
    at(p: number): any {
        let sublist = this.advance(p);
        return (sublist === null) ? null : sublist.item;
    }
    isEmpty() {
        return this.item === null;
    }
}