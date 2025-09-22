import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './AlgoVisualizerPage.css';
import LinearSearchWorkspace from '../../visualizers/ALGOcomponents/Searching/LinearSearch/LinearSearchWorkspace.jsx';
import BinarySearchWorkspace from '../../visualizers/ALGOcomponents/Searching/BinarySearch/BinarySearchWorkspace';
import BubbleSortWorkspace from '../../visualizers/ALGOcomponents/Sorting/BubbleSort/BubbleSortWorkspace';
import InsertionSortWorkspace from '../../visualizers/ALGOcomponents/Sorting/InsertionSort/InsertionSortWorkspace.jsx';
import BFSWorkspace from '../../visualizers/ALGOcomponents/GraphTraversal/BFS/BFSWorkspace.jsx';
import DFSWorkspace from '../../visualizers/ALGOcomponents/GraphTraversal/DFS/DFSWorkspace.jsx';

import { 
    LinearSearchIcon, 
    BinarySearchIcon, 
    BubbleSortIcon, 
    InsertionSortIcon,
    BFSIcon,
    DFSIcon,
} from '../AlgoIcons';

// Define the initial set of algorithms planned to be built.
const algoData = [
    { id: 'linear-search', title: 'Linear Search', category: 'Searching', description: 'Sequentially checks each element of a list.', icon: <LinearSearchIcon /> },
    { id: 'binary-search', title: 'Binary Search', category: 'Searching', description: 'Efficiently finds an item by repeatedly dividing the search interval in half.', icon: <BinarySearchIcon /> },
    { id: 'bubble-sort', title: 'Bubble Sort', category: 'Sorting', description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.', icon: <BubbleSortIcon /> },
    { id: 'insertion-sort', title: 'Insertion Sort', category: 'Sorting', description: 'Builds the final sorted array one item at a time.', icon: <InsertionSortIcon /> },
    { id: 'bfs', title: 'Breadth-First Search', category: 'Graph Traversal', description: 'Explores the neighbor nodes first, before moving to the next level neighbors.', icon: <BFSIcon /> },
    { id: 'dfs', title: 'Depth-First Search', category: 'Graph Traversal', description: 'Explores as far as possible along each branch before backtracking.', icon: <DFSIcon /> },
];

const categories = ['All', 'Searching', 'Sorting', 'Graph Traversal'];

// set to track which algorithms are actually implemented and clickable.
const implementedWorkspaces = new Set(['linear-search', 'binary-search', 'bubble-sort', 'insertion-sort', 'bfs', 'dfs']);

function AlgoVisualizerPage({ onBack, selectedAlgo, onSelectAlgo}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(algoData);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const categoryFiltered = selectedCategory === 'All'
            ? algoData
            : algoData.filter(algo => algo.category === selectedCategory);

        if (!searchQuery) {
            setFilteredData(categoryFiltered);
            return;
        }

        const fuse = new Fuse(categoryFiltered, { keys: ['title'], includeScore: true, threshold: 0.4 });
        const results = fuse.search(searchQuery);
        setFilteredData(results.map(result => result.item));
    }, [searchQuery, selectedCategory]);

    if (selectedAlgo) {
        switch (selectedAlgo) {
            case 'linear-search':return <LinearSearchWorkspace onBack={onBack} />;
            case 'binary-search':return <BinarySearchWorkspace onBack={onBack} />;
            case 'bubble-sort':return <BubbleSortWorkspace onBack={onBack} />;
            case 'insertion-sort': return <InsertionSortWorkspace onBack={onBack} />;
            case 'bfs': return <BFSWorkspace onBack={onBack} />;
            case 'dfs': return <DFSWorkspace onBack={onBack} />;
            default:
                onSelectAlgo(null); // Go back if no match
                return null;
        }
    }

    return (
        <div className="algo-page-container">
            <div className="algo-sidebar">
                <h2 className="algo-sidebar-title">Algorithms</h2>
                <input
                    type="text"
                    className="algo-search-bar"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ul className="algo-category-list">
                    {categories.map(cat => (
                        <li
                            key={cat}
                            className={`algo-category-item ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="algo-grid-container">
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <h1 className="auth-title">Select a Visualization</h1>
                    <button onClick={onBack} className="auth-button" style={{maxWidth: '150px'}}>Back</button>
                </div>
                <div className="algo-grid">
                    {filteredData.map(algo => (
                        <div
                            key={algo.id}
                            className="algo-card"
                            onClick={() => implementedWorkspaces.has(algo.id) && onSelectAlgo(algo.id)}
                            style={{ cursor: implementedWorkspaces.has(algo.id) ? 'pointer' : 'not-allowed', opacity: implementedWorkspaces.has(algo.id) ? 1 : 0.5 }}
                        >
                            <h3 className="algo-card-title">{algo.title}</h3>
                            {algo.icon} 
                            <p className="algo-card-description">{algo.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default AlgoVisualizerPage;