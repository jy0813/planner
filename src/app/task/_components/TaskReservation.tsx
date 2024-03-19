"use client";

import { MouseEventHandler, useEffect, useMemo, useRef } from "react";

import styles from "./TaskReservation.module.scss";
import getHours from "@/utils/getHours";
import { ReservationData } from "@/types/reservation";
import { getReservationData } from "@/service/getReservationData";
import { useQuery } from "@tanstack/react-query";
import { getClinicInfoData } from "@/service/getClinicInfoData";
import { ClinicInfoData } from "@/types/clinic";

const MIN_WIDTH = 100;

const TaskReservation = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { data: reservationData } = useQuery<ReservationData[]>({
    queryKey: ["reservation"],
    queryFn: getReservationData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const { data: clinicInfoData } = useQuery<ClinicInfoData>({
    queryKey: ["clinicInfo"],
    queryFn: getClinicInfoData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  console.log(reservationData);

  const hours = useMemo(() => {
    if (clinicInfoData?.businessStartTime || clinicInfoData?.businessEndTime) {
      const startTime = parseInt(clinicInfoData?.businessStartTime);
      const endTime = parseInt(clinicInfoData?.businessEndTime);

      return getHours(startTime, endTime);
    }
    return getHours();
  }, [clinicInfoData?.businessEndTime, clinicInfoData?.businessStartTime]);

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
  }, []);

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
          <div className={styles.taskHeader}>
            <span>예약</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>접수</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>검사</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>진료</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
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
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
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
