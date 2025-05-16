import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`max-w-md mx-auto px-4 h-full ${className}`}>
            {children}
        </div>
    );
}; 