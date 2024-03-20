"use client";

import { MouseEventHandler, useEffect, useMemo, useRef } from "react";

import styles from "./TaskReservation.module.scss";
import getHours from "@/utils/getHours";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getTaskData } from "@/service/getTaskData";
import { TaskData } from "@/types/task";
import { getClinicBusinessTimeDate } from "@/service/getClinicBusinessTimeData";

const MIN_WIDTH = 100;

const TaskReservation = () => {
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
  }, [taskData]);

  const dragHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget.parentElement;

    if (!target) return;

    const initialLeft = target.getBoundingClientRect().left;

    const resize: EventListener = (e) => {
      const left = (e as MouseEvent).clientX;
      const width = Math.max(MIN_WIDTH, left - initialLeft);
      target.style.width = `${width / 10}rem`;
      target.style.flex = "0 1 auto";

      console.log(initialLeft, left, width);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener(
      "mouseup",
      () => document.removeEventListener("mousemove", resize),
      { once: true }
    );
  };

  return (
    <div className={styles.reservationWrap}>
      <div className={styles.reservationTaskArea}>
        <div ref={parentRef} className={styles.reservationTaskHeaderContent}>
          {taskData?.map((task: TaskData) => {
            return (
              <div key={task.id} className={styles.taskHeader}>
                <span>{task.name}</span>
                <div
                  onMouseDown={dragHandler}
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
