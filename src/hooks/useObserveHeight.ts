import { RefObject, useEffect, useRef, useState } from 'react';

export function useObserveHeight<T extends HTMLElement>(defaultRef?: RefObject<T>) {
  const [height, setHeight] = useState(0);
  const ref = defaultRef || useRef<T>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      ref.current && observer.unobserve(ref.current);
    };
  }, []);

  return {
    height,
    ref,
  };
}
