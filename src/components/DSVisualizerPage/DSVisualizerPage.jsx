import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { ArrayIcon, SinglyLinkedListIcon, StackIcon, QueueIcon, BstIcon, DoublyLinkedListIcon, CircularLinkedListIcon, DequeIcon } from '../DSIcons';
import ArrayWorkspace from '../../visualizers/components/Array/ArrayWorkspace';
import SinglyLinkedListWorkspace from '../../visualizers/components/SinglyLinkedList/SinglyLinkedListWorkspace';
import DoublyLinkedListWorkspace from '../../visualizers/components/DoublyLinkedList/DoublyLinkedListWorkspace';
import CircularLinkedListWorkspace from '../../visualizers/components/CircularLinkedList/CircularLinkedListWorkspace';
import StackWorkspace from '../../visualizers/components/Stack/StackWorkspace';
import QueueWorkspace from '../../visualizers/components/Queue/QueueWorkspace';
import DequeWorkspace from '../../visualizers/components/Deque/DequeWorkspace';
import BSTWorkspace from '../../visualizers/components/BST/BSTWorkspace';
import './DSVisualizerPage.css';

const dsData = [
    { id: 'array', title: 'Array', category: 'Lists', description: 'A contiguous block of memory.', icon: <ArrayIcon /> },
    { id: 'singly-linked-list', title: 'Singly Linked List', category: 'Lists', description: 'Nodes linked by pointers.', icon: <SinglyLinkedListIcon /> },
    { id: 'doubly-linked-list', title: 'Doubly Linked List', category: 'Lists', description: 'Nodes with next/prev pointers.', icon: <DoublyLinkedListIcon /> },
    { id: 'circular-linked-list', title: 'Circular Linked List', category: 'Lists', description: 'The last node points to the first.', icon: <CircularLinkedListIcon /> },
    { id: 'stack', title: 'Stack', category: 'Linear', description: 'A Last-In, First-Out structure.', icon: <StackIcon /> },
    { id: 'queue', title: 'Queue', category: 'Linear', description: 'A First-In, First-Out structure.', icon: <QueueIcon /> },
    { id: 'deque', title: 'Deque', category: 'Linear', description: 'A double-ended queue.', icon: <DequeIcon /> },
    { id: 'bst', title: 'Binary Search Tree', category: 'Trees', description: 'A hierarchical search tree.', icon: <BstIcon /> },
];

const categories = ['All', 'Lists', 'Linear', 'Trees'];

const implementedWorkspaces = new Set([
    'array',
    'singly-linked-list',
    'doubly-linked-list',
    'circular-linked-list',
    'stack',
    'queue',
    'deque',
    'bst',
]);

function DSVisualizerPage({ onBack, selectedDS, onSelectDS }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(dsData);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const categoryFiltered = selectedCategory === 'All'
            ? dsData
            : dsData.filter(ds => ds.category === selectedCategory);
        if (!searchQuery) {setFilteredData(categoryFiltered); return;}
        const fuse = new Fuse(categoryFiltered, { keys: ['title'], includeScore: true, threshold: 0.4 });
        const results = fuse.search(searchQuery);
        setFilteredData(results.map(result => result.item));
    }, [searchQuery, selectedCategory]);

    if (selectedDS) {
        switch (selectedDS) {
            case 'array': return <ArrayWorkspace onBack={onBack} />;
            case 'singly-linked-list': return <SinglyLinkedListWorkspace onBack={onBack} />;
            case 'doubly-linked-list': return <DoublyLinkedListWorkspace onBack={onBack} />;
            case 'circular-linked-list': return <CircularLinkedListWorkspace onBack={onBack} />;
            case 'stack': return <StackWorkspace onBack={onBack} />;
            case 'queue': return <QueueWorkspace onBack={onBack} />;
            case 'deque': return <DequeWorkspace onBack={onBack} />;
            case 'bst': return <BSTWorkspace onBack={onBack} />;
            default: onSelectDS(null); return null;
        }
    }

    return (
        <div className="ds-page-container">
            <div className="ds-sidebar">
                <h2 className="ds-sidebar-title">Data Structures</h2>
                <input 
                    type="text" 
                    className="ds-search-bar" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <ul className="ds-category-list">
                    {categories.map(cat => (
                        <li 
                            key={cat}
                            className={`ds-category-item ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="ds-grid-container">
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <h1 className="auth-title">Select a Visualization</h1>
                    <button onClick={onBack} className="auth-button" style={{maxWidth: '150px'}}>Back</button>
                </div>
                <div className="ds-grid">
                    {filteredData.map(ds => (
                        <div 
                            key={ds.id} 
                            className="ds-card" 
                            onClick={() => implementedWorkspaces.has(ds.id) && onSelectDS(ds.id)}
                            style={{ cursor: implementedWorkspaces.has(ds.id) ? 'pointer' : 'not-allowed', opacity: implementedWorkspaces.has(ds.id) ? 1 : 0.5 }}
                        >
                            <h3 className="ds-card-title">{ds.title}</h3>
                            {ds.icon}
                            <p className="ds-card-description">{ds.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default DSVisualizerPage;