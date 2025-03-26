class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.top = null;
        this.size = 0;
    }

    push(data) {
        const newNode = new Node(data);
        newNode.next = this.top;
        this.top = newNode;
        this.size = this.size + 1;
    }

    pop() {
        if (this.top === null) {
            return null;
        }
        const popped = this.top.data;
        this.top = this.top.next;
        this.size = this.size - 1;
        return popped;
    }

    peek() {
        if (this.top === null) {
            return null;
        }
        return this.top.data;
    }

    isEmpty() {
        return this.top === null;
    }

    toArray() {
        const result = new Array(this.size);
        let current = this.top;
        let i = 0;
        
        while (current !== null) {
            result[i] = current.data;
            current = current.next;
            i = i + 1;
        }
        
        return result;
    }
}