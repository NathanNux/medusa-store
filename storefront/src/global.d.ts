import Lenis from "lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

// Extend the Window interface to include Packeta
declare global {
  interface Window {
    Packeta?: any;
  }s
}

export {};
export type LenisInstance = Lenis | undefined;