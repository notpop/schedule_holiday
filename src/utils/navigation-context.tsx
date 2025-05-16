'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Direction = 'forward' | 'backward';

interface NavigationContextType {
    direction: Direction;
    setDirection: (direction: Direction) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [direction, setDirection] = useState<Direction>('forward');

    return (
        <NavigationContext.Provider value={{ direction, setDirection }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
} 