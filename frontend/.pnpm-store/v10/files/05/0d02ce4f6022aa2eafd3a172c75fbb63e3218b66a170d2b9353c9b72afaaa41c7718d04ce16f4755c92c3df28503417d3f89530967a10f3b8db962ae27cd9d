import type { Config } from './createMediaQueries.js';
export interface Breakpoint<C extends Config> {
    breakpoint: keyof C;
    maxWidth?: number | null;
    minWidth: C[keyof C];
    query: string;
}
declare const EMPTY_BREAKPOINT: {
    readonly breakpoint: null;
    readonly minWidth: null;
    readonly maxWidth: null;
    readonly query: null;
};
type Return<C extends Config, D> = D extends undefined ? Breakpoint<C> | typeof EMPTY_BREAKPOINT : D extends keyof C ? Breakpoint<C> : never;
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
declare const useBreakpoint: <C extends Config, D extends keyof C | undefined>(config: C, defaultBreakpoint?: D) => Return<C, D>;
export default useBreakpoint;
