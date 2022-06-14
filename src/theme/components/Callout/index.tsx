import React from 'react';
import { Bolt, Info, AlertCircle, AlertTriangle } from '../Icons';

import './style.css';

export type CalloutType = 'tip' | 'info' | 'warning' | 'danger';

const typeToIconMap: Record<CalloutType, React.ComponentType<any>> = {
  tip: Bolt,
  info: Info,
  warning: AlertCircle,
  danger: AlertTriangle,
};

export interface CalloutProps {
  type: CalloutType;
  title?: React.ReactNode;
  icon?: React.ComponentType<any> | string;
  children?: React.ReactNode;
}

export function Callout({
  type,
  title = type.toUpperCase(),
  icon = typeToIconMap[type],
  children,
}: CalloutProps) {
  return (
    <div
      className={`callout-${type} relative my-5 py-4 pl-11 pr-5 rounded-lg bg-c-bg-1 border font-medium`}
    >
      <span className="callout-icon absolute top-5 left-4 flex items-center h-[1.2em] text-[15px]">
        {typeof icon === 'string'
          ? icon
          : React.createElement(icon, { className: 'text-[1.2em]' })}
      </span>
      <div className="callout-title mb-1 text-[15px] text-c-text-0">
        {title}
      </div>
      <div className="callout-content text-[14px] text-c-text-2">
        {children}
      </div>
    </div>
  );
}
