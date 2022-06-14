// import { evaLightTheme, evaDarkTheme } from './eva-theme';
// import { tokyoNightLightTheme, tokyoNightDarkTheme } from './tokyo-night-theme';
// import { vitesseLightTheme, vitesseDarkTheme } from './vitesse-theme';

// import { SyntaxHighlighter } from '../SyntaxHighlighter';

// function useParseHeading() {
//   const elRef = useRef<HTMLHeadingElement>(null);
//   const [title, setTitle] = useState<string>('');

//   useEffect(() => {
//     if (elRef.current) {
//       setTitle((elRef.current.textContent || '').trim().replace(/^#/, ''));
//     }
//   }, []);

//   return {
//     ref: elRef,
//     title,
//   };
// }

// const HeadingAnchor: React.FC<{ id?: string }> = ({ id }) => {
//   // disable heading anchor while using hash router
//   if (__HASH_ROUTER__ || !id) {
//     return null;
//   }

//   return (
//     <a className="header-anchor" href={`#${id}`} aria-hidden="true">
//       #
//     </a>
//   );
// };

// export const H1: React.FC<{ id?: string }> = ({
//   id,
//   children,
//   ...restProps
// }) => {
//   const { ref, title } = useParseHeading();

//   return (
//     <h1 {...restProps} ref={ref} id={id} data-title={title}>
//       {/* <HeadingAnchor id={id} /> */}
//       {children}
//     </h1>
//   );
// };

// export const H2: React.FC<{ id?: string }> = ({
//   id,
//   children,
//   ...restProps
// }) => {
//   const { ref, title } = useParseHeading();

//   return (
//     <h2 {...restProps} ref={ref} id={id} data-title={title}>
//       <HeadingAnchor id={id} />
//       {children}
//     </h2>
//   );
// };

// export const H3: React.FC<{ id?: string }> = ({
//   id,
//   children,
//   ...restProps
// }) => {
//   const { ref, title } = useParseHeading();

//   return (
//     <h3 {...restProps} ref={ref} id={id} data-title={title}>
//       <HeadingAnchor id={id} />
//       {children}
//     </h3>
//   );
// };

// export const H4: React.FC<{ id?: string }> = ({
//   id,
//   children,
//   ...restProps
// }) => {
//   const { ref, title } = useParseHeading();

//   return (
//     <h4 {...restProps} ref={ref} id={id} data-title={title}>
//       <HeadingAnchor id={id} />
//       {children}
//     </h4>
//   );
// };

// export const H5: React.FC<{ id?: string }> = ({
//   id,
//   children,
//   ...restProps
// }) => {
//   const { ref, title } = useParseHeading();

//   return (
//     <h5 {...restProps} ref={ref} id={id} data-title={title}>
//       <HeadingAnchor id={id} />
//       {children}
//     </h5>
//   );
// };

// export const H6: React.FC<{ id?: string }> = ({
//   id,
//   children,
//   ...restProps
// }) => {
//   const { ref, title } = useParseHeading();

//   return (
//     <h6 {...restProps} ref={ref} id={id} data-title={title}>
//       <HeadingAnchor id={id} />
//       {children}
//     </h6>
//   );
// };

// export const A: React.FC<{ href?: string }> = props => {
//   const { href, ...restProps } = props;
//   return <Link {...restProps} to={href} />;
// };

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

// export function Code({
//   codeBlock,
//   className,
//   children,
// }: {
//   codeBlock?: boolean;
//   className?: string;
//   children?: string;
// }) {
//   if (typeof children !== 'string') {
//     return null;
//   }

//   const language = className?.match(/language-(\S+)/)?.[1];

//   if (codeBlock) {
//     return (
//       <SyntaxHighlighter language={language}>
//         {children.trim()}
//       </SyntaxHighlighter>
//     );
//   }

//   return <code>{children}</code>;
// }
