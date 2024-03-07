import { useToastActions } from "@/stores/toast";
import { ToastMessageType, ToastPositionType } from "@/types/toast";
import generateId from "@/utils/generateId";

export const useToast = () => {
  const toastActions = useToastActions();

  const showToast = (
    type: ToastMessageType,
    message: string,
    position: ToastPositionType = "top",
    limit = 3,
    duration = 3000
  ) => {
    const toast = {
      id: generateId("toast"),
      type,
      message,
      position,
      limit,
      duration,
    };
    toastActions.unshift(toast);
  };

  const removeToast = (id: string) => {
    toastActions.shift(id);
  };

  return { showToast, removeToast };
};
