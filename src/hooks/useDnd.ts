import { useCallback, useRef, useState } from "react";

interface DndProps {
  order: number;
  [key: string]: any;
}

export const useDnd = (initialData: DndProps[]) => {
  const [dragData, setDragData] = useState(initialData);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, order: number) => {
      dragItem.current = order;
    },
    []
  );

  const onDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>, order: number) => {
      dragOverItem.current = order;
    },
    []
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onDragEnd = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newData = [...dragData];
    const dragItemValue = newData.find(
      (data) => data.order === dragItem.current
    );
    const dragOverItemValue = newData.find(
      (data) => data.order === dragOverItem.current
    );
    if (dragItemValue && dragOverItemValue) {
      const dragItemIndex = newData.indexOf(dragItemValue);
      const dragOverItemIndex = newData.indexOf(dragOverItemValue);

      newData[dragItemIndex].order = dragOverItem.current ?? 0;
      newData[dragOverItemIndex].order = dragItem.current ?? 0;

      setDragData(newData);
    }
    return { order: dragItem.current, newOrder: dragOverItem.current };
  }, [dragData]);

  return {
    dragData,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd,
  };
};
