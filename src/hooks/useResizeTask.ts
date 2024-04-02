import { useState } from "react";

export const useResizeTask = (
  MIN_WIDTH: number = 100
): {
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent<HTMLDivElement>) => void;
} => {
  const [isResizing, setIsResizing] = useState(false);

  const onResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);

    const target = e.currentTarget.parentElement;
    if (!target) return;

    const initialLeft = target.getBoundingClientRect().left;

    const resize = (moveEvent: MouseEvent) => {
      const left = moveEvent.clientX;
      const width = Math.max(MIN_WIDTH, left - initialLeft);
      target.style.width = `${width / 10}rem`;
      target.style.flex = "0 0 auto";
    };

    const stopResize = () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  return {
    isResizing,
    onResizeStart,
  };
};
