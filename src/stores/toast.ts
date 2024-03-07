import { create } from "zustand";
import { ToastStackType, ToastState } from "@/types/toast";

const useToastStore = create<ToastState>((set, get) => ({
  stack: [],
  actions: {
    unshift: (toast: ToastStackType) => {
      set((state) => {
        const newStack = [toast, ...state.stack.slice(0, toast.limit - 1)];

        return { stack: newStack };
      });

      setTimeout(() => {
        get().actions.shift(toast.id);
      }, toast.duration);
    },
    shift: (id: ToastStackType["id"]) => {
      set((state) => ({
        stack: state.stack.filter((toast) => toast.id !== id),
      }));
    },
  },
}));

export const useToastActions = () => useToastStore((store) => store.actions);
export const useToastStack = () => useToastStore((store) => store.stack);
export const getToastState = () => useToastStore.getState();
