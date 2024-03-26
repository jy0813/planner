import { useCallback, useEffect, useRef, useState } from "react";

export const useDnd = <T extends { order: number }>(initialData: T[]) => {
  const [dragData, setDragData] = useState<T[]>(initialData);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    setDragData(initialData);
  }, [initialData]);

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

    console.log(dragItem.current, dragOverItem.current);
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
