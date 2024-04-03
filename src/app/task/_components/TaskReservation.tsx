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
import { QueryClient, useMutation, useQueries } from "@tanstack/react-query";
import { getTaskData } from "@/service/getTaskData";
import { TaskData } from "@/types/task";
import { getClinicBusinessTimeDate } from "@/service/getClinicBusinessTimeData";
import { taskOrderingChange } from "@/service/taskOrderingChange";
import { useToast } from "@/hooks/useToast";
import Checkbox from "@/components/Checkbox/Checkbox";
import FormControlLabel from "@/components/FormControlLabel/FormControlLabel";

const MIN_WIDTH = 100;

const TaskReservation = () => {
  const queryClient = new QueryClient();
  const { showToast } = useToast();
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

  const [hiddenTasks, setHiddenTasks] = useState<Record<number, boolean>>({});

  const handleCheckboxChange = (id: number) => {
    setHiddenTasks((prevState) => {
      const updatedState = { ...prevState, [id]: !prevState[id] };
      localStorage.setItem("hiddenTasks", JSON.stringify(updatedState));
      return updatedState;
    });
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

  useEffect(() => {
    if (parentRef.current) {
      const children = Array.from(parentRef.current.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        if (i < children.length) {
          children[i].style.width = `${children[i].clientWidth / 10}rem`;
          children[i].style.flex = "0 1 auto";
        }
      }
      console.log(children.length, "getTaskData");
    }
  }, [taskData]);

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

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, order: number) => {
    dragItem.current = order;
  };

  const dragEndHandler = (e: DragEvent<HTMLDivElement>, order: number) => {
    dragOverItem.current = order;
  };

  const mutation = useMutation({
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

  const drop = () => {
    const newTaskData = [...taskData];
    const dragItemValue =
      dragItem.current !== null
        ? newTaskData.find((task) => task.order === dragItem.current)
        : null;
    const dragOverItemValue =
      dragOverItem.current !== null
        ? newTaskData.find((task) => task.order === dragOverItem.current)
        : null;

    if (dragItemValue && dragOverItemValue) {
      const dragItemIndex = newTaskData.indexOf(dragItemValue);
      const dragOverItemIndex = newTaskData.indexOf(dragOverItemValue);

      newTaskData[dragItemIndex].order = dragOverItem.current ?? 0;
      newTaskData[dragOverItemIndex].order = dragItem.current ?? 0;

      mutation.mutate({
        order: dragItem.current ?? 0,
        newOrder: dragOverItem.current ?? 0,
      });
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const taskSortData = taskData
    ? [...taskData].sort((a, b) => a.order - b.order)
    : [];

  useEffect(() => {
    const storedHiddenTasks = localStorage.getItem("hiddenTasks");
    if (storedHiddenTasks) {
      setHiddenTasks(JSON.parse(storedHiddenTasks));
    }
    if (storedHiddenTasks && parentRef.current) {
      const children = Array.from(parentRef.current.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        if (i < children.length) {
          children[i].style.width = `${children[i].clientWidth / 10}rem`;
          // children[i].style.flex = "1 0 auto";
        }
      }
      console.log(children.length, "localStorage");
    }
  }, []);

  return (
    <div className={styles.reservationWrap}>
      <div className={styles.reservationFilterArea}>
        {taskData?.map((task: TaskData) => (
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
          {taskSortData?.map((task: TaskData) => {
            if (hiddenTasks[task.id]) return null;
            return (
              <div
                key={task.id}
                className={styles.taskHeader}
                draggable
                onDragStart={(e) => dragStartHandler(e, task.order)}
                onDragEnter={(e) => dragEndHandler(e, task.order)}
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
