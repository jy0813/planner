"use client";

import { memo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import useDialog from "@/hooks/useDialog";
import dialog from "@/stores/dialog";
import styles from "./Dialog.module.scss";

export default function Dialog() {
  const dialogRoot =
    typeof window !== "undefined" &&
    (document.getElementById("dialog") as HTMLElement);
  const inputRef = useRef<HTMLInputElement>(null);
  const { revealed, title, description, type } = dialog();
  const { onInteractionEnd } = useDialog();

  const handleConfirmClick = useCallback(() => {
    if (type === "prompt") {
      onInteractionEnd(inputRef.current?.value || "");
      return;
    }

    onInteractionEnd(true);
  }, [type, onInteractionEnd]);

  const handleCancelClick = useCallback(() => {
    if (type === "prompt") {
      onInteractionEnd("");
      return;
    }

    onInteractionEnd(false);
  }, [type, onInteractionEnd]);

  const DialogComponent = memo(function DialogComponent() {
    return (
      <div className={styles.dialogBackdrop}>
        <section className={styles.dialog}>
          <h2 className={styles.dialogTitle}>{title}</h2>
          {description && type !== "prompt" && (
            <div className={styles.dialogBody}>
              <p className={styles.dialogDescription}>{description}</p>
            </div>
          )}
          <div className={styles.dialogButtons}>
            {type !== "alert" && (
              <button onClick={handleCancelClick}>취소</button>
            )}
            <button onClick={handleConfirmClick}>확인</button>
          </div>
        </section>
      </div>
    );
  });

  return dialogRoot && revealed
    ? createPortal(<DialogComponent />, dialogRoot)
    : null;
}
