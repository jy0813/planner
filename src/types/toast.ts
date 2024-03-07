export interface ToastState {
  stack: ToastStackType[];
  actions: {
    unshift: (toast: ToastStackType) => void;
    shift: (id: string) => void;
  };
}

export type ToastMessageType = "success" | "error" | "info";
export type ToastPositionType = "top" | "bottom";

export interface ToastStackType {
  id: string;
  type: ToastMessageType;
  position: ToastPositionType;
  message: string;
  limit: number;
  duration: number;
}
