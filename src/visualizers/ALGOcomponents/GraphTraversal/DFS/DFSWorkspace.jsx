import React, { useState, useRef, useEffect } from 'react';
import { Algo_DFS } from './Algo_DFS';
import { Toast } from '../../../Toast/Toast';
import { InfoPanel } from '../../../../visualizers/DScomponents/InfoPanel';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { algoInfo } from '../../../data/algo-info';
import { CheckIcon, BookIcon } from '../../../../common/Icons';
import { useWorkspaceLogic } from '../../../../hooks/useWorkspaceLogic';
import './DFS.css';

// Graph Generation Logic (copied from BFS for consistency)
const generateGraph = (isTree = false, isComplex = false) => {
    const nodes = {};
    let nodeCount, positions, addEdge;
    addEdge = (u, v) => {
        if (nodes[u] && nodes[v]) {
            nodes[u].neighbors.add(v);
            nodes[v].neighbors.add(u);
        }
    };
    if (isComplex) {
        nodeCount = 11;
        positions = [
            { x: 100, y: 250 }, { x: 250, y: 150 }, { x: 250, y: 350 }, { x: 400, y: 80 }, { x: 400, y: 250 }, 
            { x: 400, y: 420 }, { x: 550, y: 150 }, { x: 550, y: 350 }, { x: 700, y: 80 }, { x: 700, y: 250 }, { x: 700, y: 420 }
        ];
        for (let i = 0; i < nodeCount; i++) nodes[i] = { id: i, ...positions[i], neighbors: new Set() };
        addEdge(0, 1); addEdge(0, 2); addEdge(1, 3); addEdge(2, 5); addEdge(3, 4); addEdge(3, 6); addEdge(4, 2); 
        addEdge(4, 5); addEdge(4, 7); addEdge(5, 10); addEdge(6, 7); addEdge(6, 8); addEdge(7, 9); addEdge(7, 10); addEdge(8, 9);
    } else {
        nodeCount = isTree ? 8 : 7;
        positions = isTree
            ? [ { x: 400, y: 50 }, { x: 250, y: 120 }, { x: 550, y: 120 }, { x: 175, y: 190 }, { x: 325, y: 190 }, { x: 475, y: 190 }, { x: 625, y: 190 }, { x: 140, y: 260 } ]
            : [ { x: 200, y: 100 }, { x: 400, y: 100 }, { x: 600, y: 100 }, { x: 200, y: 250 }, { x: 400, y: 250 }, { x: 600, y: 250 }, { x: 400, y: 400 } ];
        for (let i = 0; i < nodeCount; i++) nodes[i] = { id: i, ...positions[i], neighbors: new Set() };
        if (isTree) { addEdge(0, 1); addEdge(0, 2); addEdge(1, 3); addEdge(1, 4); addEdge(2, 5); addEdge(2, 6); addEdge(3, 7); } 
        else { addEdge(0, 1); addEdge(0, 3); addEdge(1, 2); addEdge(1, 4); addEdge(2, 5); addEdge(3, 4); addEdge(4, 5); addEdge(4, 6); addEdge(5, 6); }
    }
    Object.values(nodes).forEach(node => { node.neighbors = Array.from(node.neighbors); });
    return { nodes };
};

