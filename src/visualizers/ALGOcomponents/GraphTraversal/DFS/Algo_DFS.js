export class Algo_DFS {
    constructor(graph, startNodeId, targetNodeId = null) {
        this.graph = graph;
        this.startNodeId = startNodeId;
        this.targetNodeId = targetNodeId;
        this.history = [];
    }

    _recordHistory(type, description, details = {}) {
        this.history.push({
            type,
            description,
            ...details,
            // Use 'stackState' to differentiate from BFS's 'queueState'
            stackState: [...(details.stackState || [])],
            visitedState: new Set(details.visitedState || new Set()),
        });
    }

    reconstructPath(parents, targetNode) {
        const path = [];
        let current = targetNode;
        while (current !== null) {
            path.unshift(current);
            current = parents[current];
        }
        return path;
    }

    run() {
        this.history = [];
        const stack = [this.startNodeId];
        const visited = new Set();
        const parents = { [this.startNodeId]: null };

        this._recordHistory('start', `Starting DFS from node ${this.startNodeId}.`, {
            stackState: [...stack],
            visitedState: visited,
        });

        while (stack.length > 0) {
            const currentNode = stack.pop();

            if (visited.has(currentNode)) {
                this._recordHistory('skip_visited', `Node ${currentNode} already visited. Skipping.`, {
                    stackState: [currentNode, ...stack],
                    visitedState: visited,
                    currentNode: currentNode,
                });
                continue;
            }
            
            visited.add(currentNode);

            this._recordHistory('pop', `Popping node ${currentNode} to visit it.`, {
                stackState: [currentNode, ...stack],
                visitedState: visited,
                currentNode: currentNode,
            });

            if (currentNode === this.targetNodeId) {
                const path = this.reconstructPath(parents, this.targetNodeId);
                this._recordHistory('found', `Target ${this.targetNodeId} found! Path reconstructed.`, {
                    stackState: stack,
                    visitedState: visited,
                    currentNode: currentNode,
                    path: path,
                });
                return this.history;
            }

            const neighbors = this.graph.nodes[currentNode].neighbors;
            // Reverse neighbors to maintain a more intuitive traversal order (optional but good for visuals)
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const neighborId = neighbors[i];
                if (!visited.has(neighborId)) {
                    parents[neighborId] = currentNode;
                    stack.push(neighborId);
                    this._recordHistory('push', `Pushing unvisited neighbor ${neighborId} onto the stack.`, {
                        stackState: stack,
                        visitedState: visited,
                        currentNode: currentNode,
                        highlightedEdge: { from: currentNode, to: neighborId },
                    });
                }
                else {
                     this._recordHistory('skip_neighbor', `Neighbor ${neighborId} already visited. Skipping.`, {
                        stackState: stack,
                        visitedState: visited,
                        currentNode: currentNode,
                        highlightedEdge: { from: currentNode, to: neighborId },
                    });
                }
            }
             this._recordHistory('node_processed', `Finished processing neighbors of ${currentNode}.`, {
                stackState: stack,
                visitedState: visited,
                currentNode: null,
            });
        }
        
        const endMessage = this.targetNodeId !== null 
            ? `DFS complete. Target ${this.targetNodeId} not found.`
            : 'DFS complete. Stack is empty.';

        this._recordHistory('end', endMessage, {
            stackState: [],
            visitedState: visited,
        });
        return this.history;
    }
}