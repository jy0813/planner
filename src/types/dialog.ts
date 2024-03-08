export type ResponseHandler<T = unknown> = (value: T | PromiseLike<T>) => void;
export type DialogType = "alert" | "confirm" | "prompt";

export interface DialogStore<T = unknown> {
  title: string;
  setTitle(text: string): void;
  description: string;
  setDescription(description: string): void;
  type: DialogType;
  setType(state: DialogType): void;
  revealed: boolean;
  setRevealed: (show: boolean) => void;
  responseHandler?: ResponseHandler<T>;
  setResponseHandler(responseHandler: ResponseHandler<T>): void;
}
