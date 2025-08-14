"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

export type ViewportName = 
  | 'hugeh' | 'xlh' | 'lgh' | 'mdh' | 'smh' | 'xsh' | 'xxsh'  // horizontal
  | 'lgv' | 'mdv' | 'sv' | 'smv' | 'xsv';                     // vertical

export interface AnimationConfig {
  name: ViewportName;
  initial: number;
  y1: number;
  y2: number;
}

export default function useResponsiveAnimation(animationConfigs: AnimationConfig[]) {
  const [currentViewport, setCurrentViewport] = useState<ViewportName>('hugeh');
  const [animationValues, setAnimationValues] = useState<{
    initial: number;
    y1: number;
    y2: number;
  }>({
    initial: -20,
    y1: -10,
    y2: -20
  });

  // Store configs in a ref to avoid dependency issues
  const configsRef = useRef(animationConfigs);
  configsRef.current = animationConfigs;

  const getViewportName = (width: number, height: number): ViewportName => {
    const isLandscape = width > height;
    
    if (isLandscape) {
      // Horizontal (landscape) viewports
      if (width >= 1730) return 'hugeh';
      if (width >= 1598) return 'xlh';
      if (width >= 1400) return 'lgh';
      if (width >= 1200) return 'mdh';
      if (width >= 960) return 'smh';
      if (width >= 701) return 'xsh';
      return 'xxsh';
    } else {
      // Vertical (portrait) viewports
      if (height >= 1000) return 'lgv';
      if (height >= 600) return 'mdv';
      if (height >= 400) return 'sv';
      if (height >= 380) return 'smv';
      return 'xsv';
    }
  };

  const updateViewport = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const viewport = getViewportName(width, height);
    setCurrentViewport(viewport);

    // Use current configs from ref
    const currentConfigs = configsRef.current;

    // Find matching animation config for current viewport or closest smaller one
    let matchedConfig = currentConfigs[0]; // fallback to first config
    
    for (const config of currentConfigs) {
      if (config.name === viewport) {
        matchedConfig = config;
        break;
      }
    }

    // If no exact match, find the closest smaller viewport
    if (matchedConfig.name !== viewport) {
      const viewportOrder: ViewportName[] = [
        'hugeh', 'xlh', 'lgh', 'mdh', 'smh', 'xsh', 'xxsh',
        'lgv', 'mdv', 'sv', 'smv', 'xsv'
      ];
      
      const currentIndex = viewportOrder.indexOf(viewport);
      for (let i = currentIndex; i >= 0; i--) {
        const config = currentConfigs.find(c => c.name === viewportOrder[i]);
        if (config) {
          matchedConfig = config;
          break;
        }
      }
    }

    setAnimationValues({
      initial: matchedConfig.initial,
      y1: matchedConfig.y1,
      y2: matchedConfig.y2
    });
  }, []); // No dependencies since we use refs

  useEffect(() => {
    // Run on first mount
    updateViewport();

    // Only listen for resize events
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []); // Empty dependency array - only runs on mount/unmount

  return { currentViewport, animationValues };
}