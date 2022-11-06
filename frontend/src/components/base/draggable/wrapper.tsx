import React from "react";
import classNames from "classnames";

import styles from "./wrapper.module.css";

interface Props {
  children: React.ReactNode;
  center?: boolean;
  style?: React.CSSProperties;
}

export function Wrapper({ children, center, style }: Props) {
  return (
    <div
      className={classNames(
        styles.Wrapper,
        center && styles.center,
        "absolute"
      )}
      style={style}
    >
      {children}
    </div>
  );
}
