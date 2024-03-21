import { InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = ({ name, ...props }: InputProps) => {
  return (
    <input
      className={styles.checkbox}
      type="checkbox"
      id={name}
      name={name}
      {...props}
    />
  );
};

export default Checkbox;
