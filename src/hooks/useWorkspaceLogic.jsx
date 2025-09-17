import { useState} from 'react';

export const useWorkspaceLogic = (topicId) => {
    const [value, setValue] = useState('');
    const [index, setIndex] = useState('');
    const [removeIndex, setRemoveIndex] = useState('');
    const [sliderValue, setSliderValue] = useState(50);
    const [animationSpeed, setAnimationSpeed] = useState(1050 - (50 * 10));
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [animationHistory, setAnimationHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [arrayState, setArrayState] = useState([]); //arrayState
    const [listState, setListState] = useState([]); //listState - Singly, Doubly, Circular
    const [stackState, setStackState] = useState([]); //stackState
    const [queueState, setQueueState] = useState([]); //queueState
    const [dequeState, setDequeState] = useState([]); //dequeState
    const [treeState, setTreeState] = useState({ nodes: [], edges: [] }); //treeState
    return{
        value, setValue, index, setIndex, removeIndex, setRemoveIndex, sliderValue, setSliderValue, animationSpeed, setAnimationSpeed,
        isInfoPanelOpen, setIsInfoPanelOpen, animationHistory, setAnimationHistory, currentStep, setCurrentStep, isPlaying, setIsPlaying,
        isCompleted, setIsCompleted, toast, setToast, arrayState, setArrayState, listState, setListState, stackState, setStackState,
        queueState, setQueueState, dequeState, setDequeState, treeState, setTreeState
    }
    
};