let nodeId = 0;
class Node {
    constructor(value) {
        this.id = nodeId++;
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0; // The horizontal position on the canvas
        this.y = 0; // The vertical position on the canvas
        this.parent = null; // A reference to the parent node
    }
}

export class DS_BST {
    constructor() {this.root = null; this.history = [];}

    getTreeState() { //get the current state for rendering
        if (!this.root) return { nodes: [], edges: [] };
        const nodes = [];
        const edges = [];
        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            nodes.push({
                id: node.id,
                value: node.value,
                x: node.x,
                y: node.y,
            });
            if (node.left) {
                queue.push(node.left);
                edges.push({ from: node.id, to: node.left.id, side: 'left' });
            }
            if (node.right) {
                queue.push(node.right);
                edges.push({ from: node.id, to: node.right.id, side: 'right' });
            }
        }
        return { nodes, edges };
    }
    _recordHistory(type, description, details = {}) {
        const step = {
            type,
            description,
            treeState: this.getTreeState(),
            ...details
        };
        this.history.push(step);
    }

    
    _assignCoordinates(node, depth, currentX) { // This function is the recursive part of the positioning algorithm
        if (!node) {return currentX;}
        // 1. Recurse on the left child to find the leftmost position
        let newX = this._assignCoordinates(node.left, depth + 1, currentX);
        // 2. Assign coordinates to the current node
        node.y = 50 + depth * 70; // Y is based on depth
        node.x = newX;            // X is the next available horizontal spot
        // 3. After placing the current node, update its children's positions and find the final position for the right subtree
        let finalX = this._assignCoordinates(node.right, depth + 1, newX + 60); // 60px is our horizontal gap
        // 4. Center the parent over its children
        if (node.left && node.right) {node.x = (node.left.x + node.right.x) / 2;}
        else if (node.left) {node.x = node.left.x + 30;} // If only a left child, shift the parent slightly right
        else if (node.right) {node.x = node.right.x - 30;} // If only a right child, shift the parent slightly left
        return finalX;
    }
    
    _shiftTree(node, offset) { //main function that kicks off the process
        if (node) {
            node.x += offset;
            this._shiftTree(node.left, offset);
            this._shiftTree(node.right, offset);
        }
    }
    
    _recalculatePositions(canvasCenter = 500) {
        if (!this.root) return;
        // 1. Assign all the relative X and Y coordinates starting from the left.
        this._assignCoordinates(this.root, 0, 50);
        // 2. Calculate how much we need to shift the tree to center the root.
        const rootX = this.root.x;
        const shiftAmount = canvasCenter - rootX;
        // 3. Apply this shift to every node in the tree.
        this._shiftTree(this.root, shiftAmount);
    }
    
    insert(value, canvasCenter) {
        this.history = [];
        const newNode = new Node(value);
        this._recordHistory('start', `Starting to insert ${value}.`);
        if (!this.root) {
            this.root = newNode;
            this.root.x = canvasCenter; // Center the root node initially
            this.root.y = 50;
            this._recordHistory('insert', `Tree is empty. Inserting ${value} as the root.`, { highlightNodeId: newNode.id });
            this._recordHistory('end', `Insertion of ${value} is complete.`);
            return this.history;
        }
        let current = this.root;
        while (true) {
            this._recordHistory('traverse', `Comparing ${value} with ${current.value}.`, { highlightNodeId: current.id });
            if (value === current.value) {
                this._recordHistory('end', `Value ${value} already exists in the tree. No insertion.`);
                return this.history; // Stop the insertion
            } 
            else if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    newNode.parent = current;
                    break;
                }
                current = current.left;
            }
            else {
                if (!current.right) {
                    current.right = newNode;
                    newNode.parent = current;
                    break;
                }
                current = current.right;
            }
        }
        this._recalculatePositions(canvasCenter); // After inserting, recalculate all positions and record the change
        this._recordHistory('reposition', `Node inserted. Recalculating all node positions.`);
        this._recordHistory('insert', `Inserting ${value}.`, { highlightNodeId: newNode.id });
        this._recordHistory('end', `Insertion of ${value} is complete.`);
        return this.history;
    }

    _findMinNode(node) {
        let current = node;
        while (current && current.left !== null) {
            this._recordHistory('traverse-successor', `Searching for successor, moving left from ${current.value}.`, { highlightNodeId: current.id });
            current = current.left;
        }
        this._recordHistory('traverse-successor', `Successor found: ${current.value}.`, { highlightNodeId: current.id });
        return current;
    }

    delete(value, canvasCenter) {
        this.history = [];
        this._recordHistory('start', `Starting to delete ${value}.`);
        let nodeToDelete = this.root;
        while (nodeToDelete !== null && nodeToDelete.value !== value) {
            this._recordHistory('traverse', `Searching for ${value}, comparing with ${nodeToDelete.value}.`, { highlightNodeId: nodeToDelete.id });
            if (value < nodeToDelete.value) {nodeToDelete = nodeToDelete.left;}
            else {nodeToDelete = nodeToDelete.right;}
        }

        if (nodeToDelete === null) {
            this._recordHistory('end', `Value ${value} not found in the tree.`);
            return this.history;
        }
        this._recordHistory('highlight-delete', `Node with value ${value} found.`, { highlightNodeId: nodeToDelete.id });
        const parent = nodeToDelete.parent;

        // CASE 1: Node has no children (is a leaf)
        if (nodeToDelete.left === null && nodeToDelete.right === null) {
            this._recordHistory('delete-leaf', `Node is a leaf. Removing it.`);
            if (nodeToDelete === this.root) {this.root = null;} 
            else if (parent.left === nodeToDelete) {parent.left = null;}
            else {parent.right = null;}
        }
        // CASE 2: Node has only one child
        else if (nodeToDelete.left === null || nodeToDelete.right === null) {
            this._recordHistory('delete-one-child', `Node has one child. Replacing it with its child.`);
            const child = nodeToDelete.left !== null ? nodeToDelete.left : nodeToDelete.right;
            if (nodeToDelete === this.root) {
                this.root = child;
                child.parent = null;
            }
            else if (parent.left === nodeToDelete) {
                parent.left = child;
                child.parent = parent;
            }
            else {
                parent.right = child;
                child.parent = parent;
            }
        }
        // CASE 3: Node has two children
        else {
            this._recordHistory('delete-two-children', `Node has two children. Finding inorder successor.`);
            const successor = this._findMinNode(nodeToDelete.right);
            this._recordHistory('replace-data', `Replacing ${nodeToDelete.value} with successor's value ${successor.value}.`, { highlightNodeId: nodeToDelete.id });
            nodeToDelete.value = successor.value;
            const successorParent = successor.parent; //delete the successor node (which will have at most one right child)
            const successorChild = successor.right;
            this._recordHistory('delete-successor', `Removing the original successor node.`, { highlightNodeId: successor.id });
            if (successorParent.left === successor) {successorParent.left = successorChild;}
            else {successorParent.right = successorChild;}
            if (successorChild) {successorChild.parent = successorParent;}
        }
        this._recalculatePositions(canvasCenter);
        this._recordHistory('reposition', `Deletion complete. Repositioning tree.`);
        this._recordHistory('end', `Deletion of ${value} is complete.`);
        return this.history;
    }

    find(value) {
        this.history = [];
        this._recordHistory('start', `Starting to search for ${value}.`);
        let current = this.root;
        while (current !== null) {
            this._recordHistory('traverse', `Searching for ${value}, comparing with ${current.value}.`, { highlightNodeId: current.id });
            if (value === current.value) {// Node is found
                this._recordHistory('highlight-found', `Value ${value} found.`, { highlightNodeId: current.id });
                this._recordHistory('end', `Search for ${value} complete. Node was found.`);
                return this.history;
            }
            else if (value < current.value) {current = current.left;} // Move to the left child
            else {current = current.right;}// Move to the right child
        }
        // Loop finished, so the value was not found
        this._recordHistory('end', `Value ${value} not found in the tree.`);
        return this.history;
    }

    // This is the main function called by the UI. It resets the history and calls the correct recursive helper based on the chosen type.
    traverse(type) {
        this.history = [];
        // The output array will be passed by reference to the recursive helpers so they can fill it with the traversed node values.
        const output = []; 
        this._recordHistory('start', `Starting ${type} traversal.`);
        if (this.root !== null) {
            if (type === 'In-order') this._inOrderRecursive(this.root, output);
            else if (type === 'Pre-order') this._preOrderRecursive(this.root, output);
            else if (type === 'Post-order') this._postOrderRecursive(this.root, output);
        }
        //final step to show the complete traversal output.
        this._recordHistory('end', `${type} traversal complete.`, { traversalOutput: output });
        return this.history;
    }

    _inOrderRecursive(node, output) { // Helper for In-order traversal (Left, Root, Right)
        // Step 1: Recursively visit the left child, if it exists.
        if (node.left) {this._inOrderRecursive(node.left, output);}
        // Step 2: Process the current node, highlight it and add its value to our output list.
        this._recordHistory('traverse', `Visiting node ${node.value}.`, { highlightNodeId: node.id });
        output.push(node.value);
        // Step 3: Recursively visit the right child, if it exists.
        if (node.right) {this._inOrderRecursive(node.right, output);}
    }

    _preOrderRecursive(node, output) { // Helper for Pre-order traversal (Root, Left, Right)
        // Step 1: Process the current node first.
        this._recordHistory('traverse', `Visiting node ${node.value}.`, { highlightNodeId: node.id });
        output.push(node.value);
        // Step 2: Recursively visit the left child.
        if (node.left) {this._preOrderRecursive(node.left, output);}
        // Step 3: Recursively visit the right child.
        if (node.right) {this._preOrderRecursive(node.right, output);}
    }

    _postOrderRecursive(node, output) { // Helper for Post-order traversal (Left, Right, Root)
        // Step 1: Recursively visit the left child.
        if (node.left) {this._postOrderRecursive(node.left, output);}
        // Step 2: Recursively visit the right child.
        if (node.right) {this._postOrderRecursive(node.right, output);}
        // Step 3: Process the current node last.
        this._recordHistory('traverse', `Visiting node ${node.value}.`, { highlightNodeId: node.id });
        output.push(node.value);
    }

    clear() {
        this.root = null;
        this.history = [];
        this._recordHistory('start', 'Clearing the tree.');
        this._recordHistory('end', 'Tree cleared.');
        return this.history;
    }

    random(count = 7, maxVal = 100, canvasCenter) {
        this.clear(); // Use the clear method to reset
        this.history = []; // Reset history after clear
        this._recordHistory('start', `Generating a random tree with ${count} nodes.`);
        const values = new Set();
        while(values.size < count) {values.add(Math.floor(Math.random() * maxVal));}
        values.forEach(val => { //insert one by one but only record the final state
            const newNode = new Node(val);
            if (!this.root) {
                this.root = newNode;
            } else {
                let current = this.root;
                while (true) {
                    if (val < current.value) {
                        if (!current.left) { current.left = newNode; newNode.parent = current; break; }
                        current = current.left;
                    } 
                    else {
                        if (!current.right) { current.right = newNode; newNode.parent = current; break; }
                        current = current.right;
                    }
                }
            }
        });
        this._recalculatePositions(canvasCenter);
        this._recordHistory('end', 'Random tree generated.');
        return this.history;
    }
}