function DFSWorkspace({ onBack }) {
    const topicId = 'algo-dfs';
    const {
        isInfoPanelOpen, setIsInfoPanelOpen, animationHistory, setAnimationHistory,
        currentStep, setCurrentStep, isPlaying, setIsPlaying, isCompleted, setIsCompleted,
        animationSpeed, setAnimationSpeed, sliderValue, setSliderValue, toast, setToast,
    } = useWorkspaceLogic();
    
    const [graph, setGraph] = useState(generateGraph(true, false));
    const [startNode, setStartNode] = useState('0');
    const [targetNode, setTargetNode] = useState('');
    const [path, setPath] = useState([]);
    const algo = useRef(null);

    useEffect(() => {
        setSliderValue(50);
        setAnimationSpeed(825); // Set slower initial speed
    }, []);
    
    useEffect(() => {
        const checkCompletion = async () => {
            const user = auth.currentUser; if (!user) return;
            const docRef = doc(db, "userProgress", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().completed?.includes(topicId)) setIsCompleted(true);
        };
        checkCompletion();
    }, []);

    useEffect(() => {
        const currentFrame = animationHistory[currentStep];
        if (currentFrame?.path) setPath(currentFrame.path);
        if (currentFrame && ['pop', 'push', 'skip_neighbor', 'skip_visited'].includes(currentFrame.type)) {
            showToast(currentFrame.description, 'info');
        }

        if (isPlaying && currentStep < animationHistory.length - 1) {
            const timer = setTimeout(() => setCurrentStep(currentStep + 1), animationSpeed);
            return () => clearTimeout(timer);
        } else if (isPlaying && currentStep >= animationHistory.length - 1) {
            setIsPlaying(false);
            if (currentFrame?.type === 'found') {
                showToast(`Target found! Path: ${currentFrame.path.join(' → ')}`, "success");
            } else if (currentFrame?.type === 'end' && targetNode) {
                showToast(`Target ${targetNode} could not be reached.`, "error");
            } else if (currentFrame?.type === 'end' && !targetNode) {
                showToast("DFS Traversal Complete!", "success");
            }
        }
    }, [isPlaying, currentStep, animationHistory, animationSpeed]);

    const showToast = (message, type = 'info') => {
        // This uses the same longer-toast logic we implemented earlier
        clearTimeout(toastTimerRef.current);
        setToast({ show: true, message, type });
        toastTimerRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
    };
    const toastTimerRef = useRef(null);

    const handleCompleteTopic = async () => {
        const user = auth.currentUser; if (!user) return;
        const docRef = doc(db, "userProgress", user.uid);
        try {
            if (isCompleted) { await updateDoc(docRef, { completed: arrayRemove(topicId) }); setIsCompleted(false); }
            else { await setDoc(docRef, { completed: arrayUnion(topicId) }, { merge: true }); setIsCompleted(true); }
        } catch (error) { console.error("Error updating progress:", error); }
    };

    const handleSearch = () => {
        const startNodeId = parseInt(startNode, 10);
        const targetNodeId = targetNode === '' ? null : parseInt(targetNode, 10);
        if (isNaN(startNodeId) || !graph.nodes[startNodeId]) return showToast("Please enter a valid start node ID.", "error");
        if (targetNode !== '' && (isNaN(targetNodeId) || !graph.nodes[targetNodeId])) return showToast("Please enter a valid target node ID or leave it blank.", "error");
        
        setPath([]);
        algo.current = new Algo_DFS(graph, startNodeId, targetNodeId);
        const history = algo.current.run();
        setAnimationHistory(history);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleRandomize = (isTree, isComplex) => {
        setGraph(generateGraph(isTree, isComplex));
        setAnimationHistory([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setPath([]);
    };
    
    const handleSpeedChange = (e) => {
        const newSliderValue = parseInt(e.target.value, 10);
        setSliderValue(newSliderValue);
        setAnimationSpeed(1575 - newSliderValue * 15); // Use slower formula
    };
    const handlePlayPause = () => { if (!isPlaying && currentStep >= animationHistory.length - 1) setCurrentStep(0); setIsPlaying(!isPlaying); };
    const handleStepBack = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const handleStepForward = () => { setIsPlaying(false); if (currentStep < animationHistory.length - 1) setCurrentStep(currentStep + 1); };

    const currentFrame = animationHistory[currentStep] || {};
    const { stackState = [], visitedState = new Set(), currentNode, highlightedEdge } = currentFrame;

    const pathNodes = new Set(path);
    const pathEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
        pathEdges.add(`${path[i]}-${path[i+1]}`);
        pathEdges.add(`${path[i+1]}-${path[i]}`);
    }

    return (
        <div className="ds-workspace">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
            <div className="ds-workspace-header">
                <h1 className="auth-title" style={{ margin: 0 }}>Depth-First Search</h1>
                <button onClick={onBack} className="auth-button" style={{ maxWidth: '150px' }}>Back to Select</button>
            </div>
            <div className="ds-controls-panel">
                 <div className="ds-controls-left">
                    <div className="ds-control-group">
                        <input type="number" placeholder="Start" className="ds-input-field" value={startNode} onChange={e => setStartNode(e.target.value)} />
                        <input type="number" placeholder="Target" className="ds-input-field" value={targetNode} onChange={e => setTargetNode(e.target.value)} />
                        <button className="ds-action-button" onClick={handleSearch}>{targetNode ? 'Find Path' : 'Traverse'}</button>
                    </div>
                    <div className="ds-separator"></div>
                    <div className="ds-controls-section">
                        <h3 className="ds-controls-title">Examples</h3>
                         <div className="ds-control-group">
                            <button className="ds-action-button" onClick={() => handleRandomize(true, false)}>Simple Tree</button>
                            <button className="ds-action-button" onClick={() => handleRandomize(false, false)}>Simple Graph</button>
                            <button className="ds-action-button" onClick={() => handleRandomize(false, true)}>Complex Graph</button>
                        </div>
                    </div>
                </div>
                 <div className="ds-controls-right">
                    <div className="stacked-buttons-container">
                        <button className={`ds-action-button complete-button ${isCompleted ? 'completed' : ''}`} onClick={handleCompleteTopic}>
                            <CheckIcon /> {isCompleted ? 'Completed' : 'Mark as Complete'}
                        </button>
                        <button className="ds-action-button icon-button" onClick={() => setIsInfoPanelOpen(true)}><BookIcon /></button>
                    </div>
                </div>
            </div>
            <div className="dfs-main-content">
                <div className="dfs-canvas">
                     {Object.values(graph.nodes).map(node => (
                        node.neighbors.map(neighborId => {
                            const neighbor = graph.nodes[neighborId];
                            if (node.id < neighbor.id) {
                                const angle = Math.atan2(neighbor.y - node.y, neighbor.x - node.x) * 180 / Math.PI;
                                const length = Math.sqrt(Math.pow(neighbor.x - node.x, 2) + Math.pow(neighbor.y - node.y, 2));
                                const isHighlighted = (highlightedEdge?.from === node.id && highlightedEdge?.to === neighbor.id) || (highlightedEdge?.from === neighbor.id && highlightedEdge?.to === node.id);
                                const isInPath = pathEdges.has(`${node.id}-${neighbor.id}`);
                                return <div key={`${node.id}-${neighbor.id}`} className={`graph-edge ${isHighlighted ? 'highlighted' : ''} ${isInPath ? 'path' : ''}`} style={{ left: `${node.x}px`, top: `${node.y}px`, width: `${length}px`, transform: `rotate(${angle}deg)` }}></div>;
                            }
                            return null;
                        })
                    ))}
                    {Object.values(graph.nodes).map(node => (
                        <div key={node.id} className={`graph-node ${visitedState.has(node.id) ? 'visited' : ''} ${currentNode === node.id ? 'current' : ''} ${pathNodes.has(node.id) ? 'path' : ''}`} style={{ left: `${node.x}px`, top: `${node.y}px` }}>{node.id}</div>
                    ))}
                </div>
                <div className="ds-controls-panel" style={{ flexDirection: 'column', width: '350px' }}>
                    <div className="dfs-state-panel">
                        <div className="dfs-state-section">
                            <span className="dfs-state-title">Stack</span>
                            <div className="dfs-stack-container">
                                {stackState.slice().reverse().map((nodeId, index, arr) => {
                                    const isTopOfStack = index === 0 && stackState.length > 0;
                                    const isPopped = currentFrame.type === 'pop' && index === 0;
                                    const itemClasses = `dfs-state-item ${isPopped ? 'popped' : ''} ${isTopOfStack ? 'top-of-stack' : ''}`;

                                    return (
                                        <div key={`${nodeId}-${index}`} className={itemClasses}>
                                            {nodeId}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="dfs-state-section">
                            <span className="dfs-state-title">Visited Set</span>
                            <div className="dfs-visited-container">
                                {Array.from(visitedState).sort((a,b) => a-b).map(nodeId => (<div key={nodeId} className="dfs-state-item">{nodeId}</div>))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ds-animation-controls">
                <div className="ds-playback-buttons">
                    <button className="ds-playback-button" onClick={handleStepBack} disabled={!animationHistory.length || currentStep === 0}>‹ Step Back</button>
                    <button className="ds-playback-button play" onClick={handlePlayPause} disabled={!animationHistory.length}>{isPlaying ? 'Pause' : 'Play'}</button>
                    <button className="ds-playback-button" onClick={handleStepForward} disabled={!animationHistory.length || currentStep >= animationHistory.length - 1}>Step Forward ›</button>
                </div>
                <div className="ds-speed-slider">
                    <span>Animation Speed</span>
                    <input type="range" min="1" max="100" value={sliderValue} onChange={handleSpeedChange} />
                </div>
            </div>
            {isInfoPanelOpen && <InfoPanel data={algoInfo.dfs || {}} onClose={() => setIsInfoPanelOpen(false)} />}
        </div>
    );
}

export default DFSWorkspace;