import { LocatorSelectors, Locator } from '@vitest/browser/context';
import { PrettyDOMOptions } from '@vitest/browser/utils';
import React from 'react';

interface RenderResult extends LocatorSelectors {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (el?: HTMLElement | HTMLElement[] | Locator | Locator[], maxLength?: number, options?: PrettyDOMOptions) => void;
    unmount: () => void;
    rerender: (ui: React.ReactNode) => void;
    asFragment: () => DocumentFragment;
}
interface ComponentRenderOptions {
    container?: HTMLElement;
    baseElement?: HTMLElement;
    wrapper?: React.JSXElementConstructor<{
        children: React.ReactNode;
    }>;
}
declare function render(ui: React.ReactNode, { container, baseElement, wrapper: WrapperComponent }?: ComponentRenderOptions): RenderResult;
interface RenderHookOptions<Props> extends ComponentRenderOptions {
    /**
     * The argument passed to the renderHook callback. Can be useful if you plan
     * to use the rerender utility to change the values passed to your hook.
     */
    initialProps?: Props | undefined;
}
interface RenderHookResult<Result, Props> {
    /**
     * Triggers a re-render. The props will be passed to your renderHook callback.
     */
    rerender: (props?: Props) => void;
    /**
     * This is a stable reference to the latest value returned by your renderHook
     * callback
     */
    result: {
        /**
         * The value returned by your renderHook callback
         */
        current: Result;
    };
    /**
     * Unmounts the test component. This is useful for when you need to test
     * any cleanup your useEffects have.
     */
    unmount: () => void;
    /**
     * A test helper to apply pending React updates before making assertions.
     */
    act: (callback: () => unknown) => void;
}
declare function renderHook<Props, Result>(renderCallback: (initialProps?: Props) => Result, options?: RenderHookOptions<Props>): RenderHookResult<Result, Props>;
declare function cleanup(): void;
interface RenderConfiguration {
    reactStrictMode: boolean;
}
declare function configure(customConfig: Partial<RenderConfiguration>): void;

export { type ComponentRenderOptions, type RenderConfiguration, type RenderHookOptions, type RenderHookResult, type RenderResult, cleanup, configure, render, renderHook };
