"use client";

import { createRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useToastStack } from "@/stores/toast";
import { ToastStackType } from "@/types/toast";
import styles from "./Toast.module.scss";

const SingleToast = forwardRef<HTMLDivElement, ToastStackType>(
  ({ type, message, duration }, ref) => {
    return (
      <div className={`${styles.toast} ${styles[type]}`} ref={ref}>
        <div className={styles.messageArea}>
          <p>{message}</p>
        </div>
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
