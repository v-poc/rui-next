import { useEffect, useRef } from 'react';
import { useNavigationType, useAppState } from 'pressify/client';
import { scrollPromise } from './useScrollPromise';

/**
 * scroll to top while page change
 */
export function useScrollToTop() {
  const { pagePath } = useAppState();
  const navigationType = useNavigationType();
  const navigationTypeRef = useRef(navigationType);

  navigationTypeRef.current = navigationType;

  useEffect(() => {
    if (navigationTypeRef.current === 'PUSH' && !window.location.hash) {
      (async () => {
        await scrollPromise.wait();
        window.scrollTo({
          top: 0,
        });
      })();
    }
  }, [pagePath]);
}
