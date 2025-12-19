"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AiContextType {
    contextData: string;
    setContextData: (data: string) => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: ReactNode }) {
    const [contextData, setContextData] = useState<string>("");

    return (
        <AiContext.Provider value={{ contextData, setContextData }}>
            {children}
        </AiContext.Provider>
    );
}

export function useAiContext() {
    const context = useContext(AiContext);
    if (context === undefined) {
        throw new Error('useAiContext must be used within an AiProvider');
    }
    return context;
}
