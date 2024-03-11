import { MouseEventHandler, PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import useLockBodyScroll from "@/hooks/useLockBodyScroll";
import { IoMdClose } from "react-icons/io";
import styles from "./Modal.module.scss";

interface ModalProps extends PropsWithChildren {
  title?: string;
  onClose: () => void;
}

const Modal = ({ title, onClose, children }: ModalProps) => {
  const modalRoot =
    typeof window !== "undefined" &&
    (document.getElementById("modal") as HTMLElement);
  useLockBodyScroll();

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    modalRoot &&
    createPortal(
      <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            {title ? title : null}
            <button onClick={onClose}>
              <IoMdClose />
            </button>
          </div>
          <div className={styles.modalBody}>{children}</div>
        </div>
      </div>,
      modalRoot
    )
  );
};

export default Modal;
