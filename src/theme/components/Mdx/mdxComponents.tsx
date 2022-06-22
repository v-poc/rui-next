import { Link } from "../Link";

export const A: React.FC<{ href?: string }> = props => {
  const { href, ...restProps } = props;
  return <Link {...restProps} to={href} />;
};

export function Pre({
  children,
  className,
  style,
}: {
  children: string;
  className: string;
  style: React.CSSProperties;
}) {
  return (
    <pre
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
