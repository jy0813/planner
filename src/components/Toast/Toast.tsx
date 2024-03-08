"use client";

import { createRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useToastStack } from "@/stores/toast";
import { ToastMessageType, ToastStackType } from "@/types/toast";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import { IoIosInformationCircle } from "react-icons/io";
import styles from "./Toast.module.scss";
import { useToast } from "@/hooks/useToast";

const ToastIcon = ({ type }: { type: ToastMessageType }) => {
  switch (type) {
    case "success":
      return <FaCheckCircle />;
    case "error":
      return <MdError />;
    case "info":
      return <IoIosInformationCircle />;
    default:
      return null;
  }
};

const SingleToast = forwardRef<HTMLDivElement, ToastStackType>(
  ({ id, type, message, duration }, ref) => {
    const { removeToast } = useToast();

    const handleToastDelete = () => {
      removeToast(id);
    };

    return (
      <div className={`${styles.toast} ${styles[type]}`} ref={ref}>
        <ToastIcon type={type} />
        <div className={styles.messageArea}>
          <p>{message}</p>
        </div>
        <button onClick={handleToastDelete}>
          <IoTrashBin />
        </button>
        <div
          className={`${styles.progress} ${styles[type]}`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    );
  }
);

SingleToast.displayName = "SingleToast";

const Toast = () => {
  const stack = useToastStack();
  const toastRoot =
    typeof window !== "undefined" &&
    (document.getElementById("toast") as HTMLElement);

  return (
    toastRoot &&
    stack.length > 0 &&
    createPortal(
      <TransitionGroup component={null}>
        {stack.map((toast) => {
          const itemRef = createRef<HTMLDivElement>();
          return (
            <CSSTransition
              nodeRef={itemRef}
              key={toast.id}
              timeout={toast.duration / 10}
              classNames={{
                enter: styles.toastEnter,
                enterActive: styles.toastEnterActive,
                exit: styles.toastEnterExit,
                exitActive: styles.toastEnterExitActive,
                exitDone: styles.toastEnterExitDone,
              }}
            >
              <SingleToast {...toast} ref={itemRef} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>,
      toastRoot
    )
  );
};

export default Toast;
