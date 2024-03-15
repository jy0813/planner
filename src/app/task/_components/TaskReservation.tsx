"use client";

import { MouseEventHandler, useMemo } from "react";

import styles from "./TaskReservation.module.scss";
import getHours from "@/utils/getHours";

const MIN_WIDTH = 100;

const TaskReservation = () => {
  const hours = useMemo(() => {
    return getHours();
  }, []);

  const dragHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget.parentElement;
    if (!target) return;

    const initialLeft = target.getBoundingClientRect().left;

    const resize: EventListener = (e) => {
      const left = (e as MouseEvent).clientX;
      const width = Math.max(MIN_WIDTH, left - initialLeft);
      target.style.width = `${width / 10}rem`;

      console.log(initialLeft, left, width);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener(
      "mouseup",
      () => document.removeEventListener("mousemove", resize),
      { once: true }
    );
  };

  console.log(hours);
  return (
    <div className={styles.reservationWrap}>
      <div className={styles.reservationTaskArea}>
        <div className={styles.reservationTaskHeaderContent}>
          <div className={styles.taskHeader}>
            <span>예약</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>접수</span>
            <div className={styles.resizeDragArea}></div>
          </div>
          <div className={styles.taskHeader}>
            <span>검사</span>
            <div className={styles.resizeDragArea}></div>
          </div>
          <div className={styles.taskHeader}>
            <span>진료</span>
            <div className={styles.resizeDragArea}></div>
            <div className={styles.subTaskHeaderArea}>
              <div className={styles.subTaskHeader}>
                <span>의사1</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>의사2</span>
              </div>
            </div>
          </div>
          <div className={styles.taskHeader}>
            <span>치료</span>
            <div className={styles.resizeDragArea}></div>
            <div className={styles.subTaskHeaderArea}>
              <div className={styles.subTaskHeader}>
                <span>원적외선</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>온열</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 1</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 2</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 3</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 4</span>
              </div>
            </div>
          </div>
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
