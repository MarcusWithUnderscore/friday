import './button.css';
import { useState } from 'react';
import SidePanel from '../side-panel/SidePanel.tsx';

function Button() {
    const [showPanel, setShowPanel] = useState(false);

    const handleClick = () => {
        setShowPanel(!showPanel);
        const panel = document.querySelector('.side-panel');
        if (panel) {
            panel.style.display = showPanel ? 'none' : 'flex';
        }
    };

    return (
        <>
            <button className="chat-button" onClick={handleClick}>
                <span className="material-icons">{showPanel ? 'close' : 'chat'}</span>
            </button>
            
            <SidePanel />
        </>
    );
}

export default Button;