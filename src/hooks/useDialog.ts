import dialog from "@/stores/dialog";
import { DialogType } from "@/types/dialog";

export default function useDialog() {
  const {
    setTitle,
    setDescription,
    setRevealed,
    setType,
    responseHandler,
    setResponseHandler,
  } = dialog();

  const onInteractionEnd = (value: string | boolean) => {
    setRevealed(false);
    responseHandler?.(value);
    setTitle("");
    setDescription("");
  };

  const setAttributes = (
    type: DialogType,
    title: string,
    description: string
  ) => {
    setRevealed(true);
    setTitle(title);
    setDescription(description);
    setType(type);
  };

  const confirm = (title: string, description = "") => {
    setAttributes("confirm", title, description);

    return new Promise((resolve) => {
      setResponseHandler(resolve);
    });
  };

  const alert = (title: string, description = "") => {
    setAttributes("alert", title, description);

    return new Promise((resolve) => {
      setResponseHandler(resolve);
    });
  };

  const prompt = (title: string, description = "") => {
    setAttributes("prompt", title, description);

    return new Promise<string>((resolve) => {
      setResponseHandler((value) => resolve(value as string));
    });
  };

  return {
    confirm,
    alert,
    prompt,
    onInteractionEnd,
  };
}
