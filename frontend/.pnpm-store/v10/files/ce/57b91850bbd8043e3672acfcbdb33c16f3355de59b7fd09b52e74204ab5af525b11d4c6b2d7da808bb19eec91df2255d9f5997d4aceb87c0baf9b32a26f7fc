export type Config = Readonly<Record<string, number>>;
export interface MediaQuery<C extends Config> {
    breakpoint: keyof C;
    maxWidth: number | null;
    minWidth: C[keyof C];
    query: string;
}
/**
 * Create media query objects
 * @param breakpoints the list of configured breakpoint names and their pixel values
 */
declare const createMediaQueries: <C extends Config>(breakpoints: C) => MediaQuery<C>[];
export default createMediaQueries;
