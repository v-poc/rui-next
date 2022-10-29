import { useEffect, useRef } from "react";
import { BasicTarget, getTargetElement } from "../../utils/index";

// Target type
export type Target = BasicTarget<HTMLElement | Element | Document | Window>;

// Options type
type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

// HTMLElement
function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void;

// Element
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void;

// Document
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void;

// Window
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>
): void;

// normal
function useEventListener(
  eventName: string,
  handler: Function,
  options: Options
): void;

// useEventListener hook
function useEventListener(
  eventName: string,
  handler: Function,
  options: Options = {}
) {
  const handlerRef = useRef<Function>();
  handlerRef.current = handler;

  const { target, capture, once, passive } = options;

  // useEffect hook
  useEffect(() => {
    const targetElement = getTargetElement(target, window);
    if (!targetElement?.addEventListener) {
      return;
    }

    const eventListener = (
      event: Event
    ): EventListenerOrEventListenerObject | AddEventListenerOptions => {
      return handlerRef.current && handlerRef.current(event);
    };

    targetElement?.addEventListener(eventName, eventListener, {
      capture,
      once,
      passive,
    });

    return () => {
      targetElement?.removeEventListener(eventName, eventListener, {
        capture,
      });
    };
  }, [eventName, target, capture, once, passive]);
}

export default useEventListener;
