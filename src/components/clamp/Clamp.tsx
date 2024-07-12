import React, { ReactNode } from "react";
import classnames from "classnames";

// ClampProps type
export type ClampProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  maxLines?: number;
};

// Clamp FC
const Clamp: React.FC<ClampProps> = (props) => {
  const { maxLines = 3, children, prefixCls = "r-clamp", className } = props;

  const checkboxId = `exp${(Math.random() + "").replace(".", "")}`;

  const wrapCls = classnames(`${prefixCls}-wrapper`, className);

  return (
    <div className={wrapCls}>
      <input type="checkbox" id={checkboxId} className="exp" />
      <div className="text" style={{ WebkitLineClamp: maxLines }}>
        <label htmlFor={checkboxId} className="btn" />
        {children}
      </div>
    </div>
  );
};

export default Clamp;
