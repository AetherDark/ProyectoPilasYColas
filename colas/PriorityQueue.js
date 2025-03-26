class Node {
    constructor(data, priority, order) {
        this.data = data;
        this.priority = priority;
        this.order = order;
        this.next = null;
    }
}

class PriorityQueue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
        this.orderCounter = 0;
    }

    enqueue(data, priority) {
        this.orderCounter = this.orderCounter + 1;
        const newNode = new Node(data, priority, this.orderCounter);
        this.size = this.size + 1;

        if (this.front === null) {
            this.front = newNode;
            this.rear = newNode;
            return;
        }

        if (priority > this.front.priority) {
            newNode.next = this.front;
            this.front = newNode;
            return;
        }

        let current = this.front;
        let previous = null;

        while (current !== null && 
                (current.priority > priority || 
                (current.priority === priority && current.order < newNode.order))) {
            previous = current;
            current = current.next;
        }

        if (current === null) {
            previous.next = newNode;
            this.rear = newNode;
        } else {
            previous.next = newNode;
            newNode.next = current;
        }
    }

    dequeue() {
        if (this.front === null) return null;
        
        const removed = this.front;
        this.front = this.front.next;
        this.size = this.size - 1;

        if (this.front === null) {
            this.rear = null;
        }

        return removed.data;
    }

    isEmpty() {
        return this.front === null;
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.front.data;
    }

    toArray() {
        const result = new Array(this.size);
        let current = this.front;
        let i = 0;
        
        while (current !== null) {
            result[i] = current.data;
            current = current.next;
            i = i + 1;
        }
        
        return result;
    }
}