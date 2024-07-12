import React from "react";
import type { ReactElement, ReactNode } from "react";
import classnames from "classnames";
import { Badge } from "../index";
import usePropsValue from "../hooks/usePropsValue/index";
import { traverseNode } from "../utils/index";

// CornerProps type
type CornerProps = {
  className?: string;
};

// Corner FC
const Corner: React.FC<CornerProps> = (props) => {
  const { className } = props;
  return (
    <svg className={className} viewBox="0 0 30 30">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z"
          fill="#FFF"
          transform="translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) "
        />
      </g>
    </svg>
  );
};

// SideBarProps type
export type SideBarProps = {
  prefixCls?: string;
  activeKey?: string;
  children?: ReactNode;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
};

// SideBar FC
export const SideBar: React.FC<SideBarProps> = (props) => {
  const {
    prefixCls = "r-side-bar",
    activeKey,
    children,
    defaultActiveKey,
    onChange: onChangeSideBar,
  } = props;

  const cornerTopCls = classnames(
    `${prefixCls}-item-corner`,
    `${prefixCls}-item-corner-top`
  );

  const cornerBottomCls = classnames(
    `${prefixCls}-item-corner`,
    `${prefixCls}-item-corner-bottom`
  );

  let firstActiveKey: string | null = "";
  const items: ReactElement[] = [];

  traverseNode(children, (child: ReactNode, i: number) => {
    if (!React.isValidElement(child) || typeof child.key !== "string") {
      return;
    }

    if (i === 0) {
      firstActiveKey = child.key;
    }

    items.push(child);
  });

  const [currActiveKey, setCurrActiveKey] = usePropsValue({
    value: activeKey,
    defaultValue: defaultActiveKey ?? firstActiveKey,
    onChange: (val: string | null) => {
      if (val === null) {
        return;
      }
      onChangeSideBar?.(val);
    },
  });

  const lastItem = items[items.length - 1];
  const isActiveLastItem = lastItem && lastItem.key === currActiveKey;

  const onClickItem = (item: any) => {
    const { key } = item;
    if (key === null || key === undefined || item.props.disabled) {
      return;
    }

    setCurrActiveKey(String(key));
  };

  const itemCls = (item: any) => {
    return classnames(`${prefixCls}-item`, {
      [`${prefixCls}-item-active`]: item.key === currActiveKey,
      [`${prefixCls}-item-disabled`]: item.props.disabled,
    });
  };

  const lastItemCls = classnames(`${prefixCls}-extra-space`, {
    [`${prefixCls}-item-active-next-sibling`]: isActiveLastItem,
  });

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-items`}>
        {items.map((item: any, i: number) => {
          const isActiveNext =
            items[i - 1] && items[i - 1].key === currActiveKey;
          const isActivePrev =
            items[i + 1] && items[i + 1].key === currActiveKey;

          return (
            <div
              key={item.key}
              className={itemCls(item)}
              onClick={() => onClickItem(item)}
            >
              {isActiveNext && <Corner className={cornerTopCls} />}
              {isActivePrev && <Corner className={cornerBottomCls} />}
              {item.props.title && (
                <div className={`${prefixCls}-item-title`}>
                  {item.key === currActiveKey && (
                    <div className={`${prefixCls}-item-highlight`}></div>
                  )}
                  {item.props.title}
                </div>
              )}
              {item.props.badge && (
                <Badge
                  className={`${prefixCls}-badge`}
                  text={item.props.badge}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={lastItemCls}>
        {isActiveLastItem && <Corner className={cornerTopCls} />}
      </div>
    </div>
  );
};
