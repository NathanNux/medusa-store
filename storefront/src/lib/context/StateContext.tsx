"use client";

import { usePathname, useParams } from 'next/navigation';
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
    const params = useParams<{ countryCode?: string | string[] }>();
    const countryCodeParam = params?.countryCode;
    const countryCode = Array.isArray(countryCodeParam)
      ? countryCodeParam[0]
      : countryCodeParam;
    const isHome = countryCode ? pathname === `/${countryCode}` : pathname === "/";

    useEffect(() => {
        if (isHome) {
            const timeout = window.setTimeout(() => {
                setFirstLoad(true);
            }, 3000);
            return () => clearTimeout(timeout);
        }
        // Non-home routes: enable immediately
        setFirstLoad(true);
        return;
    }, [pathname, isHome]);


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