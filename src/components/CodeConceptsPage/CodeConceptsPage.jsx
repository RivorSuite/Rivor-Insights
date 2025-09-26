import React, { useState, useEffect } from 'react';
import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs';
import { conceptsInfo } from '../../Concepts/concepts-data';
import '../CodeConceptsPage/CodeConceptsPage.css';
import VariablesWorkspace from '../../Concepts/Variables/VariablesWorkspace';
import OperatorsWorkspace from '../../Concepts/Operators/OperatorsWorkspace';
import ConditionalsWorkspace from '../../Concepts/Conditionals/ConditionalsWorkspace';
import LoopsWorkspace from '../../Concepts/Loops/LoopsWorkspace';
import {
    VariableIcon, OperatorIcon, ConditionalIcon, LoopIcon,
    ListIcon, TupleIcon, DictionaryIcon, FunctionIcon, FibonacciIcon, FactorialIcon
} from '../ConceptIcons';

const ConceptIcon = ({ iconName }) => { // Helper component to render the correct icon based on its string name
    switch (iconName) {
        case 'VariableIcon': return <VariableIcon />;
        case 'OperatorIcon': return <OperatorIcon />;
        case 'ConditionalIcon': return <ConditionalIcon />;
        case 'LoopIcon': return <LoopIcon />;
        case 'ListIcon': return <ListIcon />;
        case 'TupleIcon': return <TupleIcon />;
        case 'DictionaryIcon': return <DictionaryIcon />;
        case 'FunctionIcon': return <FunctionIcon />;
        case 'FibonacciIcon': return <FibonacciIcon />;
        case 'FactorialIcon': return <FactorialIcon />;
        default: return null;
    }
};
// Convert the conceptsInfo object into an array for easier mapping and filtering
const conceptsData = Object.entries(conceptsInfo).map(([id, data]) => ({
    id,
    ...data
}));
// Dynamically create categories from the data
const categories = ['All', ...new Set(conceptsData.map(c => c.category))];

function CodeConceptsPage({ onBack, selectedConcept, onSelectConcept, onPractice, initialType }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(conceptsData);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const categoryFiltered = selectedCategory === 'All'
            ? conceptsData
            : conceptsData.filter(c => c.category === selectedCategory);

        if (!searchQuery) {setFilteredData(categoryFiltered); return;}

        const fuse = new Fuse(categoryFiltered, { keys: ['title'], includeScore: true, threshold: 0.4 });
        const results = fuse.search(searchQuery);
        setFilteredData(results.map(result => result.item));
    }, [searchQuery, selectedCategory]);
    if (selectedConcept) {
        switch (selectedConcept) {
            case 'variables':
                return <VariablesWorkspace 
                    onBack={onBack} 
                    onPractice={() => onPractice('variables')} 
                />;
            
            case 'operators': // Add this case
                return <OperatorsWorkspace 
                    onBack={onBack} 
                    onPractice={() => onPractice('operators')} 
                />;

            case 'conditionals':
                return <ConditionalsWorkspace
                    onBack={onBack}
                    onPractice={() => onPractice('conditionals')}
                />;

            case 'loops':
                return <LoopsWorkspace 
                    onBack={onBack} 
                    onPractice={onPractice} 
                    initialType={initialType}
                />;
            
            default: onSelectConcept(null); return null;
        }
    }
    return (
        <div className="ds-page-container">
            <div className="ds-sidebar">
                <h2 className="ds-sidebar-title">Code Concepts</h2>
                <input 
                    type="text" 
                    className="ds-search-bar" 
                    placeholder="Search concepts..."
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
                    <h1 className="auth-title">Select a Concept</h1>
                    <button onClick={onBack} className="auth-button" style={{maxWidth: '150px'}}>Back</button>
                </div>
                <div className="ds-grid">
                    {filteredData.map(concept => (
                        <div 
                            key={concept.id} 
                            className="ds-card" 
                            onClick={() => onSelectConcept(concept.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3 className="ds-card-title">{concept.title}</h3>
                            <ConceptIcon iconName={concept.icon} />
                            <p className="ds-card-description">{concept.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default CodeConceptsPage;