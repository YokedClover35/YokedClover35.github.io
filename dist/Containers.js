"use strict";
//queue
class Queue {
    constructor(linkedList = new LinkedList()) {
        this.length = 0;
        this.linkedList = linkedList;
    }
    peek() {
        if (this.linkedList !== null) {
            return this.linkedList.item;
        }
        return null;
    }
    poll() {
        let temp = this.linkedList.item;
        if (this.linkedList.next === null) {
            this.linkedList.item = null;
            this.length = 0;
        }
        else {
            this.linkedList = this.linkedList.next;
            this.length--;
        }
        return temp;
    }
    appendItem(item) {
        this.linkedList.appendItem(item);
        this.length++;
    }
    combine(container) {
        this.length += container.size();
        this.linkedList.combine(container.getList());
    }
    getList() {
        return this.linkedList;
    }
    size() {
        return this.length;
    }
}
//LinkedList class
class LinkedList {
    constructor(item = null, next = null) {
        this.item = null;
        this.next = null;
        this.item = item;
        this.next = next;
    }
    length() {
        if (this.next === null || this.item === null) {
            return 0;
        }
        return 1 + this.next.length();
    }
    appendItem(item) {
        if (this.next === null || this.item === null) {
            this.item = item;
            this.next = new LinkedList(null, null);
        }
        else if (this.next != null) {
            this.next.appendItem(item);
        }
        else {
            console.error("Attempted to append to null, LinkedList.isEmpty() must be broken");
        }
    }
    combine(other) {
        let end = this.advance(this.length() - 1);
        if (end === null) {
            console.error("bad advance!");
        }
        else {
            end.next = other;
        }
    }
    removeItem(item) {
        if (this.next === null || this.item === null) {
            return false;
        }
        else if (this.item == item) {
            this.remove();
            return true;
        }
        return this.next.removeItem(item);
    }
    remove() {
        if (this.next !== null && this.item !== null) {
            let temp = this.item;
            this.item = this.next.item;
            this.next = this.next.next;
            return temp;
        }
        return null;
    }
    advance(n) {
        if (n <= 0) {
            return this;
        }
        else if (this.next === null || this.item === null) {
            return null;
        }
        else {
            return this.next.advance(n - 1);
        }
    }
    at(p) {
        let sublist = this.advance(p);
        return (sublist === null) ? null : sublist.item;
    }
    isEmpty() {
        return this.item === null;
    }
}
