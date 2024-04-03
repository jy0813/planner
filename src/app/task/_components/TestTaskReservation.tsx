"use client";

import { useDnd } from "@/hooks/useDnd";
import { getClinicBusinessTimeDate } from "@/service/getClinicBusinessTimeData";
import { getTaskData } from "@/service/getTaskData";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import styles from "./TaskReservation.module.scss";
import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { TaskData } from "@/types/task";
import { taskOrderingChange } from "@/service/taskOrderingChange";
import { useToast } from "@/hooks/useToast";
import FormControlLabel from "@/components/FormControlLabel/FormControlLabel";
import Checkbox from "@/components/Checkbox/Checkbox";
import { useResizable } from "@/hooks/useResizeable";
import getHours from "@/utils/getHours";
import { useResizeTask } from "@/hooks/useResizeTask";
import useLocalStorage from "@/hooks/useLocalStorage";

const TestTaskReservation = () => {
  const { showToast } = useToast();
  const parentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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

  const taskOrderChangeMutation = useMutation({
    mutationFn: ({ order, newOrder }: { order: number; newOrder: number }) =>
      taskOrderingChange(order, newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task"],
      });
      showToast("success", "변경되었습니다.");
    },
    onError: () => {
      showToast("error", "변경에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["task"],
      });
    },
  });

  const {
    dragData,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragEnd: originalOnDragEnd,
  } = useDnd<TaskData>(taskData);

  const { onResizeStart, isResizing } = useResizeTask();

  const { position, size, onMouseDown, onResizeMouseDown } = useResizable();

  const [hiddenTasks, setHiddenTasks] = useLocalStorage<
    Record<number, boolean>
  >("hiddenTasks", {});

  useEffect(() => {
    if (parentRef.current && dragData) {
      const children = Array.from(parentRef.current.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        if (i < children.length) {
          children[i].style.flex = `1 0 ${100 / children.length}%`;
          children[i].style.width = "auto";
        }
      }
      console.log(children.length, "getTaskData", parentRef.current);
    }
  }, [dragData, hiddenTasks]);

  const handleCheckboxChange = (id: number) => {
    setHiddenTasks({ ...hiddenTasks, [id]: !hiddenTasks[id] });
  };

  const onDragEnd = () => {
    const result = originalOnDragEnd();
    if (result !== null) {
      const { order, newOrder } = result;
      taskOrderChangeMutation.mutate({ order, newOrder });
    }
  };

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

  return (
    <div className={styles.reservationWrap}>
      <div className={styles.reservationFilterArea}>
        {taskData
          ?.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
          ?.map((task: TaskData) => (
            <FormControlLabel
              control={() => (
                <Checkbox
                  name={task.id.toString()}
                  id={task.id.toString()}
                  checked={!hiddenTasks[task.id]}
                  onChange={() => handleCheckboxChange(task.id)}
                  disabled={task.id === 0}
                />
              )}
              label={task.name}
              name={task.id.toString()}
              key={task.id}
            />
          ))}
      </div>
      <div className={styles.reservationTaskArea}>
        <div ref={parentRef} className={styles.reservationTaskHeaderContent}>
          {dragData
            ?.sort((a, b) => a.order - b.order)
            .map((task: TaskData) => {
              if (hiddenTasks[task.id]) return null;
              return (
                <div
                  key={task.id}
                  draggable={!isResizing}
                  onDragStart={(e) => onDragStart(e, task.order)}
                  onDragEnter={(e) => onDragEnter(e, task.order)}
                  onDragOver={onDragOver}
                  onDragEnd={onDragEnd}
                  className={styles.taskHeaderWrap}
                >
                  <div className={styles.taskHeader}>
                    <span>{task.name}</span>
                    <div className={styles.subTaskHeaderArea}>
                      {task.subTask.map((subTask) => {
                        return (
                          <div
                            key={subTask.id}
                            className={styles.subTaskHeader}
                          >
                            <span>{subTask.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    onMouseDown={onResizeStart}
                    className={styles.resizeDragArea}
                  ></div>
                  <div
                    className={styles.gridLineWrap}
                    style={{ fontSize: "1.6rem" }}
                  >
                    {task.id} 타임존 API 들어갈 자리
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
      <div>
        <div
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            transform: `translate(${position.x}px, ${position.y}px)`,
            position: "absolute",
            border: "1px solid black",
            userSelect: "none",
          }}
          onMouseDown={onMouseDown}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              position: "absolute",
              bottom: "0",
              right: "0",
              backgroundColor: "red",
              cursor: "nwse-resize",
            }}
            onMouseDown={onResizeMouseDown}
          />
        </div>
      </div>
    </div>
  );
};

export default TestTaskReservation;
