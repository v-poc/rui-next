/* eslint-disable no-console */
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import type { DependencyList, MutableRefObject, ReactElement, ReactNode, ReactPortal } from "react";
import type { Root } from "react-dom/client";
import useShouldRender from "../hooks/useShouldRender/index";

// Log info
export const logInfo = (content: any, type = "info"): void => {
  // @ts-ignore
  console[type] && console[type]("[RUI-log] %c%s", "background: #69C;color: #FFF", content);
};

// Check whether it is string
const isString = (str: any) => {
  return typeof str === "string";
};

// Check whether it contains double-byte characters (zh-CN)
const reDoubleByteChar = /^[\u4e00-\u9fa5]{2}$/;
const isDoubleByteChar = (str: any) => reDoubleByteChar.test(str);

// Insert one space between two `zh-CN` characters automatically
export const insertSpace = (child: any) => {
  if (isString(child.type) && isDoubleByteChar(child.props.children)) {
    return React.cloneElement(
      child,
      {},
      child.props.children.split('').join(' '),
    );
  }
  
  if (isString(child)) {
    if (isDoubleByteChar(child)) {
      child = child.split('').join(' ');
    }
    return (<span>{child}</span>);
  }
  
  return child;
};

type TargetElement = HTMLElement | Element | Document | Window;

// BasicTarget Type
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

// Get target element
export const getTargetElement = (
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | null | undefined => {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | null | undefined;

  if (typeof target === "function") {
    targetElement = target();
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
};

// Get Data Attributes
export const getDataAttr = (props: { [key: string]: any }) => {
  return Object.keys(props).reduce<{ [key: string]: string }>((prev, key) => {
    const prefix = key.substring(0, 5);
    if (prefix === 'aria-' || prefix === 'data-' || key === 'role') {
      prev[key] = props[key];
    }
    return prev;
  }, {});
};

// Check if we can use DOM
export const canUseDOM = !!(
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  window.document &&
  window.document.createElement
);

// Get css length with unit
export const getCSSLength = (v: string | number) => {
  return typeof v === "number" ? `${v}px` : v;
};

// Sort value
export const sortValue = (v: [number, number]): [number, number] => v.sort((a, b) => a - b);

// Find the nearest item from the numbers array
export const getNearest = (arr: number[], targetItem: number) => {
  return arr.reduce((prevItem, currItem) => {
    return Math.abs(prevItem - targetItem) < Math.abs(currItem - targetItem) ? prevItem : currItem;
  });
};

// Get bound
export const getBound = (pos: number, min: number | undefined, max: number | undefined) => {
  let res = pos;

  if (min !== undefined) {
    res = Math.max(pos, min);
  }

  if (max !== undefined) {
    res = Math.min(res, max);
  }
  
  return res;
};

// Attach props to component
export function attachPropsToComp<
  C,
  P extends Record<string, any>
>(
  comp: C,
  props: P
): C & P {
  const ret = comp as any;
  for (const k in props) {
    if (props.hasOwnProperty(k)) {
      ret[k] = props[k];
    }
  }
  return ret;
};

// Sleep util function
export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// Check if same deps
export function checkIfSameDeps (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean {
  if (oldDeps === deps) {
    return true;
  }

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) {
      return false;
    }
  }
  
  return true;
};

const REACT_ELEMENT_TYPE: symbol = Symbol.for("react.element");
const REACT_FRAGMENT_TYPE: symbol = Symbol.for("react.fragment");

function typeOf(object: any) {
  if (typeof object === 'object' && object !== null) {
    const $$typeof = object.$$typeof;
    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        const type = object.type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return type;
          default:
            return $$typeof;
        }
    }
  }

  return undefined;
}

// Check if fragment
export function isFragment(object: any): boolean {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
};

// Traverse ReactNode
export function traverseNode(
  children: ReactNode,
  fn: (item: ReactNode, idx: number) => void
) {
  let i = 0;
  function handle(target: ReactNode) {
    React.Children.forEach(target, (child: any) => {
      if (isFragment(child)) {
        handle(child.props.children);
      } else {
        fn(child, i);
        i += 1;
      }
    });
  }
  handle(children);
};

// with stopPropagation
export type PropagationEvent = "click";

const eventToPropRecord: Record<PropagationEvent, string> = {
  "click": "onClick",
};

