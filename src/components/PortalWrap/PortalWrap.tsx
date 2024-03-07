"use client";

import cx from "classnames";
import React from "react";
import { useToastStack } from "@/stores/toast";
import styles from "./PortalWrap.module.scss";

const PortalWrap = () => {
  const stack = useToastStack();
  const classNames = cx(styles[stack[0]?.position]);
  return (
    <>
      <div id="toast" className={classNames}></div>
    </>
  );
};

export default PortalWrap;
