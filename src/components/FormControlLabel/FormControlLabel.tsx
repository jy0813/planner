import { LabelHTMLAttributes, ReactNode } from "react";
import styles from "./FormControlLabel.module.scss";
interface FormControlLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  control: (name: string) => ReactNode;
  label: string;
  name: string;
}

const FormControlLabel = ({ control, label, name }: FormControlLabelProps) => {
  return (
    <label className={styles.labelWrap} htmlFor={name}>
      {control(name)}
      <span>{label}</span>
    </label>
  );
};

export default FormControlLabel;
