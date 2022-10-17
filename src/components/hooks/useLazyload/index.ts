import { useRef, useState } from "react";
import { canUseDOM } from "../../utils/index";

const useLazyload = (): [(el: HTMLElement | null) => void, boolean] => {
  const [isLoaded, setIsLoaded] = useState(false);

  let param = null;
  if (canUseDOM) {
    param = new IntersectionObserver(
      (
        ioEntries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        ioEntries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) {
            return;
          }

          if (
            target instanceof HTMLImageElement ||
            target instanceof HTMLMediaElement ||
            target instanceof HTMLIFrameElement
          ) {
            target.src = target.dataset.src || "";
            target.onload = () => setIsLoaded(true);
          } else if (target instanceof HTMLElement) {
            const targetSrc = target.dataset.src || "";
            const tmpImage = new Image();
            tmpImage.src = targetSrc;
            tmpImage.onload = () => {
              target.style.backgroundImage = `url(${targetSrc})`;
              setIsLoaded(true);
            };
          }

          observer.unobserve(target);
        });
      }
    );
  }

  const observerRef = useRef(param);

  const callbackRef = (el: HTMLElement | null) => {
    if (!el || !observerRef.current) {
      return;
    }

    observerRef.current.observe(el);
  };

  return [callbackRef, isLoaded];
};

export default useLazyload;
