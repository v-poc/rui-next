import { ReactElement } from "react";
import { withAnimated, AnimatedStyle } from "./withAnimated";
import {
  is,
  eachProp,
  Lookup,
  HostConfig,
  AnimatedObject,
} from "./shared";

type LeafFunctionComponent<P> = {
  (props: P): ReactElement | null
  displayName?: string
};

type ElementType<P = any> =
  | React.ElementType<P>
  | LeafFunctionComponent<P>;

type AnimatableComponent = string | Exclude<ElementType, string>;

const isCustomPropRE = /^--/;

function dangerousStyleValue(name: string, value: string | number | boolean | null) {
  if (value == null || typeof value === 'boolean' || value === '') return ''
  if (
    typeof value === 'number' &&
    value !== 0 &&
    !isCustomPropRE.test(name) &&
    !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
  )
    return value + 'px'
  // Presumes implicit 'px' suffix for unitless numbers
  return ('' + value).trim()
}

const attributeCache: Lookup<string> = {};

type Instance = HTMLDivElement & { style?: Lookup };

function applyAnimatedValues(instance: Instance, props: Lookup) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false
  }

  const isFilterElement =
    instance.nodeName === 'filter' ||
    (instance.parentNode && instance.parentNode.nodeName === 'filter')

  const { style, children, scrollTop, scrollLeft, ...attributes } = props!

  const values = Object.values(attributes)
  const names = Object.keys(attributes).map(name =>
    isFilterElement || instance.hasAttribute(name)
      ? name
      : attributeCache[name] ||
        (attributeCache[name] = name.replace(
          /([A-Z])/g,
          // Attributes are written in dash case
          n => '-' + n.toLowerCase()
        ))
  )

  if (children !== void 0) {
    instance.textContent = children
  }

  // Apply CSS styles
  for (let name in style) {
    if (style.hasOwnProperty(name)) {
      const value = dangerousStyleValue(name, style[name])
      if (isCustomPropRE.test(name)) {
        instance.style.setProperty(name, value)
      } else {
        instance.style[name] = value
      }
    }
  }

  // Apply DOM attributes
  names.forEach((name, i) => {
    instance.setAttribute(name, values[i])
  })

  if (scrollTop !== void 0) {
    instance.scrollTop = scrollTop
  }
  if (scrollLeft !== void 0) {
    instance.scrollLeft = scrollLeft
  }
};

let isUnitlessNumber: { [key: string]: true } = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

const prefixKey = (prefix: string, key: string) =>
  prefix + key.charAt(0).toUpperCase() + key.substring(1);
const prefixes = ['Webkit', 'Ms', 'Moz', 'O'];

isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
  prefixes.forEach(prefix => (acc[prefixKey(prefix, prop)] = acc[prop]))
  return acc
}, isUnitlessNumber);

type Primitives = keyof JSX.IntrinsicElements;
const primitives: Primitives[] = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  // SVG
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan',
];

// A stub type that gets replaced by @react-spring/web and others.
type WithAnimated = {
  (Component: AnimatableComponent): any;
  [key: string]: any;
};

// For storing the animated version on the original component
const cacheKey = Symbol.for('AnimatedComponent');

const createHost = (
  components: AnimatableComponent[] | { [key: string]: AnimatableComponent },
  {
    applyAnimatedValues = () => false,
    createAnimatedStyle = style => new AnimatedObject(style),
    getComponentProps = props => props,
  }: Partial<HostConfig> = {}
) => {
  const hostConfig: HostConfig = {
    applyAnimatedValues,
    createAnimatedStyle,
    getComponentProps,
  }

  const animated: WithAnimated = (Component: any) => {
    const displayName = getDisplayName(Component) || 'Anonymous'

    if (is.str(Component)) {
      Component =
        animated[Component] ||
        (animated[Component] = withAnimated(Component, hostConfig))
    } else {
      Component =
        Component[cacheKey] ||
        (Component[cacheKey] = withAnimated(Component, hostConfig))
    }

    Component.displayName = `Animated(${displayName})`
    return Component
  }

  eachProp(components, (Component, key) => {
    if (is.arr(components)) {
      key = getDisplayName(Component)!
    }
    animated[key] = animated(Component)
  })

  return {
    animated,
  }
};

const getDisplayName = (arg: AnimatableComponent) =>
  is.str(arg)
    ? arg
    : arg && is.str(arg.displayName)
    ? arg.displayName
    : (is.fun(arg) && arg.name) || null;

const host = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: style => new AnimatedStyle(style),
  getComponentProps: ({ scrollTop, scrollLeft, ...props }) => props,
});

export const animated = host.animated as WithAnimated;
