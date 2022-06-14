import { useEffect } from 'react';
import { useAppState } from 'pressify/client';
import nProgress from 'nprogress';
import '../styles/nprogress.css';

/**
 * show nprogress while page loading
 */
export function useLoadProgress() {
  const { pageLoading } = useAppState();

  useEffect(() => {
    if (pageLoading) {
      // delay displaying progress bar to avoid flashing
      const timer = setTimeout(() => nProgress.start(), 200);
      return () => {
        clearTimeout(timer);
        nProgress.done();
      };
    }
  }, [pageLoading]);
}
