import './button.css';
import { useState } from 'react';
import SidePanel from '../side-panel/SidePanel.tsx';

interface ButtonProps {
    onZoomIn?: () => void;
    onZoomOut?: () => void;
}

function Button({ onZoomIn, onZoomOut }: ButtonProps) {
    const [showPanel, setShowPanel] = useState(false);

    const handleClick = () => {
        setShowPanel(!showPanel);
        const panel = document.querySelector('.side-panel');
        if (panel) {
            panel.style.display = showPanel ? 'none' : 'flex';
        }
    };

    const handleZoomIn = () => {
        console.log('Zoom in clicked');
        window.dispatchEvent(new CustomEvent('avatarZoom', { detail: { zoom: -0.5 } }));
        onZoomIn?.();
    };

    const handleZoomOut = () => {
        console.log('Zoom out clicked');
        window.dispatchEvent(new CustomEvent('avatarZoom', { detail: { zoom: 0.5 } }));
        onZoomOut?.();
    };

    return (
        <>
            <button className="chat-button" onClick={handleClick}>
                <span className="material-icons">{showPanel ? 'close' : 'chat'}</span>
            </button>
            
            <button className="zoom-button zoom-in" onClick={handleZoomIn}>
                <span className="material-icons">zoom_in</span>
            </button>
            
            <button className="zoom-button zoom-out" onClick={handleZoomOut}>
                <span className="material-icons">zoom_out</span>
            </button>
            
            <SidePanel />
        </>
    );
}

export default Button;