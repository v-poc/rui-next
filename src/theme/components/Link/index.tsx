import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'pressify/client';

export interface LinkProps extends Omit<RouterLinkProps, 'to' | 'color'> {
  to?: string;
  color?: boolean;
}

export const Link: React.FC<LinkProps> = props => {
  const {
    to = '',
    children,
    className = '',
    color = true,
    ...restProps
  } = props;
  const isSameOrigin = to.startsWith('/');
  const isHash = to.startsWith('#');

  const finalClassName = `${className} ${
    color ? 'text-c-brand hover:text-c-brand-light transition-colors' : ''
  }`;

  const finalChildren = <>{children}</>;

  return isSameOrigin ? (
    <RouterLink {...restProps} className={finalClassName} to={to}>
      {finalChildren}
    </RouterLink>
  ) : (
    <a
      {...restProps}
      className={finalClassName}
      href={to}
      {...(!isHash && {
        target: '_blank',
      })}
    >
      {children}
    </a>
  );
};
