import { useCallback, useDebugValue, useMemo, useSyncExternalStore, } from 'react';
import createMediaQueries from './createMediaQueries.js';
const EMPTY_BREAKPOINT = {
    breakpoint: null,
    minWidth: null,
    maxWidth: null,
    query: null,
};
/**
 * A React hook to use the current responsive breakpoint.
 * Will listen to changes using the window.matchMedia API.
 * @param {*} config the list of configured breakpoint names and their pixel values
 * @param {*} [defaultBreakpoint] the optional default breakpoint
 *
 * @example
 * const breakpoints = { mobile: 0, tablet: 768, desktop: 1280 }
 * ...
 * const result = useBreakpoint(breakpoints)
 * // { breakpoint: string; minWidth: number; maxWidth: number | null } | { breakpoint: undefined; minWidth: undefined; maxWidth: undefined }
 *
 * @example <caption>With default value</caption>
 * const breakpoints = { mobile: 0, tablet: 768, desktop: 1280 }
 * ...
 * const result = useBreakpoint(breakpoints, 'mobile')
 * // breakpoint: { breakpoint: string; minWidth: number; maxWidth: number | null }
 */
const useBreakpoint = (config, defaultBreakpoint) => {
    /** Memoize list of calculated media queries from config */
    const mediaQueries = useMemo(() => createMediaQueries(config), [config]);
    const subscribe = useCallback((callback) => {
        const unsubscribers = [];
        mediaQueries.forEach(({ query }) => {
            const list = window.matchMedia(query);
            const supportsNewEventListeners = 'addEventListener' in list && 'removeEventListener' in list;
            if (supportsNewEventListeners) {
                list.addEventListener('change', callback);
            }
            else {
                ;
                list.addListener(callback);
            }
            /** Map the unsubscribers array to a list of unsubscriber methods */
            unsubscribers.push(supportsNewEventListeners
                ? () => list.removeEventListener('change', callback)
                : () => list.removeListener(callback));
        });
        /** Return a function that when called, will call all unsubscribers */
        return () => unsubscribers.forEach((unsubscriber) => unsubscriber());
    }, [mediaQueries]);
    const getSnapshot = useCallback(() => {
        const mediaMatch = mediaQueries.find((mediaQuery) => window.matchMedia(mediaQuery.query).matches);
        if (mediaMatch)
            return mediaMatch;
        if (defaultBreakpoint) {
            const defaultMatch = mediaQueries.find((mediaQuery) => mediaQuery.breakpoint === defaultBreakpoint);
            if (defaultMatch)
                return defaultMatch;
        }
        return EMPTY_BREAKPOINT;
    }, [defaultBreakpoint, mediaQueries]);
    const getServerSnapshot = useCallback(() => {
        const defaultMatch = mediaQueries.find((mediaQuery) => mediaQuery.breakpoint === defaultBreakpoint);
        return defaultMatch ?? EMPTY_BREAKPOINT;
    }, [defaultBreakpoint, mediaQueries]);
    const currentBreakpoint = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    /** Print a nice debug value for React Devtools */
    useDebugValue(currentBreakpoint, (c) => typeof c.breakpoint === 'string'
        ? `${c.breakpoint} (${c.minWidth} ≤ x${c.maxWidth ? ` < ${c.maxWidth + 1}` : ''})`
        : '');
    return currentBreakpoint;
};
export default useBreakpoint;
