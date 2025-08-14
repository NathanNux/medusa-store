"use client";

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

interface StateContextType {
    firstLoad: boolean;
    setFirstLoad: Dispatch<SetStateAction<boolean>>;
}

const StateContext = createContext<StateContextType | null>(null);

export function StateProvider({ children }: { children: ReactNode }) {
    const [firstLoad, setFirstLoad] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if( pathname === "/") {
            const timeout = setTimeout(() => {
                setFirstLoad(true);
            }, 3000);

            return () => clearTimeout(timeout);
        } else {
            setFirstLoad(true);
        }
    }, [pathname]);


    return (
        <StateContext.Provider value={{ firstLoad, setFirstLoad }}>
            {children}
        </StateContext.Provider>
    );
}

export function useStateContext(): StateContextType {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useStateContext must be used within a StateProvider');
    }
    return context;
}