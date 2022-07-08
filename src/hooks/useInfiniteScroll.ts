import { useCallback, useRef } from "react";

const useInfiniteScroll = (callback: () => void, loading: boolean, end: boolean) => {
  const observer = useRef() as React.MutableRefObject<IntersectionObserver>;
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && end) {
            callback();
          }
        },
        { threshold: 0.5 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, end, callback]
  );

  return lastElementRef
}

export { useInfiniteScroll };