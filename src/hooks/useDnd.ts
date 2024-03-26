import { useEffect, useRef, useState } from "react";

type DndResult = { order: number; newOrder: number };

export const useDnd = <T extends { order: number }>(
  initialData: T[]
): {
  dragData: T[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, order: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, order: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => DndResult | null;
} => {
  const [dragData, setDragData] = useState<T[]>(initialData);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    setDragData(initialData);
  }, [initialData]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, order: number) => {
    dragItem.current = order;
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>, order: number) => {
    dragOverItem.current = order;
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const swapOrders = (data: T[]): T[] => {
    const newData = [...data];
    const dragItemIndex = newData.findIndex(
      (data) => data.order === dragItem.current
    );
    const dragOverItemIndex = newData.findIndex(
      (data) => data.order === dragOverItem.current
    );

    if (dragItemIndex !== -1 && dragOverItemIndex !== -1) {
      newData[dragItemIndex].order = dragOverItem.current ?? 0;
      newData[dragOverItemIndex].order = dragItem.current ?? 0;
    }

    return newData;
  };

  const onDragEnd = (): DndResult | null => {
    if (dragItem.current === null || dragOverItem.current === null) {
      console.error("Drag and drop failed. dragItem or dragOverItem was null.");
      return null;
    }

    const newData = swapOrders(dragData);
    setDragData(newData);
    return { order: dragItem.current, newOrder: dragOverItem.current };
  };

  return {
    dragData,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd,
  };
};
