"use client";

import {
  DragEvent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./TaskReservation.module.scss";
import getHours from "@/utils/getHours";
import { useQueries } from "@tanstack/react-query";
import { getTaskData } from "@/service/getTaskData";
import { TaskData } from "@/types/task";
import { getClinicBusinessTimeDate } from "@/service/getClinicBusinessTimeData";

const MIN_WIDTH = 100;

const TaskReservation = () => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const [{ data: taskData }, { data: businessTimeData }] = useQueries({
    queries: [
      {
        queryKey: ["task"],
        queryFn: getTaskData,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
      },
      {
        queryKey: ["business"],
        queryFn: getClinicBusinessTimeDate,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
      },
    ],
  });

  const [managedTaskData, setManagedTaskData] = useState(taskData);

  const hours = useMemo(() => {
    if (
      businessTimeData?.businessStartTime ||
      businessTimeData?.businessEndTime
    ) {
      const startTime = parseInt(businessTimeData?.businessStartTime);
      const endTime = parseInt(businessTimeData?.businessEndTime);

      return getHours(startTime, endTime);
    }
    return getHours();
  }, [businessTimeData?.businessEndTime, businessTimeData?.businessStartTime]);

  useEffect(() => {
    setManagedTaskData(taskData);
  }, [taskData]);

  useEffect(() => {
    if (parentRef.current) {
      const children = Array.from(parentRef.current.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        if (i < children.length) {
          console.log(children[i].clientWidth);
          children[i].style.width = `${children[i].clientWidth / 10}rem`;
          children[i].style.flex = "0 1 auto";
        }
      }
    }
  }, [managedTaskData]);

  const dragResizeHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget.parentElement;

    if (!target) return;

    const initialLeft = target.getBoundingClientRect().left;

    if (parentRef.current) {
      const children = Array.from(parentRef?.current.children) as HTMLElement[];
      children.forEach((child) => {
        child.style.pointerEvents = "none";
      });
    }

    const resize: EventListener = (e) => {
      const left = (e as MouseEvent).clientX;
      const width = Math.max(MIN_WIDTH, left - initialLeft);
      target.style.width = `${width / 10}rem`;
      target.style.flex = "0 1 auto";

      console.log(initialLeft, left, width);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", resize), { once: true };
      if (parentRef.current) {
        const children = Array.from(
          parentRef?.current.children
        ) as HTMLElement[];
        children.forEach((child) => {
          child.style.pointerEvents = "auto";
        });
      }
    });
  };

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    console.log((e.target as HTMLDivElement).innerHTML);
  };

  const dragEndHandler = (e: DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    console.log((e.target as HTMLDivElement).innerHTML);
  };

  const drop = () => {
    const newTaskData = [...managedTaskData];
    const dragItemValue =
      dragItem.current !== null ? newTaskData[dragItem.current] : null;
    if (dragItem.current !== null) {
      newTaskData.splice(dragItem.current, 1);
    }
    newTaskData.splice(dragOverItem.current ?? 0, 0, dragItemValue);
    dragItem.current = null;
    dragOverItem.current = null;
    console.log(newTaskData);
    setManagedTaskData(newTaskData);
  };
  return (
    <div className={styles.reservationWrap}>
      <div className={styles.reservationTaskArea}>
        <div ref={parentRef} className={styles.reservationTaskHeaderContent}>
          {managedTaskData?.map((task: TaskData, index: number) => {
            return (
              <div
                key={task.id}
                className={styles.taskHeader}
                draggable
                onDragStart={(e) => dragStartHandler(e, index)}
                onDragEnter={(e) => dragEndHandler(e, index)}
                onDragEnd={drop}
                onDragOver={(e) => e.preventDefault()}
              >
                <span>{task.name}</span>
                <div
                  onMouseDown={dragResizeHandler}
                  className={styles.resizeDragArea}
                ></div>
                <div className={styles.subTaskHeaderArea}>
                  {task.subTask.map((subTask) => {
                    return (
                      <div key={subTask.id} className={styles.subTaskHeader}>
                        <span>{subTask.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.reservationTaskBodyContent}>
          <div className={styles.reservationTimeArea}>
            {hours.map((hour, index) => (
              <div key={index} className={styles.reservationTime}>
                {hour}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReservation;
