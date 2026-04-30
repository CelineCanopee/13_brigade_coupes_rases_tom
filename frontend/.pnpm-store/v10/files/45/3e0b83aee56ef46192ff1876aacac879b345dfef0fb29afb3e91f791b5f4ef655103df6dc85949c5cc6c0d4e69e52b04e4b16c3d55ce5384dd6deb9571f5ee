// src/pure.tsx
import { debug, getElementLocatorSelectors } from "@vitest/browser/utils";
import React from "react";
import ReactDOMClient from "react-dom/client";
function act(cb) {
  const _act = React.act || React.unstable_act;
  if (typeof _act !== "function") {
    cb();
  } else {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    try {
      _act(cb);
    } finally {
      ;
      globalThis.IS_REACT_ACT_ENVIRONMENT = false;
    }
  }
}
var mountedContainers = /* @__PURE__ */ new Set();
var mountedRootEntries = [];
function render(ui, { container, baseElement, wrapper: WrapperComponent } = {}) {
  if (!baseElement) {
    baseElement = document.body;
  }
  if (!container) {
    container = baseElement.appendChild(document.createElement("div"));
  }
  let root;
  if (!mountedContainers.has(container)) {
    root = createConcurrentRoot(container);
    mountedRootEntries.push({ container, root });
    mountedContainers.add(container);
  } else {
    mountedRootEntries.forEach((rootEntry) => {
      if (rootEntry.container === container) {
        root = rootEntry.root;
      }
    });
  }
  act(() => {
    root.render(
      strictModeIfNeeded(wrapUiIfNeeded(ui, WrapperComponent))
    );
  });
  return {
    container,
    baseElement,
    debug: (el, maxLength, options) => debug(el, maxLength, options),
    unmount: () => {
      act(() => {
        root.unmount();
      });
    },
    rerender: (newUi) => {
      act(() => {
        root.render(
          strictModeIfNeeded(wrapUiIfNeeded(newUi, WrapperComponent))
        );
      });
    },
    asFragment: () => {
      return document.createRange().createContextualFragment(container.innerHTML);
    },
    ...getElementLocatorSelectors(baseElement)
  };
}
function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();
  function TestComponent({ renderCallbackProps }) {
    const pendingResult = renderCallback(renderCallbackProps);
    React.useEffect(() => {
      result.current = pendingResult;
    });
    return null;
  }
  const { rerender: baseRerender, unmount } = render(
    /* @__PURE__ */ React.createElement(TestComponent, { renderCallbackProps: initialProps }),
    renderOptions
  );
  function rerender(rerenderCallbackProps) {
    return baseRerender(
      /* @__PURE__ */ React.createElement(TestComponent, { renderCallbackProps: rerenderCallbackProps })
    );
  }
  return { result, rerender, unmount, act };
}
function cleanup() {
  mountedRootEntries.forEach(({ root, container }) => {
    act(() => {
      root.unmount();
    });
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
  });
  mountedRootEntries.length = 0;
  mountedContainers.clear();
}
function createConcurrentRoot(container) {
  const root = ReactDOMClient.createRoot(container);
  return {
    render(element) {
      root.render(element);
    },
    unmount() {
      root.unmount();
    }
  };
}
var config = {
  reactStrictMode: false
};
function strictModeIfNeeded(innerElement) {
  return config.reactStrictMode ? React.createElement(React.StrictMode, null, innerElement) : innerElement;
}
function wrapUiIfNeeded(innerElement, wrapperComponent) {
  return wrapperComponent ? React.createElement(wrapperComponent, null, innerElement) : innerElement;
}
function configure(customConfig) {
  Object.assign(config, customConfig);
}

export {
  render,
  renderHook,
  cleanup,
  configure
};