export function withStopPropagation(
  events: PropagationEvent[],
  element: ReactElement
) {
  const props: Record<string, any> = { ...element.props };
  for (const key of events) {
    const prop = eventToPropRecord[key];
    props[prop] = function (e: Event) {
      e.stopPropagation();
      element.props[prop]?.(e);
    };
  }
  return React.cloneElement(element, props);
};

// whether Should Render
type ShouldRenderProps = {
  active?: boolean;
  forceRender?: boolean;
  destroyOnClose?: boolean;
  children: ReactElement;
};

export const ShouldRender: React.FC<ShouldRenderProps> = (props) => {
  const { active, forceRender, destroyOnClose, children } = props;
  const needRender = useShouldRender(active, forceRender, destroyOnClose);
  return needRender ? children : null;
};

// render to container
export type GetContainer = HTMLElement | (() => HTMLElement) | null | undefined;

export function resolveContainer(
  getContainer: GetContainer
) {
  const container =
    typeof getContainer === "function" ? getContainer() : getContainer
  return container || document.body
};

export function renderToContainer(
  getContainer: GetContainer,
  node: ReactElement
) {
  if (canUseDOM && getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container) as ReactPortal;
  }
  return node
};

// get scroll parent
type ScrollElement = HTMLElement | Window;

export function getScrollParent(
  el: Element,
  root: ScrollElement | null | undefined = canUseDOM ? window : undefined
): Window | Element | null | undefined {
  let node = el;

  while (node && node !== root && node.nodeType === 1) {
    if (node === document.body) {
      return root;
    }

    const { overflowY } = window.getComputedStyle(node);

    if (
      ["scroll", "auto", "overlay"].includes(overflowY) &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }

    node = node.parentNode as Element;
  }

  return root;
};

// supports passive
export let supportsPassive = false;

if (canUseDOM) {
  try {
    const opts = {};
    Object.defineProperty(opts, "passive", {
      get() {
        supportsPassive = true;
      },
    });

    window.addEventListener("test-passive", null as any, opts);
  } catch (e) {
    // ignore
  }
}

// render util
const MARK = "__r_root__";

// Render
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
};

function concurrentRender(node: ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container);
  root.render(node);
  container[MARK] = root;
};

export function render(node: ReactElement, container: ContainerType) {
  if (createRoot as unknown) {
    concurrentRender(node, container);
    return;
  }
};

// Unmount
async function concurrentUnmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();
    delete container[MARK];
  });
};

export function reactUnmount(container: ContainerType) {
  if (createRoot as unknown) {
    return concurrentUnmount(container);
  }
};

// render imperatively
type ImperativeProps = {
  visible?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
};

export type ImperativeHandler = {
  close: () => void;
  replace: (element: ReactElement<ImperativeProps>) => void;
};

export function renderToBody(element: ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  function unmount() {
    const unmountResult = reactUnmount(container)
    if (unmountResult && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }

  render(element, container);
  return unmount;
};

export function renderImperatively(element: ReactElement<ImperativeProps>) {
  const Wrapper = React.forwardRef<ImperativeHandler>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const closedRef = useRef(false);
    const [elementToRender, setElementToRender] = useState(element);
    const keyRef = useRef(0);

    useEffect(() => {
      if (!closedRef.current) {
        setVisible(true);
      } else {
        afterClose();
      }
    }, []);

    function onClose() {
      closedRef.current = true;
      setVisible(false);
      elementToRender.props.onClose?.();
    }

    function afterClose() {
      unmount();
      elementToRender.props.afterClose?.();
    }

    useImperativeHandle(ref, () => ({
      close: onClose,
      replace: element => {
        keyRef.current++;
        elementToRender.props.afterClose?.();
        setElementToRender(element);
      },
    }));

    return React.cloneElement(elementToRender, {
      ...elementToRender.props,
      key: keyRef.current,
      visible,
      onClose,
      afterClose,
    });
  });

  const wrapperRef = React.createRef<ImperativeHandler>();
  const unmount = renderToBody(<Wrapper ref={wrapperRef} />);

  return {
    close: () => {
      wrapperRef.current?.close();
    },
    replace: element => {
      wrapperRef.current?.replace(element);
    },
  } as ImperativeHandler
};
