export class Algo_BFS {
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
            queueState: [...(details.queueState || [])],
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
        const queue = [this.startNodeId];
        const visited = new Set([this.startNodeId]);
        const parents = { [this.startNodeId]: null };

        this._recordHistory('start', `Starting BFS from node ${this.startNodeId}.`, {
            queueState: queue,
            visitedState: visited,
        });

        while (queue.length > 0) {
            const currentNode = queue.shift();

            this._recordHistory('dequeue', `Dequeueing node ${currentNode} to visit it.`, {
                queueState: [currentNode, ...queue], // Show the dequeued node for a moment
                visitedState: visited,
                currentNode: currentNode,
            });

            if (currentNode === this.targetNodeId) {
                const shortestPath = this.reconstructPath(parents, this.targetNodeId);
                this._recordHistory('found', `Target ${this.targetNodeId} found! Reconstructing shortest path.`, {
                    queueState: queue,
                    visitedState: visited,
                    currentNode: currentNode,
                    shortestPath: shortestPath, // Ensure this key is added
                });
                return this.history;
            }

            const neighbors = this.graph.nodes[currentNode].neighbors;
            for (const neighborId of neighbors) {
                this._recordHistory('check_neighbor', `Checking neighbor ${neighborId} of node ${currentNode}.`, {
                    queueState: queue,
                    visitedState: visited,
                    currentNode: currentNode,
                    highlightedEdge: { from: currentNode, to: neighborId },
                });

                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    parents[neighborId] = currentNode;
                    queue.push(neighborId);
                    this._recordHistory('enqueue', `Node ${neighborId} has not been visited. Enqueueing it.`, {
                        queueState: queue,
                        visitedState: visited,
                        currentNode: currentNode,
                        highlightedEdge: { from: currentNode, to: neighborId },
                    });
                } else {
                    this._recordHistory('skip_neighbor', `Node ${neighborId} has already been visited. Skipping.`, {
                         queueState: queue,
                         visitedState: visited,
                         currentNode: currentNode,
                         highlightedEdge: { from: currentNode, to: neighborId },
                    });
                }
            }
             this._recordHistory('node_processed', `Finished processing neighbors of ${currentNode}.`, {
                queueState: queue,
                visitedState: visited,
                currentNode: null, // Clear the current node highlight
            });
        }
        
        const endMessage = this.targetNodeId !== null 
            ? `BFS complete. Target ${this.targetNodeId} not found.`
            : 'BFS complete. Queue is empty.';

        this._recordHistory('end', endMessage, {
            queueState: [],
            visitedState: visited,
            currentNode: null,
        });
        return this.history;
    }
}