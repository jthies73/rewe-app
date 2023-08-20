import React from 'react';
import './ExploreContainer.css';

interface ContainerProps {
    name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({name}) => {
    return (
        <div className="container">
            <strong>{name}</strong>
            <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI
                Components</a></p>
            <button onClick={() => {
                navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user"
                    }

                })
            }}>Show my face
            </button>
        </div>
    );
};

export default ExploreContainer;
