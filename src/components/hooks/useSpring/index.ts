/*
 * Inspired by @react-spring | MIT License (https://github.com/pmndrs/react-spring)
 */
import { useContext, useMemo, useRef, useEffect } from "react";
import useIsomorphicLayoutEffect from "../useIsomorphicLayoutEffect/index";
import { SpringContext } from "./SpringContext";
import {
  is,
  each,
  eachProp,
  toArray,
  getAnimated,
  setAnimated,
  getPayload,
  addFluidObserver,
  removeFluidObserver,
  hasFluidValue,
  getFluidValue,
  callFluidObservers,
  getFluidObservers,
  raf,
  createInterpolator,
  getAnimatedType,
  isAnimatedString,
  useForceUpdate,
  useOnce,
  Lookup,
  Any,
  AnyFn,
  Arrify,
  OneOrMore,
  FluidValue,
  FluidObserver,
  Timeout,
  AnimatedValue,
  EasingFunction,
  Constrain,
  InterpolatorArgs,
  InterpolatorFn,
  G_createStringInterpolator,
  Animated,
  AnimatedString,
} from "../../utils/shared";

// usePrev hook
/** Use a value from the previous render */
function usePrev<T>(value: T): T | undefined {
  const prevRef = useRef<any>();

  useEffect(() => {
    prevRef.current = value;
  });

  return prevRef.current;
}

/** The property symbol of the current animation phase. */
const $P = Symbol.for("SpringPhase");

const HAS_ANIMATED = 1;
const IS_ANIMATING = 2;
const IS_PAUSED = 4;

/** Returns true if the `target` has ever animated. */
const hasAnimated = (target: any) => (target[$P] & HAS_ANIMATED) > 0;

/** Returns true if the `target` is animating (even if paused). */
const isAnimating = (target: any) => (target[$P] & IS_ANIMATING) > 0;

/** Returns true if the `target` is paused (even if idle). */
const isPaused = (target: any) => (target[$P] & IS_PAUSED) > 0;

/** Set the active bit of the `target` phase. */
const setActiveBit = (target: any, active: boolean) =>
  active
    ? (target[$P] |= IS_ANIMATING | HAS_ANIMATED)
    : (target[$P] &= ~IS_ANIMATING);

const setPausedBit = (target: any, paused: boolean) =>
  paused ? (target[$P] |= IS_PAUSED) : (target[$P] &= ~IS_PAUSED);

/** Event props with "active handler" support */
const ACTIVE_EVENTS = [
  "onStart",
  "onRest",
  "onChange",
  "onPause",
  "onResume",
] as const;

/**
 * These props are implicitly used as defaults when defined in a
 * declarative update (eg: render-based) or any update with `default: true`.
 *
 * Use `default: {}` or `default: false` to opt-out of these implicit defaults
 * for any given update.
 *
 * Note: These are not the only props with default values. For example, the
 * `pause`, `cancel`, and `immediate` props. But those must be updated with
 * the object syntax (eg: `default: { immediate: true }`).
 */
const DEFAULT_PROPS = [
  "config",
  "onProps",
  "onStart",
  "onChange",
  "onPause",
  "onResume",
  "onRest",
] as const;

const RESERVED_PROPS: {
  [key: string]: 1 | undefined;
} = {
  config: 1,
  from: 1,
  to: 1,
  ref: 1,
  loop: 1,
  reset: 1,
  pause: 1,
  cancel: 1,
  reverse: 1,
  immediate: 1,
  default: 1,
  delay: 1,
  onProps: 1,
  onStart: 1,
  onChange: 1,
  onPause: 1,
  onResume: 1,
  onRest: 1,
  onResolve: 1,

  // Transition props
  items: 1,
  trail: 1,
  sort: 1,
  expires: 1,
  initial: 1,
  enter: 1,
  update: 1,
  leave: 1,
  children: 1,
  onDestroyed: 1,

  // Internal props
  keys: 1,
  callId: 1,
  parentId: 1,
};

// The `mass` prop defaults to 1
const config = {
  default: { tension: 170, friction: 26 },
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  molasses: { tension: 280, friction: 120 },
} as const;

/**
 * With thanks to ai easings.net
 */
interface EasingDictionary {
  linear: (t: number) => number;
  easeInQuad: (t: number) => number;
  easeOutQuad: (t: number) => number;
  easeInOutQuad: (t: number) => number;
  easeInCubic: (t: number) => number;
  easeOutCubic: (t: number) => number;
  easeInOutCubic: (t: number) => number;
  easeInQuart: (t: number) => number;
  easeOutQuart: (t: number) => number;
  easeInOutQuart: (t: number) => number;
  easeInQuint: (t: number) => number;
  easeOutQuint: (t: number) => number;
  easeInOutQuint: (t: number) => number;
  easeInSine: (t: number) => number;
  easeOutSine: (t: number) => number;
  easeInOutSine: (t: number) => number;
  easeInExpo: (t: number) => number;
  easeOutExpo: (t: number) => number;
  easeInOutExpo: (t: number) => number;
  easeInCirc: (t: number) => number;
  easeOutCirc: (t: number) => number;
  easeInOutCirc: (t: number) => number;
  easeInBack: (t: number) => number;
  easeOutBack: (t: number) => number;
  easeInOutBack: (t: number) => number;
  easeInElastic: (t: number) => number;
  easeOutElastic: (t: number) => number;
  easeInOutElastic: (t: number) => number;
  easeInBounce: (t: number) => number;
  easeOutBounce: (t: number) => number;
  easeInOutBounce: (t: number) => number;
}

const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * Math.PI) / 3;
const c5 = (2 * Math.PI) / 4.5;

const bounceOut: EasingFunction = (x) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};

const easings: EasingDictionary = {
  linear: (x) => x,
  easeInQuad: (x) => x * x,
  easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
  easeInOutQuad: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  easeInCubic: (x) => x * x * x,
  easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
  easeInOutCubic: (x) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  easeInQuart: (x) => x * x * x * x,
  easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
  easeInOutQuart: (x) =>
    x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  easeInQuint: (x) => x * x * x * x * x,
  easeOutQuint: (x) => 1 - Math.pow(1 - x, 5),
  easeInOutQuint: (x) =>
    x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
  easeInSine: (x) => 1 - Math.cos((x * Math.PI) / 2),
  easeOutSine: (x) => Math.sin((x * Math.PI) / 2),
  easeInOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  easeInExpo: (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
  easeOutExpo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  easeInOutExpo: (x) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? Math.pow(2, 20 * x - 10) / 2
      : (2 - Math.pow(2, -20 * x + 10)) / 2,
  easeInCirc: (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  easeOutCirc: (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
  easeInOutCirc: (x) =>
    x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
  easeInBack: (x) => c3 * x * x * x - c1 * x * x,
  easeOutBack: (x) => 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2),
  easeInOutBack: (x) =>
    x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2,
  easeInElastic: (x) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4),
  easeOutElastic: (x) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1,
  easeInOutElastic: (x) =>
    x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1,
  easeInBounce: (x) => 1 - bounceOut(1 - x),
  easeOutBounce: bounceOut,
  easeInOutBounce: (x) =>
    x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2,
} as const;

function noop() {}

/**
 * types / interfaces
 */

/** Intersected with other object types to allow for unknown properties */
interface UnknownProps extends Lookup<unknown> {}

/** Try to simplify `&` out of an object type */
type Remap<T> = {} & {
  [P in keyof T]: T[P];
};

/** Ensure the given type is an object type */
type ObjectType<T> = T extends object ? T : {};

/** Intersect a union of objects but merge property types with _unions_ */
type ObjectFromUnion<T extends object> = Remap<{
  [P in keyof Intersect<T>]: T extends infer U
    ? P extends keyof U
      ? U[P]
      : never
    : never;
}>;

/** Convert a union to an intersection */
type Intersect<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/** Override the property types of `A` with `B` and merge any new properties */
type Merge<A, B> = Remap<
  { [P in keyof A]: P extends keyof B ? B[P] : A[P] } & Omit<B, keyof A>
>;

type Falsy = false | null | undefined;

function isAsyncTo(to: any) {
  return is.fun(to) || (is.arr(to) && is.obj(to[0]));
}

/** Compare animatable values */
function isEqual(a: any, b: any) {
  if (is.arr(a)) {
    if (!is.arr(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  return a === b;
}

/** Copy the `queue`, then iterate it after the `queue` is cleared */
function flush<P, T>(queue: Map<P, T>, iterator: (entry: [P, T]) => void): void;

function flush<T>(queue: Set<T>, iterator: (value: T) => void): void;

function flush(queue: any, iterator: any) {
  if (queue.size) {
    const items = Array.from(queue);
    queue.clear();
    each(items, iterator);
  }
}

/** Call every function in the queue with the same arguments. */
const flushCalls = <T extends AnyFn>(queue: Set<T>, ...args: Parameters<T>) =>
  flush(queue, (fn) => fn(...args));

const defaults: any = {
  ...config.default, // configs.default
  mass: 1,
  damping: 1,
  easing: easings.linear,
  clamp: false,
};

class AnimationConfig {
  /**
   * With higher tension, the spring will resist bouncing and try harder to stop at its end value.
   *
   * When tension is zero, no animation occurs.
   */
  tension!: number;

  /**
   * The damping ratio coefficient, or just the damping ratio when `speed` is defined.
   *
   * When `speed` is defined, this value should be between 0 and 1.
   *
   * Higher friction means the spring will slow down faster.
   */
  friction!: number;

  /**
   * The natural frequency (in seconds), which dictates the number of bounces
   * per second when no damping exists.
   *
   * When defined, `tension` is derived from this, and `friction` is derived
   * from `tension` and `damping`.
   */
  frequency?: number;

  /**
   * The damping ratio, which dictates how the spring slows down.
   *
   * Set to `0` to never slow down. Set to `1` to slow down without bouncing.
   * Between `0` and `1` is for you to explore.
   *
   * Only works when `frequency` is defined.
   *
   * Defaults to 1
   */
  damping!: number;

  /**
   * Higher mass means more friction is required to slow down.
   *
   * Defaults to 1, which works fine most of the time.
   */
  mass!: number;

  /**
   * The initial velocity of one or more values.
   */
  velocity: number | number[] = 0;

  /**
   * The smallest velocity before the animation is considered "not moving".
   *
   * When undefined, `precision` is used instead.
   */
  restVelocity?: number;

  /**
   * The smallest distance from a value before that distance is essentially zero.
   *
   * This helps in deciding when a spring is "at rest". The spring must be within
   * this distance from its final value, and its velocity must be lower than this
   * value too (unless `restVelocity` is defined).
   */
  precision?: number;

  /**
   * For `duration` animations only. Note: The `duration` is not affected
   * by this property.
   *
   * Defaults to `0`, which means "start from the beginning".
   *
   * Setting to `1+` makes an immediate animation.
   *
   * Setting to `0.5` means "start from the middle of the easing function".
   *
   * Any number `>= 0` and `<= 1` makes sense here.
   */
  progress?: number;

  /**
   * Animation length in number of milliseconds.
   */
  duration?: number;

  /**
   * The animation curve. Only used when `duration` is defined.
   *
   * Defaults to quadratic ease-in-out.
   */
  easing!: EasingFunction;

  /**
   * Avoid overshooting by ending abruptly at the goal value.
   */
  clamp!: boolean;

  /**
   * When above zero, the spring will bounce instead of overshooting when
   * exceeding its goal value. Its velocity is multiplied by `-1 + bounce`
   * whenever its current value equals or exceeds its goal. For example,
   * setting `bounce` to `0.5` chops the velocity in half on each bounce,
   * in addition to any friction.
   */
  bounce?: number;

  /**
   * "Decay animations" decelerate without an explicit goal value.
   * Useful for scrolling animations.
   *
   * Use `true` for the default exponential decay factor (`0.998`).
   *
   * When a `number` between `0` and `1` is given, a lower number makes the
   * animation slow down faster. And setting to `1` would make an unending
   * animation.
   */
  decay?: boolean | number;

  /**
   * While animating, round to the nearest multiple of this number.
   * The `from` and `to` values are never rounded, as well as any value
   * passed to the `set` method of an animated value.
   */
  round?: number;

  constructor() {
    Object.assign(this, defaults);
  }
}

function mergeConfig(
  config: AnimationConfig,
  newConfig: Partial<AnimationConfig>,
  defaultConfig?: Partial<AnimationConfig>
): typeof config;

function mergeConfig(config: any, newConfig: object, defaultConfig?: object) {
  if (defaultConfig) {
    defaultConfig = { ...defaultConfig };
    sanitizeConfig(defaultConfig, newConfig);
    newConfig = { ...defaultConfig, ...newConfig };
  }

  sanitizeConfig(config, newConfig);
  Object.assign(config, newConfig);

  for (const key in defaults) {
    if (config[key] == null) {
      config[key] = defaults[key];
    }
  }

  let { mass, frequency, damping } = config;
  if (!is.und(frequency)) {
    if (frequency < 0.01) frequency = 0.01;
    if (damping < 0) damping = 0;
    config.tension = Math.pow((2 * Math.PI) / frequency, 2) * mass;
    config.friction = (4 * Math.PI * damping * mass) / frequency;
  }

  return config;
}

// Prevent a config from accidentally overriding new props.
// This depends on which "config" props take precedence when defined.
function sanitizeConfig(
  config: Partial<AnimationConfig>,
  props: Partial<AnimationConfig>
) {
  if (!is.und(props.decay)) {
    config.duration = undefined;
  } else {
    const isTensionConfig = !is.und(props.tension) || !is.und(props.friction);
    if (
      isTensionConfig ||
      !is.und(props.frequency) ||
      !is.und(props.damping) ||
      !is.und(props.mass)
    ) {
      config.duration = undefined;
      config.decay = undefined;
    }
    if (isTensionConfig) {
      config.frequency = undefined;
    }
  }
}

type ControllerUpdate<
  State extends Lookup = Lookup,
  Item = undefined
> = unknown & ToProps<State> & ControllerProps<State, Item>;

/**
 * Props for `Controller` methods and constructor.
 */
interface ControllerProps<State extends Lookup = Lookup, Item = undefined>
  extends AnimationProps<State> {
  ref?: SpringRef<State>;
  from?: GoalValues<State> | Falsy;
  // FIXME: Use "ControllerUpdate<T>" once type recursion is good enough.
  loop?: LoopProp<ControllerUpdate>;
  /**
   * Called when the # of animating values exceeds 0
   *
   * Also accepts an object for per-key events
   */
  onStart?:
    | OnStart<SpringValue<State>, Controller<State>, Item>
    | {
        [P in keyof State]?: OnStart<
          SpringValue<State[P]>,
          Controller<State>,
          Item
        >;
      };
  /**
   * Called when the # of animating values hits 0
   *
   * Also accepts an object for per-key events
   */
  onRest?:
    | OnRest<SpringValue<State>, Controller<State>, Item>
    | {
        [P in keyof State]?: OnRest<
          SpringValue<State[P]>,
          Controller<State>,
          Item
        >;
      };
  /**
   * Called once per frame when animations are active
   *
   * Also accepts an object for per-key events
   */
  onChange?:
    | OnChange<SpringValue<State>, Controller<State>, Item>
    | {
        [P in keyof State]?: OnChange<
          SpringValue<State[P]>,
          Controller<State>,
          Item
        >;
      };

  onPause?:
    | OnPause<SpringValue<State>, Controller<State>, Item>
    | {
        [P in keyof State]?: OnPause<
          SpringValue<State[P]>,
          Controller<State>,
          Item
        >;
      };
  onResume?:
    | OnResume<SpringValue<State>, Controller<State>, Item>
    | {
        [P in keyof State]?: OnResume<
          SpringValue<State[P]>,
          Controller<State>,
          Item
        >;
      };
  /**
   * Called after an animation is updated by new props.
   * Useful for manipulation
   *
   * Also accepts an object for per-key events
   */
  onProps?: OnProps<State> | { [P in keyof State]?: OnProps<State[P]> };
  /**
   * Called when the promise for this update is resolved.
   */
  onResolve?: OnResolve<SpringValue<State>, Controller<State>, Item>;
}

type LoopProp<T extends object> = boolean | T | (() => boolean | T);

type VelocityProp<T = any> = T extends ReadonlyArray<number | string>
  ? number[]
  : number;

/** For props that can be set on a per-key basis. */
type MatchProp<T> =
  | boolean
  | OneOrMore<StringKeys<T>>
  | ((key: StringKeys<T>) => boolean);

/** Event props can be customized per-key. */
type EventProp<T> = T | Lookup<T | undefined>;

/** The object type of the `config` prop. */
type SpringConfig = Partial<AnimationConfig>;

/** The object given to the `onRest` prop and `start` promise. */
interface AnimationResult<T extends Readable = any> {
  value: T extends Readable<infer U> ? U : never;
  /** When true, no animation ever started. */
  noop?: boolean;
  /** When true, the animation was neither cancelled nor stopped prematurely. */
  finished?: boolean;
  /** When true, the animation was cancelled before it could finish. */
  cancelled?: boolean;
}

/** The promised result of an animation. */
type AsyncResult<T extends Readable = any> = Promise<AnimationResult<T>>;

/**
 * Most of the reserved animation props, except `to`, `from`, `loop`,
 * and the event props.
 */
interface AnimationProps<T = any> {
  /**
   * Configure the spring behavior for each key.
   */
  config?: SpringConfig | ((key: StringKeys<T>) => SpringConfig);
  /**
   * Milliseconds to wait before applying the other props.
   */
  delay?: number | ((key: StringKeys<T>) => number);
  /**
   * When true, props jump to their goal values instead of animating.
   */
  immediate?: MatchProp<T>;
  /**
   * Cancel all animations by using `true`, or some animations by using a key
   * or an array of keys.
   */
  cancel?: MatchProp<T>;
  /**
   * Pause all animations by using `true`, or some animations by using a key
   * or an array of keys.
   */
  pause?: MatchProp<T>;
  /**
   * Start the next animations at their values in the `from` prop.
   */
  reset?: MatchProp<T>;
  /**
   * Swap the `to` and `from` props.
   */
  reverse?: boolean;
  /**
   * Override the default props with this update.
   */
  default?: boolean | SpringProps<T>;
}

/**
 * Extract the custom props that are treated like `to` values
 */
type ForwardProps<T extends object> = RawValues<
  Omit<Constrain<T, {}>, keyof ReservedProps>
>;

/** The phases of a `useTransition` item */
type TransitionKey = "initial" | "enter" | "update" | "leave";

/**
 * Extract a union of animated values from a set of `useTransition` props.
 */
type TransitionValues<Props extends object> = unknown &
  ForwardProps<
    ObjectFromUnion<
      Constrain<
        ObjectType<
          Props[TransitionKey & keyof Props] extends infer T
            ? T extends ReadonlyArray<infer Element>
              ? Element
              : T extends (...args: any[]) => infer Return
              ? Return extends ReadonlyArray<infer ReturnElement>
                ? ReturnElement
                : Return
              : T
            : never
        >,
        {}
      >
    >
  >;

/**
 * Property names that are reserved for animation config
 */
interface ReservedEventProps {
  onProps?: any;
  onStart?: any;
  onChange?: any;
  onPause?: any;
  onResume?: any;
  onRest?: any;
  onResolve?: any;
  onDestroyed?: any;
}

interface ReservedProps extends ReservedEventProps {
  config?: any;
  from?: any;
  to?: any;
  ref?: any;
  loop?: any;
  pause?: any;
  reset?: any;
  cancel?: any;
  reverse?: any;
  immediate?: any;
  default?: any;
  delay?: any;
  // Transition props
  items?: any;
  trail?: any;
  sort?: any;
  expires?: any;
  initial?: any;
  enter?: any;
  update?: any;
  leave?: any;
  children?: any;
  // Internal props
  keys?: any;
  callId?: any;
  parentId?: any;
}

/**
 * Pick the properties of these object props
 *   ("to", "from", "initial", "enter", "update", "leave")
 *   as well as any forward props.
 */
type PickAnimated<Props extends object, Fwd = true> = unknown &
  ([Props] extends [Any]
    ? Lookup // Preserve "any" instead of resolving to "{}"
    : [object] extends [Props]
    ? Lookup
    : ObjectFromUnion<
        Props extends { from: infer From } // extract prop from the `from` prop if it exists
          ? From extends () => any
            ? ReturnType<From>
            : ObjectType<From>
          : TransitionKey & keyof Props extends never
          ? ToValues<Props, Fwd>
          : TransitionValues<Props>
      >);

/**
 * Pick the values of the `to` prop. Forward props are *not* included.
 */
type ToValues<Props extends object, AndForward = true> = unknown &
  (AndForward extends true ? ForwardProps<Props> : unknown) &
  (Props extends { to?: any }
    ? Exclude<Props["to"], Function | ReadonlyArray<any>> extends infer To
      ? ForwardProps<[To] extends [object] ? To : Partial<Extract<To, object>>>
      : never
    : unknown);

/** Replace the type of each `T` property with `never` (unless compatible with `U`) */
type Valid<T, U> = NeverProps<T, InvalidKeys<T, U>>;

/** Replace the type of each `P` property with `never` */
type NeverProps<T, P extends keyof T> = Remap<
  Pick<T, Exclude<keyof T, P>> & { [K in P]: never }
>;

/** Return a union type of every key whose `T` value is incompatible with its `U` value */
type InvalidKeys<T, U> = {
  [P in keyof T & keyof U]: T[P] extends U[P] ? never : P;
}[keyof T & keyof U];

/** Unwrap any `FluidValue` object types */
type RawValues<T extends object> = {
  [P in keyof T]: T[P] extends FluidValue<infer U> ? U : T[P];
};

/**
 * For testing whether a type is an object but not an array.
 *     T extends IsPlainObject<T> ? true : false
 * When `any` is passed, the resolved type is `true | false`.
 */
type IsPlainObject<T> = T extends ReadonlyArray<any>
  ? Any
  : T extends object
  ? object
  : Any;

type StringKeys<T> = T extends IsPlainObject<T> ? string & keyof T : string;

/** Add the `FluidValue` type to every property. */
type FluidProps<T> = T extends object
  ? { [P in keyof T]: T[P] | FluidValue<Exclude<T[P], void>> }
  : unknown;

/**
 * The set of `SpringValue` objects returned by a `useSpring` call (or similar).
 */
type SpringValues<T extends Lookup = any> = [T] extends [Any]
  ? Lookup<SpringValue<unknown> | undefined> // Special case: "any"
  : { [P in keyof T]: SpringWrap<T[P]> };

// Wrap a type with `SpringValue`
type SpringWrap<T> = [
  Exclude<T, FluidValue>,
  Extract<T, readonly any[]> // Arrays are animated.
] extends [object | void, never]
  ? never // Object literals cannot be animated.
  : SpringValue<Exclude<T, FluidValue | void>> | Extract<T, void>;

// type AnyFn = (...args: any[]) => any;

interface OpaqueAnimation {
  idle: boolean;
  priority: number;
  advance(dt: number): void;
}

// Animations starting on the next frame
const startQueue = new Set<OpaqueAnimation>();

// The animations being updated in the current frame, sorted by lowest
// priority first. These two arrays are swapped at the end of each frame.
let currentFrame: OpaqueAnimation[] = [];
let prevFrame: OpaqueAnimation[] = [];

// The priority of the currently advancing animation.
// To protect against a race condition whenever a frame is being processed,
// where the filtering of `animations` is corrupted with a shifting index,
// causing animations to potentially advance 2x faster than intended.
let priority = 0;

/**
 * The frameloop executes its animations in order of lowest priority first.
 * Animations are retained until idle.
 */
const frameLoop = {
  get idle() {
    return !startQueue.size && !currentFrame.length;
  },

  /** Advance the given animation on every frame until idle. */
  start(animation: OpaqueAnimation) {
    // An animation can be added while a frame is being processed,
    // unless its priority is lower than the animation last updated.
    if (priority > animation.priority) {
      startQueue.add(animation);
      raf.onStart(flushStartQueue);
    } else {
      startSafely(animation);
      raf(advance);
    }
  },

  /** Advance all animations by the given time. */
  advance,

  /** Call this when an animation's priority changes. */
  sort(animation: OpaqueAnimation) {
    if (priority) {
      raf.onFrame(() => frameLoop.sort(animation));
    } else {
      const prevIndex = currentFrame.indexOf(animation);
      if (~prevIndex) {
        currentFrame.splice(prevIndex, 1);
        startUnsafely(animation);
      }
    }
  },

  /**
   * Clear all animations. For testing purposes.
   *
   * ☠️ Never call this from within the frameloop.
   */
  clear() {
    currentFrame = [];
    startQueue.clear();
  },
};

function flushStartQueue() {
  startQueue.forEach(startSafely);
  startQueue.clear();
  raf(advance);
}

function startSafely(animation: OpaqueAnimation) {
  if (!currentFrame.includes(animation)) startUnsafely(animation);
}

function startUnsafely(animation: OpaqueAnimation) {
  currentFrame.splice(
    findIndex(currentFrame, (other) => other.priority > animation.priority),
    0,
    animation
  );
}

function advance(dt: number) {
  const nextFrame = prevFrame;

  for (let i = 0; i < currentFrame.length; i++) {
    const animation = currentFrame[i];
    priority = animation.priority;

    // Animations may go idle before advancing.
    if (!animation.idle) {
      G_willAdvance(animation);
      animation.advance(dt);
      if (!animation.idle) {
        nextFrame.push(animation);
      }
    }
  }
  priority = 0;

  // Reuse the `currentFrame` array to avoid garbage collection.
  prevFrame = currentFrame;
  prevFrame.length = 0;

  // Set `currentFrame` for next frame, so the `start` function
  // adds new animations to the proper array.
  currentFrame = nextFrame;

  return currentFrame.length > 0;
}

/** Like `Array.prototype.findIndex` but returns `arr.length` instead of `-1` */
function findIndex<T>(arr: T[], test: (value: T) => boolean) {
  const index = arr.findIndex(test);
  return index < 0 ? arr.length : index;
}

// G.to
let G_to: <Input, Output>(
  source: OneOrMore<FluidValue>,
  args: InterpolatorArgs<Input, Output>
) => FluidValue<Output>;

// G.skipAnimation
let G_skipAnimation = false as boolean;

// G.willAdvance
let G_willAdvance: (animation: OpaqueAnimation) => void = noop;

const isFrameValue = (value: any): value is FrameValue =>
  value instanceof FrameValue;

let nextId = 1;

/**
 * A kind of `FluidValue` that manages an `AnimatedValue` node.
 *
 * Its underlying value can be accessed and even observed.
 */
abstract class FrameValue<T = any> extends FluidValue<T, FrameValue.Event<T>> {
  readonly id = nextId++;

  abstract key?: string;
  abstract get idle(): boolean;

  protected _priority = 0;

  get priority() {
    return this._priority;
  }
  set priority(priority: number) {
    if (this._priority != priority) {
      this._priority = priority;
      this._onPriorityChange(priority);
    }
  }

  /** Get the current value */
  get(): T {
    const node = getAnimated(this);
    return node && node.getValue();
  }

  /** Create a spring that maps our value to another value */
  to<Out>(...args: InterpolatorArgs<T, Out>) {
    return G_to(this, args) as Interpolation<T, Out>;
  }

  /** @deprecated Use the `to` method instead. */
  //  interpolate<Out>(...args: InterpolatorArgs<T, Out>) {
  //    deprecateInterpolate()
  //    return G_to(this, args) as Interpolation<T, Out>
  //  }

  toJSON() {
    return this.get();
  }

  protected observerAdded(count: number) {
    if (count == 1) this._attach();
  }

  protected observerRemoved(count: number) {
    if (count == 0) this._detach();
  }

  /** @internal */
  abstract advance(dt: number): void;

  /** @internal */
  abstract eventObserved(_event: FrameValue.Event): void;

  /** Called when the first child is added. */
  protected _attach() {}

  /** Called when the last child is removed. */
  protected _detach() {}

  /** Tell our children about our new value */
  protected _onChange(value: T, idle = false) {
    callFluidObservers(this, {
      type: "change",
      parent: this,
      value,
      idle,
    });
  }

  /** Tell our children about our new priority */
  protected _onPriorityChange(priority: number) {
    if (!this.idle) {
      frameLoop.sort(this);
    }
    callFluidObservers(this, {
      type: "priority",
      parent: this,
      priority,
    });
  }
}

/**
 * FrameValue namespace
 */
declare namespace FrameValue {
  /** A parent changed its value */
  interface ChangeEvent<T = any> {
    parent: FrameValue<T>;
    type: "change";
    value: T;
    idle: boolean;
  }

  /** A parent changed its priority */
  interface PriorityEvent<T = any> {
    parent: FrameValue<T>;
    type: "priority";
    priority: number;
  }

  /** A parent is done animating */
  interface IdleEvent<T = any> {
    parent: FrameValue<T>;
    type: "idle";
  }

  /** Events sent to children of `FrameValue` objects */
  export type Event<T = any> = ChangeEvent<T> | PriorityEvent<T> | IdleEvent<T>;
}

/**
 * An `Interpolation` is a memoized value that's computed whenever one of its
 * `FluidValue` dependencies has its value changed.
 *
 * Other `FrameValue` objects can depend on this. For example, passing an
 * `Interpolation` as the `to` prop of a `useSpring` call will trigger an
 * animation toward the memoized value.
 */
class Interpolation<Input = any, Output = any> extends FrameValue<Output> {
  /** Useful for debugging. */
  key?: string;

  /** Equals false when in the frameloop */
  idle = true;

  /** The function that maps inputs values to output */
  readonly calc: InterpolatorFn<Input, Output>;

  /** The inputs which are currently animating */
  protected _active = new Set<FluidValue>();

  constructor(
    /** The source of input values */
    readonly source: unknown,
    args: InterpolatorArgs<Input, Output>
  ) {
    super();
    this.calc = createInterpolator(...args);

    const value = this._get();
    const nodeType = getAnimatedType(value);

    // Assume the computed value never changes type.
    setAnimated(this, nodeType.create(value));
  }

  advance(_dt?: number) {
    const value = this._get();
    const oldValue = this.get();
    if (!isEqual(value, oldValue)) {
      getAnimated(this)!.setValue(value);
      this._onChange(value, this.idle);
    }
    // Become idle when all parents are idle or paused.
    if (!this.idle && checkIdle(this._active)) {
      becomeIdle(this);
    }
  }

  protected _get() {
    const inputs: Arrify<Input> = is.arr(this.source)
      ? this.source.map(getFluidValue)
      : (toArray(getFluidValue(this.source)) as any);

    return this.calc(...inputs);
  }

  protected _start() {
    if (this.idle && !checkIdle(this._active)) {
      this.idle = false;

      each(getPayload(this)!, (node) => {
        node.done = false;
      });

      if (G_skipAnimation) {
        raf.batchedUpdates(() => this.advance());
        becomeIdle(this);
      } else {
        frameLoop.start(this);
      }
    }
  }

  // Observe our sources only when we're observed.
  protected _attach() {
    let priority = 1;
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        addFluidObserver(source, this);
      }
      if (isFrameValue(source)) {
        if (!source.idle) {
          this._active.add(source);
        }
        priority = Math.max(priority, source.priority + 1);
      }
    });
    this.priority = priority;
    this._start();
  }

  // Stop observing our sources once we have no observers.
  protected _detach() {
    each(toArray(this.source), (source) => {
      if (hasFluidValue(source)) {
        removeFluidObserver(source, this);
      }
    });
    this._active.clear();
    becomeIdle(this);
  }

  /** @internal */
  eventObserved(event: FrameValue.Event) {
    // Update our value when an idle parent is changed,
    // and enter the frameloop when a parent is resumed.
    if (event.type == "change") {
      if (event.idle) {
        this.advance();
      } else {
        this._active.add(event.parent);
        this._start();
      }
    }
    // Once all parents are idle, the `advance` method runs one more time,
    // so we should avoid updating the `idle` status here.
    else if (event.type == "idle") {
      this._active.delete(event.parent);
    }
    // Ensure our priority is greater than all parents, which means
    // our value won't be updated until our parents have updated.
    else if (event.type == "priority") {
      this.priority = toArray(this.source).reduce(
        (highest: number, parent) =>
          Math.max(highest, (isFrameValue(parent) ? parent.priority : 0) + 1),
        0
      );
    }
  }
}

/** Returns true for an idle source. */
function isIdle(source: any) {
  return source.idle !== false;
}

/** Return true if all values in the given set are idle or paused. */
function checkIdle(active: Set<FluidValue>) {
  // Parents can be active even when paused, so the `.every` check
  // removes us from the frameloop if all active parents are paused.
  return !active.size || Array.from(active).every(isIdle);
}

/** Become idle if not already idle. */
function becomeIdle(self: Interpolation) {
  if (!self.idle) {
    self.idle = true;

    each(getPayload(self)!, (node) => {
      node.done = true;
    });

    callFluidObservers(self, {
      type: "idle",
      parent: self,
    });
  }
}

/**
 * Extract any properties whose keys are *not* reserved for customizing your
 * animations. All hooks use this function, which means `useTransition` props
 * are reserved for `useSpring` calls, etc.
 */
function getForwardProps<Props extends ReservedProps>(
  props: Props
): ForwardProps<Props> | undefined {
  const forward: any = {};

  let count = 0;
  eachProp(props, (value, prop) => {
    if (!RESERVED_PROPS[prop]) {
      forward[prop] = value;
      count++;
    }
  });

  if (count) {
    return forward;
  }
}

/**
 * Move all non-reserved props into the `to` prop.
 */
type InferTo<T extends object> = Merge<
  { to: ForwardProps<T> },
  Pick<T, keyof T & keyof ReservedProps>
>;

/**
 * Clone the given `props` and move all non-reserved props
 * into the `to` prop.
 */
function inferTo<T extends object>(props: T): InferTo<T> {
  const to = getForwardProps(props);
  if (to) {
    const out: any = { to };
    eachProp(props, (val, key) => key in to || (out[key] = val));
    return out;
  }
  return { ...props } as any;
}

// Compute the goal value, converting "red" to "rgba(255, 0, 0, 1)" in the process
function computeGoal<T>(value: T | FluidValue<T>): T {
  value = getFluidValue(value);
  return is.arr(value)
    ? value.map(computeGoal)
    : isAnimatedString(value)
    ? (G_createStringInterpolator({
        range: [0, 1],
        output: [value, value] as any,
      })(1) as any)
    : value;
}

function hasProps(props: object) {
  for (const _ in props) return true;
  return false;
}

/** Detach `ctrl` from `ctrl.ref` and (optionally) the given `ref` */
function detachRefs(ctrl: Controller, ref?: SpringRef) {
  ctrl.ref?.delete(ctrl);
  ref?.delete(ctrl);
}

/** Replace `ctrl.ref` with the given `ref` (if defined) */
function replaceRef(ctrl: Controller, ref?: SpringRef) {
  if (ref && ctrl.ref !== ref) {
    ctrl.ref?.delete(ctrl);
    ref.add(ctrl);
    ctrl.ref = ref;
  }
}

/** @internal */
interface AnimationTarget<T = any> extends Readable<T> {
  start(props: any): AsyncResult<this>;
  stop: Function;
  item?: unknown;
}

/** The flush function that handles `start` calls */
type ControllerFlushFn<T extends Controller<any> = Controller> = (
  ctrl: T,
  queue: ControllerQueue<InferState<T>>
) => AsyncResult<T>;

/** A serial queue of spring updates. */
interface SpringChain<T = any>
  extends Array<
    [T] extends [IsPlainObject<T>]
      ? ControllerUpdate<T>
      : SpringTo<T> | SpringUpdate<T>
  > {}

/** A value that any `SpringValue` or `Controller` can animate to. */
type SpringTo<T = any> =
  | ([T] extends [IsPlainObject<T>] ? never : T | FluidValue<T>)
  | SpringChain<T>
  | SpringToFn<T>
  | Falsy;

type AsyncTo<T> = SpringChain<T> | SpringToFn<T>;

/** @internal */
type RunAsyncProps<T extends AnimationTarget = any> = InferProps<T> & {
  callId: number;
  parentId?: number;
  cancel: boolean;
  to?: any;
};

/** @internal */
interface RunAsyncState<T extends AnimationTarget = any> {
  paused: boolean;
  pauseQueue: Set<() => void>;
  resumeQueue: Set<() => void>;
  timeouts: Set<Timeout>;
  delayed?: boolean;
  asyncId?: number;
  asyncTo?: AsyncTo<InferState<T>>;
  promise?: AsyncResult<T>;
  cancelId?: number;
}

/** Get the default value being set for the given `key` */
const getDefaultProp = <T extends Lookup, P extends keyof T>(
  props: T,
  key: P
): T[P] =>
  props.default === true
    ? props[key]
    : props.default
    ? props.default[key]
    : undefined;

const noopTransform = (value: any) => value;

function callProp<T>(
  value: T,
  ...args: T extends AnyFn ? Parameters<T> : unknown[]
): T extends AnyFn<any, infer U> ? U : T {
  return is.fun(value) ? value(...args) : value;
}

/** Try to coerce the given value into a boolean using the given key */
const matchProp = (
  value: boolean | OneOrMore<string> | ((key: any) => boolean) | undefined,
  key: string | undefined
) =>
  value === true ||
  !!(
    key &&
    value &&
    (is.fun(value) ? value(key) : toArray(value).includes(key))
  );

const resolveProp = <T>(
  prop: T | Lookup<T> | undefined,
  key: string | undefined
) => (is.obj(prop) ? key && (prop as any)[key] : prop);

/**
 * Extract the default props from an update.
 *
 * When the `default` prop is falsy, this function still behaves as if
 * `default: true` was used. The `default` prop is always respected when
 * truthy.
 */
const getDefaultProps = <T extends Lookup>(
  props: Lookup,
  transform: (value: any, key: string) => any = noopTransform
): T => {
  let keys: readonly string[] = DEFAULT_PROPS;
  if (props.default && props.default !== true) {
    props = props.default;
    keys = Object.keys(props);
  }
  const defaults: any = {};
  for (const key of keys) {
    const value = transform(props[key], key);
    if (!is.und(value)) {
      defaults[key] = value;
    }
  }
  return defaults;
};

/**
 * Start an async chain or an async script.
 *
 * Always call `runAsync` in the action callback of a `scheduleProps` call.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
function runAsync<T extends AnimationTarget>(
  to: AsyncTo<InferState<T>>,
  props: RunAsyncProps<T>,
  state: RunAsyncState<T>,
  target: T
): AsyncResult<T> {
  const { callId, parentId, onRest } = props;
  const { asyncTo: prevTo, promise: prevPromise } = state;

  if (!parentId && to === prevTo && !props.reset) {
    return prevPromise!;
  }

  return (state.promise = (async () => {
    state.asyncId = callId;
    state.asyncTo = to;

    // The default props of any `animate` calls.
    const defaultProps = getDefaultProps<InferProps<T>>(props, (value, key) =>
      // The `onRest` prop is only called when the `runAsync` promise is resolved.
      key === "onRest" ? undefined : value
    );

    let preventBail!: () => void;
    let bail: (error: any) => void;

    // This promise is rejected when the animation is interrupted.
    const bailPromise = new Promise<void>(
      (resolve, reject) => ((preventBail = resolve), (bail = reject))
    );

    const bailIfEnded = (bailSignal: BailSignal) => {
      const bailResult =
        // The `cancel` prop or `stop` method was used.
        (callId <= (state.cancelId || 0) && getCancelledResult(target)) ||
        // The async `to` prop was replaced.
        (callId !== state.asyncId && getFinishedResult(target, false));

      if (bailResult) {
        bailSignal.result = bailResult;

        // Reject the `bailPromise` to ensure the `runAsync` promise
        // is not relying on the caller to rethrow the error for us.
        bail(bailSignal);
        throw bailSignal;
      }
    };

    const animate: any = (arg1: any, arg2?: any) => {
      // Create the bail signal outside the returned promise,
      // so the generated stack trace is relevant.
      const bailSignal = new BailSignal();
      const skipAnimationSignal = new SkipAniamtionSignal();

      return (async () => {
        if (G_skipAnimation) {
          /**
           * We need to stop animations if `skipAnimation`
           * is set in the Globals
           *
           */
          stopAsync(state);

          // create the rejection error that's handled gracefully
          skipAnimationSignal.result = getFinishedResult(target, false);
          bail(skipAnimationSignal);
          throw skipAnimationSignal;
        }

        bailIfEnded(bailSignal);

        const props: any = is.obj(arg1) ? { ...arg1 } : { ...arg2, to: arg1 };
        props.parentId = callId;

        eachProp(defaultProps, (value, key) => {
          if (is.und(props[key])) {
            props[key] = value;
          }
        });

        const result = await target.start(props);
        bailIfEnded(bailSignal);

        if (state.paused) {
          await new Promise<void>((resume) => {
            state.resumeQueue.add(resume);
          });
        }

        return result;
      })();
    };

    let result!: AnimationResult<T>;

    if (G_skipAnimation) {
      /**
       * We need to stop animations if `skipAnimation`
       * is set in the Globals
       */
      stopAsync(state);
      return getFinishedResult(target, false);
    }

    try {
      let animating!: Promise<void>;

      // Async sequence
      if (is.arr(to)) {
        animating = (async (queue: any[]) => {
          for (const props of queue) {
            await animate(props);
          }
        })(to);
      }

      // Async script
      else {
        animating = Promise.resolve(to(animate, target.stop.bind(target)));
      }

      await Promise.all([animating.then(preventBail), bailPromise]);
      result = getFinishedResult(target.get(), true, false);

      // Bail handling
    } catch (err) {
      if (err instanceof BailSignal) {
        result = err.result;
      } else if (err instanceof SkipAniamtionSignal) {
        result = err.result;
      } else {
        throw err;
      }

      // Reset the async state.
    } finally {
      if (callId == state.asyncId) {
        state.asyncId = parentId;
        state.asyncTo = parentId ? prevTo : undefined;
        state.promise = parentId ? prevPromise : undefined;
      }
    }

    if (is.fun(onRest)) {
      raf.batchedUpdates(() => {
        onRest(result, target, target.item);
      });
    }

    return result;
  })());
}

/** Stop the current `runAsync` call with `finished: false` (or with `cancelled: true` when `cancelId` is defined) */
function stopAsync(state: RunAsyncState, cancelId?: number | Falsy) {
  flush(state.timeouts, (t) => t.cancel());
  state.pauseQueue.clear();
  state.resumeQueue.clear();
  state.asyncId = state.asyncTo = state.promise = undefined;
  if (cancelId) state.cancelId = cancelId;
}

/** This error is thrown to signal an interrupted async animation. */
class BailSignal extends Error {
  result!: AnimationResult;
  constructor() {
    super(
      "An async animation has been interrupted. You see this error because you " +
        "forgot to use `await` or `.catch(...)` on its returned promise."
    );
  }
}

class SkipAniamtionSignal extends Error {
  result!: AnimationResult;

  constructor() {
    super("SkipAnimationSignal");
  }
}

/** Events batched by the `Controller` class */
const BATCHED_EVENTS = ["onStart", "onChange", "onRest"] as const;

let nextIdCtrl = 1;

/** Queue of pending updates for a `Controller` instance. */
interface ControllerQueue<State extends Lookup = Lookup>
  extends Array<
    ControllerUpdate<State, any> & {
      /** The keys affected by this update. When null, all keys are affected. */
      keys: string[] | null;
    }
  > {}

class Controller<State extends Lookup = Lookup> {
  readonly id = nextIdCtrl++;

  /** The animated values */
  springs: SpringValues<State> = {} as any;

  /** The queue of props passed to the `update` method. */
  queue: ControllerQueue<State> = [];

  /**
   * The injected ref. When defined, render-based updates are pushed
   * onto the `queue` instead of being auto-started.
   */
  ref?: SpringRef<State>;

  /** Custom handler for flushing update queues */
  protected _flush?: ControllerFlushFn<this>;

  /** These props are used by all future spring values */
  protected _initialProps?: Lookup;

  /** The counter for tracking `scheduleProps` calls */
  protected _lastAsyncId = 0;

  /** The values currently being animated */
  protected _active = new Set<FrameValue>();

  /** The values that changed recently */
  protected _changed = new Set<FrameValue>();

  /** Equals false when `onStart` listeners can be called */
  protected _started = false;

  private _item?: any;

  /** State used by the `runAsync` function */
  protected _state: RunAsyncState<this> = {
    paused: false,
    pauseQueue: new Set(),
    resumeQueue: new Set(),
    timeouts: new Set(),
  };

  /** The event queues that are flushed once per frame maximum */
  protected _events = {
    onStart: new Map<
      OnStart<SpringValue<State>, Controller<State>, any>,
      AnimationResult
    >(),
    onChange: new Map<
      OnChange<SpringValue<State>, Controller<State>, any>,
      AnimationResult
    >(),
    onRest: new Map<
      OnRest<SpringValue<State>, Controller<State>, any>,
      AnimationResult
    >(),
  };

  constructor(
    props?: ControllerUpdate<State> | null,
    flush?: ControllerFlushFn<any>
  ) {
    this._onFrame = this._onFrame.bind(this);
    if (flush) {
      this._flush = flush;
    }
    if (props) {
      this.start({ default: true, ...props });
    }
  }

  /**
   * Equals `true` when no spring values are in the frameloop, and
   * no async animation is currently active.
   */
  get idle() {
    return (
      !this._state.asyncTo &&
      Object.values(this.springs as Lookup<SpringValue>).every((spring) => {
        return spring.idle && !spring.isDelayed && !spring.isPaused;
      })
    );
  }

  get item() {
    return this._item;
  }

  set item(item) {
    this._item = item;
  }

  /** Get the current values of our springs */
  get(): State & UnknownProps {
    const values: any = {};
    this.each((spring, key) => (values[key] = spring.get()));
    return values;
  }

  /** Set the current values without animating. */
  set(values: Partial<State>) {
    for (const key in values) {
      const value = values[key];
      if (!is.und(value)) {
        this.springs[key].set(value);
      }
    }
  }

  /** Push an update onto the queue of each value. */
  update(props: ControllerUpdate<State> | Falsy) {
    if (props) {
      this.queue.push(createUpdate(props));
    }
    return this;
  }

  /**
   * Start the queued animations for every spring, and resolve the returned
   * promise once all queued animations have finished or been cancelled.
   *
   * When you pass a queue (instead of nothing), that queue is used instead of
   * the queued animations added with the `update` method, which are left alone.
   */
  start(props?: OneOrMore<ControllerUpdate<State>> | null): AsyncResult<this> {
    let { queue } = this as any;
    if (props) {
      queue = toArray<any>(props).map(createUpdate);
    } else {
      this.queue = [];
    }

    if (this._flush) {
      return this._flush(this, queue);
    }

    prepareKeys(this, queue);
    return flushUpdateQueue(this, queue);
  }

  /** Stop all animations. */
  stop(): this;
  /** Stop animations for the given keys. */
  stop(keys: OneOrMore<string>): this;
  /** Cancel all animations. */
  stop(cancel: boolean): this;
  /** Cancel animations for the given keys. */
  stop(cancel: boolean, keys: OneOrMore<string>): this;
  /** Stop some or all animations. */
  stop(keys?: OneOrMore<string>): this;
  /** Cancel some or all animations. */
  stop(cancel: boolean, keys?: OneOrMore<string>): this;
  /** @internal */
  stop(arg?: boolean | OneOrMore<string>, keys?: OneOrMore<string>) {
    if (arg !== !!arg) {
      keys = arg as OneOrMore<string>;
    }
    if (keys) {
      const springs = this.springs as Lookup<SpringValue>;
      each(toArray(keys) as string[], (key) => springs[key].stop(!!arg));
    } else {
      stopAsync(this._state, this._lastAsyncId);
      this.each((spring) => spring.stop(!!arg));
    }
    return this;
  }

  /** Freeze the active animation in time */
  pause(keys?: OneOrMore<string>) {
    if (is.und(keys)) {
      this.start({ pause: true });
    } else {
      const springs = this.springs as Lookup<SpringValue>;
      each(toArray(keys) as string[], (key) => springs[key].pause());
    }
    return this;
  }

  /** Resume the animation if paused. */
  resume(keys?: OneOrMore<string>) {
    if (is.und(keys)) {
      this.start({ pause: false });
    } else {
      const springs = this.springs as Lookup<SpringValue>;
      each(toArray(keys) as string[], (key) => springs[key].resume());
    }
    return this;
  }

  /** Call a function once per spring value */
  each(iterator: (spring: SpringValue, key: string) => void) {
    eachProp(this.springs, iterator as any);
  }

  /** @internal Called at the end of every animation frame */
  protected _onFrame() {
    const { onStart, onChange, onRest } = this._events;

    const active = this._active.size > 0;
    const changed = this._changed.size > 0;

    if ((active && !this._started) || (changed && !this._started)) {
      this._started = true;
      flush(onStart, ([onStart, result]) => {
        result.value = this.get();
        onStart(result, this, this._item);
      });
    }

    const idle = !active && this._started;
    const values = changed || (idle && onRest.size) ? this.get() : null;

    if (changed && onChange.size) {
      flush(onChange, ([onChange, result]) => {
        result.value = values;
        onChange(result, this, this._item);
      });
    }

    // The "onRest" queue is only flushed when all springs are idle.
    if (idle) {
      this._started = false;
      flush(onRest, ([onRest, result]) => {
        result.value = values;
        onRest(result, this, this._item);
      });
    }
  }

  /** @internal */
  eventObserved(event: FrameValue.Event) {
    if (event.type == "change") {
      this._changed.add(event.parent);
      if (!event.idle) {
        this._active.add(event.parent);
      }
    } else if (event.type == "idle") {
      this._active.delete(event.parent);
    }
    // The `onFrame` handler runs when a parent is changed or idle.
    else return;
    raf.onFrame(this._onFrame);
  }
}

/**
 * Warning: Props might be mutated.
 */
function flushUpdateQueue(ctrl: Controller<any>, queue: ControllerQueue) {
  return Promise.all(queue.map((props) => flushUpdate(ctrl, props))).then(
    (results) => getCombinedResult(ctrl, results)
  );
}

/**
 * Warning: Props might be mutated.
 *
 * Process a single set of props using the given controller.
 *
 * The returned promise resolves to `true` once the update is
 * applied and any animations it starts are finished without being
 * stopped or cancelled.
 */
async function flushUpdate(
  ctrl: Controller<any>,
  props: ControllerQueue[number],
  isLoop?: boolean
): AsyncResult {
  const { keys, to, from, loop, onRest, onResolve } = props;
  const defaults = is.obj(props.default) && props.default;

  // Looping must be handled in this function, or else the values
  // would end up looping out-of-sync in many common cases.
  if (loop) {
    props.loop = false;
  }

  // Treat false like null, which gets ignored.
  if (to === false) props.to = null;
  if (from === false) props.from = null;

  const asyncTo = is.arr(to) || is.fun(to) ? to : undefined;
  if (asyncTo) {
    props.to = undefined;
    props.onRest = undefined;
    if (defaults) {
      defaults.onRest = undefined;
    }
  }
  // For certain events, use batching to prevent multiple calls per frame.
  // However, batching is avoided when the `to` prop is async, because any
  // event props are used as default props instead.
  else {
    each(BATCHED_EVENTS, (key) => {
      const handler: any = props[key];
      if (is.fun(handler)) {
        const queue = ctrl["_events"][key];
        props[key] = (({ finished, cancelled }: AnimationResult) => {
          const result = queue.get(handler);
          if (result) {
            if (!finished) result.finished = false;
            if (cancelled) result.cancelled = true;
          } else {
            // The "value" is set before the "handler" is called.
            queue.set(handler, {
              value: null,
              finished: finished || false,
              cancelled: cancelled || false,
            });
          }
        }) as any;

        // Avoid using a batched `handler` as a default prop.
        if (defaults) {
          defaults[key] = props[key] as any;
        }
      }
    });
  }

  const state = ctrl["_state"];

  // Pause/resume the `asyncTo` when `props.pause` is true/false.
  if (props.pause === !state.paused) {
    state.paused = props.pause;
    flushCalls(props.pause ? state.pauseQueue : state.resumeQueue);
  }
  // When a controller is paused, its values are also paused.
  else if (state.paused) {
    props.pause = true;
  }

  const promises: AsyncResult[] = (keys || Object.keys(ctrl.springs)).map(
    (key: any) => ctrl.springs[key]!.start(props as any)
  );

  const cancel =
    props.cancel === true || getDefaultProp(props, "cancel") === true;

  if (asyncTo || (cancel && state.asyncId)) {
    promises.push(
      scheduleProps(++ctrl["_lastAsyncId"], {
        props,
        state,
        actions: {
          pause: noop,
          resume: noop,
          start(props, resolve) {
            if (cancel) {
              stopAsync(state, ctrl["_lastAsyncId"]);
              resolve(getCancelledResult(ctrl));
            } else {
              props.onRest = onRest;
              resolve(
                runAsync(
                  asyncTo as SpringChain | SpringToFn,
                  props,
                  state,
                  ctrl
                )
              );
            }
          },
        },
      })
    );
  }

  // Pause after updating each spring, so they can be resumed separately
  // and so their default `pause` and `cancel` props are updated.
  if (state.paused) {
    // Ensure `this` must be resumed before the returned promise
    // is resolved and before starting the next `loop` repetition.
    await new Promise<void>((resume) => {
      state.resumeQueue.add(resume);
    });
  }

  const result = getCombinedResult<any>(ctrl, await Promise.all(promises));
  if (loop && result.finished && !(isLoop && result.noop)) {
    const nextProps = createLoopUpdate(props, loop, to);
    if (nextProps) {
      prepareKeys(ctrl, [nextProps]);
      return flushUpdate(ctrl, nextProps, true);
    }
  }
  if (onResolve) {
    raf.batchedUpdates(() => onResolve(result, ctrl, ctrl.item));
  }
  return result;
}

// The `scheduleProps` function only handles these defaults.
type DefaultProps<T> = { cancel?: MatchProp<T>; pause?: MatchProp<T> };

interface ScheduledProps<T extends AnimationTarget> {
  key?: string;
  props: InferProps<T>;
  defaultProps?: DefaultProps<InferState<T>>;
  state: RunAsyncState<T>;
  actions: {
    pause: () => void;
    resume: () => void;
    start: (props: RunAsyncProps<T>, resolve: AnimationResolver<T>) => void;
  };
}

/**
 * This function sets a timeout if both the `delay` prop exists and
 * the `cancel` prop is not `true`.
 *
 * The `actions.start` function must handle the `cancel` prop itself,
 * but the `pause` prop is taken care of.
 */
function scheduleProps<T extends AnimationTarget>(
  callId: number,
  { key, props, defaultProps, state, actions }: ScheduledProps<T>
): AsyncResult<T> {
  return new Promise((resolve, reject) => {
    let delay: number;
    let timeout: Timeout;

    let cancel = matchProp(props.cancel ?? defaultProps?.cancel, key);
    if (cancel) {
      onStart();
    } else {
      // The `pause` prop updates the paused flag.
      if (!is.und(props.pause)) {
        state.paused = matchProp(props.pause, key);
      }
      // The default `pause` takes precedence when true,
      // which allows `SpringContext` to work as expected.
      let pause = defaultProps?.pause;
      if (pause !== true) {
        pause = state.paused || matchProp(pause, key);
      }

      delay = callProp(props.delay || 0, key);
      if (pause) {
        state.resumeQueue.add(onResume);
        actions.pause();
      } else {
        actions.resume();
        onResume();
      }
    }

    function onPause() {
      state.resumeQueue.add(onResume);
      state.timeouts.delete(timeout);
      timeout.cancel();
      // Cache the remaining delay.
      delay = timeout.time - raf.now();
    }

    function onResume() {
      if (delay > 0 && !G_skipAnimation) {
        state.delayed = true;
        timeout = raf.setTimeout(onStart, delay);
        state.pauseQueue.add(onPause);
        state.timeouts.add(timeout);
      } else {
        onStart();
      }
    }

    function onStart() {
      if (state.delayed) {
        state.delayed = false;
      }

      state.pauseQueue.delete(onPause);
      state.timeouts.delete(timeout);

      // Maybe cancelled during its delay.
      if (callId <= (state.cancelId || 0)) {
        cancel = true;
      }

      try {
        actions.start({ ...props, callId, cancel }, resolve);
      } catch (err) {
        reject(err);
      }
    }
  });
}

/**
 * From an array of updates, get the map of `SpringValue` objects
 * by their keys. Springs are created when any update wants to
 * animate a new key.
 *
 * Springs created by `getSprings` are neither cached nor observed
 * until they're given to `setSprings`.
 */
function getSprings<State extends Lookup>(
  ctrl: Controller<Lookup<any>>,
  props?: OneOrMore<ControllerUpdate<State>>
) {
  const springs = { ...ctrl.springs };
  if (props) {
    each(toArray(props), (props: any) => {
      if (is.und(props.keys)) {
        props = createUpdate(props);
      }
      if (!is.obj(props.to)) {
        // Avoid passing array/function to each spring.
        props = { ...props, to: undefined };
      }
      prepareSprings(springs as any, props, (key) => {
        return createSpring(key);
      });
    });
  }
  setSprings(ctrl, springs);
  return springs;
}

/**
 * Tell a controller to manage the given `SpringValue` objects
 * whose key is not already in use.
 */
function setSprings(
  ctrl: Controller<Lookup<any>>,
  springs: SpringValues<UnknownProps>
) {
  eachProp(springs, (spring, key) => {
    if (!ctrl.springs[key]) {
      ctrl.springs[key] = spring;
      addFluidObserver(spring, ctrl);
    }
  });
}

function createSpring(key: string, observer?: FluidObserver<FrameValue.Event>) {
  const spring = new SpringValue();
  spring.key = key;
  if (observer) {
    addFluidObserver(spring, observer);
  }
  return spring;
}

/**
 * Ensure spring objects exist for each defined key.
 *
 * Using the `props`, the `Animated` node of each `SpringValue` may
 * be created or updated.
 */
function prepareSprings(
  springs: SpringValues,
  props: ControllerQueue[number],
  create: (key: string) => SpringValue
) {
  if (props.keys) {
    each(props.keys, (key: string) => {
      const spring = springs[key] || (springs[key] = create(key));
      spring["_prepareNode"](props);
    });
  }
}

/**
 * Ensure spring objects exist for each defined key, and attach the
 * `ctrl` to them for observation.
 *
 * The queue is expected to contain `createUpdate` results.
 */
function prepareKeys(ctrl: Controller<any>, queue: ControllerQueue[number][]) {
  each(queue, (props) => {
    prepareSprings(ctrl.springs, props, (key) => {
      return createSpring(key, ctrl);
    });
  });
}

/**
 * The props of a `useSpring` call or its async `update` function.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
type SpringUpdate<T = any> = ToProps<T> & SpringProps<T>;

/**
 * An async function that can update or stop the animations of a spring.
 * Typically defined as the `to` prop.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
interface SpringToFn<T = any> {
  (start: StartFn<T>, stop: StopFn<T>): Promise<any> | void;
}

/** @internal */
type InferTarget<T> = T extends object
  ? T extends ReadonlyArray<number | string>
    ? SpringValue<T>
    : Controller<T>
  : SpringValue<T>;

type StartFn<T> = InferTarget<T> extends { start: infer T } ? T : never;
type StopFn<T> = InferTarget<T> extends { stop: infer T } ? T : never;

/** @internal */
interface Readable<T = any> {
  get(): T;
}

/** @internal */
type InferState<T extends Readable> = T extends Controller<infer State>
  ? State
  : T extends SpringValue<infer U>
  ? U
  : unknown;

/** @internal */
type InferProps<T extends Readable> = T extends Controller<infer State>
  ? ControllerUpdate<State>
  : T extends SpringValue<infer U>
  ? SpringUpdate<U>
  : Lookup;

type EventHandler<
  TResult extends Readable = any,
  TSource = unknown,
  Item = undefined
> = Item extends undefined
  ? (result: AnimationResult<TResult>, ctrl: TSource, item?: Item) => void
  : (result: AnimationResult<TResult>, ctrl: TSource, item: Item) => void;

/**
 * Called before the first frame of every animation.
 * From inside the `requestAnimationFrame` callback.
 */
type OnStart<
  TResult extends Readable,
  TSource,
  Item = undefined
> = EventHandler<TResult, TSource, Item>;

/** Called when a `SpringValue` changes */
type OnChange<
  TResult extends Readable,
  TSource,
  Item = undefined
> = EventHandler<TResult, TSource, Item>;

type OnPause<
  TResult extends Readable,
  TSource,
  Item = undefined
> = EventHandler<TResult, TSource, Item>;

type OnResume<
  TResult extends Readable,
  TSource,
  Item = undefined
> = EventHandler<TResult, TSource, Item>;

/** Called once the animation comes to a halt */
type OnRest<TResult extends Readable, TSource, Item = undefined> = EventHandler<
  TResult,
  TSource,
  Item
>;

type OnResolve<
  TResult extends Readable,
  TSource,
  Item = undefined
> = EventHandler<TResult, TSource, Item>;

/**
 * Called after an animation is updated by new props,
 * even if the animation remains idle.
 */
type OnProps<T = unknown> = (
  props: Readonly<SpringProps<T>>,
  spring: SpringValue<T>
) => void;

/** @internal */
const getCombinedResult = <T extends Readable>(
  target: T,
  results: AnimationResult<T>[]
): AnimationResult<T> =>
  results.length == 1
    ? results[0]
    : results.some((result) => result.cancelled)
    ? getCancelledResult(target.get())
    : results.every((result) => result.noop)
    ? getNoopResult(target.get())
    : getFinishedResult(
        target.get(),
        results.every((result) => result.finished)
      );

/** No-op results are for updates that never start an animation. */
const getNoopResult = (value: any) => ({
  value,
  noop: true,
  finished: true,
  cancelled: false,
});

const getFinishedResult = (
  value: any,
  finished: boolean,
  cancelled: boolean = false
) => ({
  value,
  finished,
  cancelled,
});

const getCancelledResult = (value: any) => ({
  value,
  cancelled: true,
  finished: false,
});

/**
 * Use the `SpringUpdate` type if you need the `to` prop to exist.
 * For function types, prefer one overload per possible `to` prop
 * type (for better type inference).
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
interface SpringProps<T = any> extends AnimationProps<T> {
  from?: GoalValue<T>;
  // FIXME: Use "SpringUpdate<T>" once type recursion is good enough.
  loop?: LoopProp<SpringUpdate>;
  /**
   * Called after an animation is updated by new props,
   * even if the animation remains idle.
   */
  onProps?: EventProp<OnProps<T>>;
  /**
   * Called when an animation moves for the first time.
   */
  onStart?: EventProp<OnStart<SpringValue<T>, SpringValue<T>>>;
  /**
   * Called when a spring has its value changed.
   */
  onChange?: EventProp<OnChange<SpringValue<T>, SpringValue<T>>>;
  onPause?: EventProp<OnPause<SpringValue<T>, SpringValue<T>>>;
  onResume?: EventProp<OnResume<SpringValue<T>, SpringValue<T>>>;
  /**
   * Called when all animations come to a stand-still.
   */
  onRest?: EventProp<OnRest<SpringValue<T>, SpringValue<T>>>;
}

/**
 * A union type of all possible `to` prop values.
 *
 * This is not recommended for function types. Instead, you should declare
 * an overload for each `to` type. See `SpringUpdateFn` for an example.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
type ToProps<T = any> =
  | { to?: GoalProp<T> | SpringToFn<T> | SpringChain<T> }
  | ([T] extends [IsPlainObject<T>] ? InlineToProps<T> : never);

/**
 * A value or set of values that can be animated from/to.
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
type GoalProp<T> = [T] extends [IsPlainObject<T>]
  ? GoalValues<T> | Falsy
  : GoalValue<T>;

/** A set of values for a `Controller` to animate from/to. */
type GoalValues<T> = FluidProps<T> extends infer Props
  ? { [P in keyof Props]?: Props[P] | null }
  : never;

/**
 * A value that `SpringValue` objects can animate from/to.
 *
 * The `UnknownProps` type lets you pass in { a: 1 } if the `key`
 * property of `SpringValue` equals "a".
 */
type GoalValue<T> = T | FluidValue<T> | UnknownProps | null | undefined;

/**
 * Where `to` is inferred from non-reserved props
 *
 * The `T` parameter can be a set of animated values (as an object type)
 * or a primitive type for a single animated value.
 */
type InlineToProps<T = any> = Remap<GoalValues<T> & { to?: undefined }>;

/** @internal */
interface AnimationRange<T> {
  to: T | FluidValue<T> | undefined;
  from: T | FluidValue<T> | undefined;
}

/** @internal */
type AnimationResolver<T extends Readable> = (
  result: AnimationResult<T> | AsyncResult<T>
) => void;

/** @internal */
type EventKey = Exclude<keyof ReservedEventProps, "onResolve" | "onDestroyed">;

/** @internal */
type PickEventFns<T> = {
  [P in Extract<keyof T, EventKey>]?: Extract<T[P], Function>;
};

interface DefaultSpringProps<T>
  extends Pick<SpringProps<T>, "pause" | "cancel" | "immediate" | "config">,
    PickEventFns<SpringProps<T>> {}

const emptyArray: readonly any[] = [];

/** An animation being executed by the frameloop */
class Animation<T = any> {
  changed = false;
  values: readonly AnimatedValue[] = emptyArray;
  toValues: readonly number[] | null = null;
  fromValues: readonly number[] = emptyArray;

  to!: T | FluidValue<T>;
  from!: T | FluidValue<T>;
  config = new AnimationConfig();
  immediate = false;
}

interface Animation<T> extends PickEventFns<SpringProps<T>> {}

/**
 * Only numbers, strings, and arrays of numbers/strings are supported.
 * Non-animatable strings are also supported.
 */
class SpringValue<T = any> extends FrameValue<T> {
  /** The property name used when `to` or `from` is an object. Useful when debugging too. */
  key?: string;

  /** The animation state */
  animation = new Animation<T>();

  /** The queue of pending props */
  queue?: SpringUpdate<T>[];

  /** Some props have customizable default values */
  defaultProps: DefaultSpringProps<T> = {};

  /** The state for `runAsync` calls */
  protected _state: RunAsyncState<SpringValue<T>> = {
    paused: false,
    delayed: false,
    pauseQueue: new Set(),
    resumeQueue: new Set(),
    timeouts: new Set(),
  };

  /** The promise resolvers of pending `start` calls */
  protected _pendingCalls = new Set<AnimationResolver<this>>();

  /** The counter for tracking `scheduleProps` calls */
  protected _lastCallId = 0;

  /** The last `scheduleProps` call that changed the `to` prop */
  protected _lastToId = 0;

  protected _memoizedDuration = 0;

  constructor(from: Exclude<T, object>, props?: SpringUpdate<T>);
  constructor(props?: SpringUpdate<T>);
  constructor(arg1?: any, arg2?: any) {
    super();
    if (!is.und(arg1) || !is.und(arg2)) {
      const props = is.obj(arg1) ? { ...arg1 } : { ...arg2, from: arg1 };
      if (is.und(props.default)) {
        props.default = true;
      }
      this.start(props);
    }
  }

  /** Equals true when not advancing on each frame. */
  get idle() {
    return !(isAnimating(this) || this._state.asyncTo) || isPaused(this);
  }

  get goal() {
    // @ts-ignore
    return getFluidValue(this.animation.to) as T;
  }

  get velocity(): VelocityProp<T> {
    const node = getAnimated(this)!;
    return (
      node instanceof AnimatedValue
        ? node.lastVelocity || 0
        : node.getPayload().map((node) => node.lastVelocity || 0)
    ) as any;
  }

  /**
   * When true, this value has been animated at least once.
   */
  get hasAnimated() {
    return hasAnimated(this);
  }

  /**
   * When true, this value has an unfinished animation,
   * which is either active or paused.
   */
  get isAnimating() {
    return isAnimating(this);
  }

  /**
   * When true, all current and future animations are paused.
   */
  get isPaused() {
    return isPaused(this);
  }

  get isDelayed() {
    return this._state.delayed;
  }

  /** Advance the current animation by a number of milliseconds */
  advance(dt: number) {
    let idle = true;
    let changed = false;

    const anim = this.animation;
    let { config, toValues } = anim;

    const payload = getPayload(anim.to);
    if (!payload && hasFluidValue(anim.to)) {
      toValues = toArray(getFluidValue(anim.to)) as any;
    }

    anim.values.forEach((node, i) => {
      if (node.done) return;

      const to =
        // Animated strings always go from 0 to 1.
        node.constructor == AnimatedString
          ? 1
          : payload
          ? payload[i].lastPosition
          : toValues![i];

      let finished = anim.immediate;
      let position = to;

      if (!finished) {
        position = node.lastPosition;

        // Loose springs never move.
        if (config.tension <= 0) {
          node.done = true;
          return;
        }

        let elapsed = (node.elapsedTime += dt);
        const from = anim.fromValues[i];

        const v0 =
          node.v0 != null
            ? node.v0
            : (node.v0 = is.arr(config.velocity)
                ? config.velocity[i]
                : config.velocity);

        let velocity: number;

        /** The smallest distance from a value before being treated like said value. */
        /**
         * TODO: make this value ~0.0001 by default in next breaking change
         */
        const precision =
          config.precision ||
          (from == to ? 0.005 : Math.min(1, Math.abs(to - from) * 0.001));

        // Duration easing
        if (!is.und(config.duration)) {
          let p = 1;
          if (config.duration > 0) {
            /**
             * Here we check if the duration has changed in the config
             * and if so update the elapsed time to the percentage
             * of completition so there is no jank in the animation
             */
            if (this._memoizedDuration !== config.duration) {
              // update the memoized version to the new duration
              this._memoizedDuration = config.duration;

              // if the value has started animating we need to update it
              if (node.durationProgress > 0) {
                // set elapsed time to be the same percentage of progress as the previous duration
                node.elapsedTime = config.duration * node.durationProgress;
                // add the delta so the below updates work as expected
                elapsed = node.elapsedTime += dt;
              }
            }

            // calculate the new progress
            p = (config.progress || 0) + elapsed / this._memoizedDuration;
            // p is clamped between 0-1
            p = p > 1 ? 1 : p < 0 ? 0 : p;
            // store our new progress
            node.durationProgress = p;
          }

          position = from + config.easing(p) * (to - from);
          velocity = (position - node.lastPosition) / dt;

          finished = p == 1;
        }

        // Decay easing
        else if (config.decay) {
          const decay = config.decay === true ? 0.998 : config.decay;
          const e = Math.exp(-(1 - decay) * elapsed);

          position = from + (v0 / (1 - decay)) * (1 - e);
          finished = Math.abs(node.lastPosition - position) <= precision;

          // derivative of position
          velocity = v0 * e;
        }

        // Spring easing
        else {
          velocity = node.lastVelocity == null ? v0 : node.lastVelocity;

          /** The velocity at which movement is essentially none */
          const restVelocity = config.restVelocity || precision / 10;

          // Bouncing is opt-in (not to be confused with overshooting)
          const bounceFactor = config.clamp ? 0 : config.bounce!;
          const canBounce = !is.und(bounceFactor);

          /** When `true`, the value is increasing over time */
          const isGrowing = from == to ? node.v0 > 0 : from < to;

          /** When `true`, the velocity is considered moving */
          let isMoving!: boolean;

          /** When `true`, the velocity is being deflected or clamped */
          let isBouncing = false;

          const step = 1; // 1ms
          const numSteps = Math.ceil(dt / step);
          for (let n = 0; n < numSteps; ++n) {
            isMoving = Math.abs(velocity) > restVelocity;

            if (!isMoving) {
              finished = Math.abs(to - position) <= precision;
              if (finished) {
                break;
              }
            }

            if (canBounce) {
              isBouncing = position == to || position > to == isGrowing;

              // Invert the velocity with a magnitude, or clamp it.
              if (isBouncing) {
                velocity = -velocity * bounceFactor;
                position = to;
              }
            }

            const springForce = -config.tension * 0.000001 * (position - to);
            const dampingForce = -config.friction * 0.001 * velocity;
            const acceleration = (springForce + dampingForce) / config.mass; // pt/ms^2

            velocity = velocity + acceleration * step; // pt/ms
            position = position + velocity * step;
          }
        }

        node.lastVelocity = velocity;

        if (Number.isNaN(position)) {
          console.warn(`Got NaN while animating:`, this);
          finished = true;
        }
      }

      // Parent springs must finish before their children can.
      if (payload && !payload[i].done) {
        finished = false;
      }

      if (finished) {
        node.done = true;
      } else {
        idle = false;
      }

      if (node.setValue(position, config.round)) {
        changed = true;
      }
    });

    const node = getAnimated(this)!;
    /**
     * Get the node's current value, this will be different
     * to anim.to when config.decay is true
     */
    const currVal = node.getValue();
    if (idle) {
      // get our final fluid val from the anim.to
      const finalVal = getFluidValue(anim.to);
      /**
       * check if they're not equal, or if they're
       * change and if there's no config.decay set
       */
      if ((currVal !== finalVal || changed) && !config.decay) {
        // set the value to anim.to
        node.setValue(finalVal);
        this._onChange(finalVal);
      } else if (changed && config.decay) {
        /**
         * if it's changed but there is a config.decay,
         * just call _onChange with currrent value
         */
        this._onChange(currVal);
      }
      // call stop because the spring has stopped.
      this._stop();
    } else if (changed) {
      /**
       * if the spring has changed, but is not idle,
       * just call the _onChange handler
       */
      this._onChange(currVal);
    }
  }

  /** Set the current value, while stopping the current animation */
  set(value: T | FluidValue<T>) {
    raf.batchedUpdates(() => {
      this._stop();

      // These override the current value and goal value that may have
      // been updated by `onRest` handlers in the `_stop` call above.
      this._focus(value);
      this._set(value);
    });
    return this;
  }

  /**
   * Freeze the active animation in time, as well as any updates merged
   * before `resume` is called.
   */
  pause() {
    this._update({ pause: true });
  }

  /** Resume the animation if paused. */
  resume() {
    this._update({ pause: false });
  }

  /** Skip to the end of the current animation. */
  finish() {
    if (isAnimating(this)) {
      const { to, config } = this.animation;
      raf.batchedUpdates(() => {
        // Ensure the "onStart" and "onRest" props are called.
        this._onStart();

        // Jump to the goal value, except for decay animations
        // which have an undefined goal value.
        if (!config.decay) {
          this._set(to, false);
        }

        this._stop();
      });
    }
    return this;
  }

  /** Push props into the pending queue. */
  update(props: SpringUpdate<T>) {
    const queue = this.queue || (this.queue = []);
    queue.push(props);
    return this;
  }

  /**
   * Update this value's animation using the queue of pending props,
   * and unpause the current animation (if one is frozen).
   *
   * When arguments are passed, a new animation is created, and the
   * queued animations are left alone.
   */
  start(): AsyncResult<this>;

  start(props: SpringUpdate<T>): AsyncResult<this>;

  start(to: T, props?: SpringProps<T>): AsyncResult<this>;

  start(to?: any, arg2?: any) {
    let queue: SpringUpdate<T>[];
    if (!is.und(to)) {
      queue = [is.obj(to) ? to : { ...arg2, to }];
    } else {
      queue = this.queue || [];
      this.queue = [];
    }

    return Promise.all(
      queue.map((props) => {
        const up = this._update(props);
        return up;
      })
    ).then((results) => getCombinedResult(this, results));
  }

  /**
   * Stop the current animation, and cancel any delayed updates.
   *
   * Pass `true` to call `onRest` with `cancelled: true`.
   */
  stop(cancel?: boolean) {
    const { to } = this.animation;

    // The current value becomes the goal value.
    this._focus(this.get());

    stopAsync(this._state, cancel && this._lastCallId);
    raf.batchedUpdates(() => this._stop(to, cancel));

    return this;
  }

  /** Restart the animation. */
  reset() {
    this._update({ reset: true });
  }

  /** @internal */
  eventObserved(event: FrameValue.Event) {
    if (event.type == "change") {
      this._start();
    } else if (event.type == "priority") {
      this.priority = event.priority + 1;
    }
  }

  /**
   * Parse the `to` and `from` range from the given `props` object.
   *
   * This also ensures the initial value is available to animated components
   * during the render phase.
   */
  protected _prepareNode(props: {
    to?: any;
    from?: any;
    reverse?: boolean;
    default?: any;
  }) {
    const key = this.key || "";

    let { to, from } = props;

    to = is.obj(to) ? to[key] : to;
    if (to == null || isAsyncTo(to)) {
      to = undefined;
    }

    from = is.obj(from) ? from[key] : from;
    if (from == null) {
      from = undefined;
    }

    // Create the range now to avoid "reverse" logic.
    const range = { to, from };

    // Before ever animating, this method ensures an `Animated` node
    // exists and keeps its value in sync with the "from" prop.
    if (!hasAnimated(this)) {
      if (props.reverse) [to, from] = [from, to];

      from = getFluidValue(from);
      if (!is.und(from)) {
        this._set(from);
      }
      // Use the "to" value if our node is undefined.
      else if (!getAnimated(this)) {
        this._set(to);
      }
    }

    return range;
  }

  /** Every update is processed by this method before merging. */
  protected _update(
    { ...props }: SpringProps<T>,
    isLoop?: boolean
  ): AsyncResult<SpringValue<T>> {
    const { key, defaultProps } = this;

    // Update the default props immediately.
    if (props.default)
      Object.assign(
        defaultProps,
        getDefaultProps(props, (value, prop) =>
          /^on/.test(prop) ? resolveProp(value, key) : value
        )
      );

    mergeActiveFn(this, props, "onProps");
    sendEvent(this, "onProps", props, this);

    // Ensure the initial value can be accessed by animated components.
    const range = this._prepareNode(props);

    if (Object.isFrozen(this)) {
      throw Error(
        "Cannot animate a `SpringValue` object that is frozen. " +
          "Did you forget to pass your component to `animated(...)` before animating its props?"
      );
    }

    const state = this._state;

    return scheduleProps(++this._lastCallId, {
      key,
      props,
      defaultProps,
      state,
      actions: {
        pause: () => {
          if (!isPaused(this)) {
            setPausedBit(this, true);
            flushCalls(state.pauseQueue);
            sendEvent(
              this,
              "onPause",
              getFinishedResult(this, checkFinished(this, this.animation.to)),
              this
            );
          }
        },
        resume: () => {
          if (isPaused(this)) {
            setPausedBit(this, false);
            if (isAnimating(this)) {
              this._resume();
            }
            flushCalls(state.resumeQueue);
            sendEvent(
              this,
              "onResume",
              getFinishedResult(this, checkFinished(this, this.animation.to)),
              this
            );
          }
        },
        start: this._merge.bind(this, range),
      },
    }).then((result) => {
      if (props.loop && result.finished && !(isLoop && result.noop)) {
        const nextProps = createLoopUpdate(props);
        if (nextProps) {
          return this._update(nextProps, true);
        }
      }
      return result;
    });
  }

  /** Merge props into the current animation */
  protected _merge(
    range: AnimationRange<T>,
    props: RunAsyncProps<SpringValue<T>>,
    resolve: AnimationResolver<SpringValue<T>>
  ): void {
    // The "cancel" prop cancels all pending delays and it forces the
    // active animation to stop where it is.
    if (props.cancel) {
      this.stop(true);
      return resolve(getCancelledResult(this));
    }

    /** The "to" prop is defined. */
    const hasToProp = !is.und(range.to);

    /** The "from" prop is defined. */
    const hasFromProp = !is.und(range.from);

    // Avoid merging other props if implicitly prevented, except
    // when both the "to" and "from" props are undefined.
    if (hasToProp || hasFromProp) {
      if (props.callId > this._lastToId) {
        this._lastToId = props.callId;
      } else {
        return resolve(getCancelledResult(this));
      }
    }

    const { key, defaultProps, animation: anim } = this;
    const { to: prevTo, from: prevFrom } = anim;
    let { to = prevTo, from = prevFrom } = range;

    // Focus the "from" value if changing without a "to" value.
    // For default updates, do this only if no "to" value exists.
    if (hasFromProp && !hasToProp && (!props.default || is.und(to))) {
      to = from;
    }

    // Flip the current range if "reverse" is true.
    if (props.reverse) [to, from] = [from, to];

    /** The "from" value is changing. */
    const hasFromChanged = !isEqual(from, prevFrom);

    if (hasFromChanged) {
      anim.from = from;
    }

    // Coerce "from" into a static value.
    from = getFluidValue(from);

    /** The "to" value is changing. */
    const hasToChanged = !isEqual(to, prevTo);

    if (hasToChanged) {
      this._focus(to);
    }

    /** The "to" prop is async. */
    const hasAsyncTo = isAsyncTo(props.to);

    const { config } = anim;
    const { decay, velocity } = config;

    // Reset to default velocity when goal values are defined.
    if (hasToProp || hasFromProp) {
      config.velocity = 0;
    }

    // The "runAsync" function treats the "config" prop as a default,
    // so we must avoid merging it when the "to" prop is async.
    if (props.config && !hasAsyncTo) {
      mergeConfig(
        config,
        callProp(props.config, key!),
        // Avoid calling the same "config" prop twice.
        props.config !== defaultProps.config
          ? callProp(defaultProps.config, key!)
          : void 0
      );
    }

    // This instance might not have its Animated node yet. For example,
    // the constructor can be given props without a "to" or "from" value.
    let node = getAnimated(this);
    if (!node || is.und(to)) {
      return resolve(getFinishedResult(this, true));
    }

    /** When true, start at the "from" value. */
    const reset =
      // When `reset` is undefined, the `from` prop implies `reset: true`,
      // except for declarative updates. When `reset` is defined, there
      // must exist a value to animate from.
      is.und(props.reset)
        ? hasFromProp && !props.default
        : !is.und(from) && matchProp(props.reset, key);

    // The current value, where the animation starts from.
    const value = reset ? (from as T) : this.get();

    // The animation ends at this value, unless "to" is fluid.
    const goal = computeGoal<any>(to);

    // Only specific types can be animated to/from.
    const isAnimatable = is.num(goal) || is.arr(goal) || isAnimatedString(goal);

    // When true, the value changes instantly on the next frame.
    const immediate =
      !hasAsyncTo &&
      (!isAnimatable ||
        matchProp(defaultProps.immediate || props.immediate, key));

    if (hasToChanged) {
      const nodeType = getAnimatedType(to);
      if (nodeType !== node.constructor) {
        if (immediate) {
          node = this._set(goal)!;
        } else
          throw Error(
            `Cannot animate between ${node.constructor.name} and ${nodeType.name}, as the "to" prop suggests`
          );
      }
    }

    // The type of Animated node for the goal value.
    const goalType = node.constructor;

    // When the goal value is fluid, we don't know if its value
    // will change before the next animation frame, so it always
    // starts the animation to be safe.
    let started = hasFluidValue(to);
    let finished = false;

    if (!started) {
      // When true, the current value has probably changed.
      const hasValueChanged = reset || (!hasAnimated(this) && hasFromChanged);

      // When the "to" value or current value are changed,
      // start animating if not already finished.
      if (hasToChanged || hasValueChanged) {
        finished = isEqual(computeGoal(value), goal);
        started = !finished;
      }

      // Changing "decay" or "velocity" starts the animation.
      if (
        (!isEqual(anim.immediate, immediate) && !immediate) ||
        !isEqual(config.decay, decay) ||
        !isEqual(config.velocity, velocity)
      ) {
        started = true;
      }
    }

    // Was the goal value set to the current value while animating?
    if (finished && isAnimating(this)) {
      // If the first frame has passed, allow the animation to
      // overshoot instead of stopping abruptly.
      if (anim.changed && !reset) {
        started = true;
      }
      // Stop the animation before its first frame.
      else if (!started) {
        this._stop(prevTo);
      }
    }

    if (!hasAsyncTo) {
      // Make sure our "toValues" are updated even if our previous
      // "to" prop is a fluid value whose current value is also ours.
      if (started || hasFluidValue(prevTo)) {
        anim.values = node.getPayload();
        anim.toValues = hasFluidValue(to)
          ? null
          : goalType == AnimatedString
          ? [1]
          : toArray(goal);
      }

      if (anim.immediate != immediate) {
        anim.immediate = immediate;

        // Ensure the immediate goal is used as from value.
        if (!immediate && !reset) {
          this._set(prevTo);
        }
      }

      if (started) {
        const { onRest } = anim;

        // Set the active handlers when an animation starts.
        each(ACTIVE_EVENTS, (type) => mergeActiveFn(this, props, type));

        const result = getFinishedResult(this, checkFinished(this, prevTo));
        flushCalls(this._pendingCalls, result);
        this._pendingCalls.add(resolve);

        if (anim.changed)
          raf.batchedUpdates(() => {
            // Ensure `onStart` can be called after a reset.
            anim.changed = !reset;

            // Call the active `onRest` handler from the interrupted animation.
            onRest?.(result, this);

            // Notify the default `onRest` of the reset, but wait for the
            // first frame to pass before sending an `onStart` event.
            if (reset) {
              callProp(defaultProps.onRest, result);
            }
            // Call the active `onStart` handler here since the first frame
            // has already passed, which means this is a goal update and not
            // an entirely new animation.
            else {
              anim.onStart?.(result, this);
            }
          });
      }
    }

    if (reset) {
      this._set(value);
    }

    if (hasAsyncTo) {
      resolve(runAsync(props.to, props, this._state, this));
    }

    // Start an animation
    else if (started) {
      this._start();
    }

    // Postpone promise resolution until the animation is finished,
    // so that no-op updates still resolve at the expected time.
    else if (isAnimating(this) && !hasToChanged) {
      this._pendingCalls.add(resolve);
    }

    // Resolve our promise immediately.
    else {
      resolve(getNoopResult(value));
    }
  }

  /** Update the `animation.to` value, which might be a `FluidValue` */
  protected _focus(value: T | FluidValue<T>) {
    const anim = this.animation;
    if (value !== anim.to) {
      if (getFluidObservers(this)) {
        this._detach();
      }
      anim.to = value;
      if (getFluidObservers(this)) {
        this._attach();
      }
    }
  }

  protected _attach() {
    let priority = 0;

    const { to } = this.animation;
    if (hasFluidValue(to)) {
      addFluidObserver(to, this);
      if (isFrameValue(to)) {
        priority = to.priority + 1;
      }
    }

    this.priority = priority;
  }

  protected _detach() {
    const { to } = this.animation;
    if (hasFluidValue(to)) {
      removeFluidObserver(to, this);
    }
  }

  /**
   * Update the current value from outside the frameloop,
   * and return the `Animated` node.
   */
  protected _set(arg: T | FluidValue<T>, idle = true): Animated | undefined {
    const value = getFluidValue(arg);
    if (!is.und(value)) {
      const oldNode = getAnimated(this);
      if (!oldNode || !isEqual(value, oldNode.getValue())) {
        // Create a new node or update the existing node.
        const nodeType = getAnimatedType(value);
        if (!oldNode || oldNode.constructor != nodeType) {
          setAnimated(this, nodeType.create(value));
        } else {
          oldNode.setValue(value);
        }
        // Never emit a "change" event for the initial value.
        if (oldNode) {
          raf.batchedUpdates(() => {
            this._onChange(value, idle);
          });
        }
      }
    }
    return getAnimated(this);
  }

  protected _onStart() {
    const anim = this.animation;
    if (!anim.changed) {
      anim.changed = true;
      sendEvent(
        this,
        "onStart",
        getFinishedResult(this, checkFinished(this, anim.to)),
        this
      );
    }
  }

  protected _onChange(value: T, idle?: boolean) {
    if (!idle) {
      this._onStart();
      callProp(this.animation.onChange, value, this);
    }
    callProp(this.defaultProps.onChange, value, this);
    super._onChange(value, idle);
  }

  // This method resets the animation state (even if already animating) to
  // ensure the latest from/to range is used, and it also ensures this spring
  // is added to the frameloop.
  protected _start() {
    const anim = this.animation;

    // Reset the state of each Animated node.
    getAnimated(this)!.reset(getFluidValue(anim.to));

    // Use the current values as the from values.
    if (!anim.immediate) {
      anim.fromValues = anim.values.map((node) => node.lastPosition);
    }

    if (!isAnimating(this)) {
      setActiveBit(this, true);
      if (!isPaused(this)) {
        this._resume();
      }
    }
  }

  protected _resume() {
    // The "skipAnimation" global avoids the frameloop.
    if (G_skipAnimation) {
      this.finish();
    } else {
      frameLoop.start(this);
    }
  }

  /**
   * Exit the frameloop and notify `onRest` listeners.
   *
   * Always wrap `_stop` calls with `batchedUpdates`.
   */
  protected _stop(goal?: any, cancel?: boolean) {
    if (isAnimating(this)) {
      setActiveBit(this, false);

      const anim = this.animation;
      each(anim.values, (node) => {
        node.done = true;
      });

      // These active handlers must be reset to undefined or else
      // they could be called while idle. But keep them defined
      // when the goal value is dynamic.
      if (anim.toValues) {
        anim.onChange = anim.onPause = anim.onResume = undefined;
      }

      callFluidObservers(this, {
        type: "idle",
        parent: this,
      });

      const result = cancel
        ? getCancelledResult(this.get())
        : getFinishedResult(this.get(), checkFinished(this, goal ?? anim.to));

      flushCalls(this._pendingCalls, result);
      if (anim.changed) {
        anim.changed = false;
        sendEvent(this, "onRest", result, this);
      }
    }
  }
}

/** Returns true when the current value and goal value are equal. */
function checkFinished<T>(target: SpringValue<T>, to: T | FluidValue<T>) {
  const goal = computeGoal(to);
  const value = computeGoal(target.get());
  return isEqual(value, goal);
}

function createLoopUpdate<T>(
  props: T & { loop?: any; to?: any; from?: any; reverse?: any },
  loop = props.loop,
  to = props.to
): T | undefined {
  let loopRet = callProp(loop);
  if (loopRet) {
    const overrides = loopRet !== true && inferTo(loopRet);
    const reverse = (overrides || props).reverse;
    const reset = !overrides || overrides.reset;
    return createUpdate({
      ...props,
      loop,

      // Avoid updating default props when looping.
      default: false,

      // Never loop the `pause` prop.
      pause: undefined,

      // For the "reverse" prop to loop as expected, the "to" prop
      // must be undefined. The "reverse" prop is ignored when the
      // "to" prop is an array or function.
      to: !reverse || isAsyncTo(to) ? to : undefined,

      // Ignore the "from" prop except on reset.
      from: reset ? props.from : undefined,
      reset,

      // The "loop" prop can return a "useSpring" props object to
      // override any of the original props.
      ...overrides,
    });
  }
}

/**
 * Return a new object based on the given `props`.
 *
 * - All non-reserved props are moved into the `to` prop object.
 * - The `keys` prop is set to an array of affected keys,
 *   or `null` if all keys are affected.
 */
function createUpdate(props: any) {
  const { to, from } = (props = inferTo(props));

  // Collect the keys affected by this update.
  const keys = new Set<string>();

  if (is.obj(to)) findDefined(to, keys);
  if (is.obj(from)) findDefined(from, keys);

  // The "keys" prop helps in applying updates to affected keys only.
  props.keys = keys.size ? Array.from(keys) : null;

  return props;
}

/**
 * A modified version of `createUpdate` meant for declarative APIs.
 */
function declareUpdate(props: any) {
  const update = createUpdate(props);
  if (is.und(update.default)) {
    update.default = getDefaultProps(update);
  }
  return update;
}

/** Find keys with defined values */
function findDefined(values: Lookup, keys: Set<string>) {
  eachProp(values, (value, key) => value != null && keys.add(key as any));
}

function mergeActiveFn<T, P extends EventKey>(
  target: SpringValue<T>,
  props: SpringProps<T>,
  type: P
) {
  target.animation[type] =
    props[type] !== getDefaultProp(props, type)
      ? resolveProp<any>(props[type], target.key)
      : undefined;
}

type EventArgs<T, P extends EventKey> = Parameters<
  Extract<SpringProps<T>[P], Function>
>;

/** Call the active handler first, then the default handler. */
function sendEvent<T, P extends EventKey>(
  target: SpringValue<T>,
  type: P,
  ...args: EventArgs<T, P>
) {
  target.animation[type]?.(...(args as [any, any]));
  target.defaultProps[type]?.(...(args as [any, any]));
}

declare const console: any;

const prefix = "react-spring: ";

const once = <TFunc extends (...args: any) => any>(fn: TFunc) => {
  const func = fn;
  let called = false;

  if (typeof func != "function") {
    throw new TypeError(`${prefix}once requires a function parameter`);
  }

  return (...args: any) => {
    if (!called) {
      func(...args);
      called = true;
    }
  };
};

// const warnInterpolate = once(console.warn);
// function deprecateInterpolate() {
//   warnInterpolate(
//     `${prefix}The "interpolate" function is deprecated in v9 (use "to" instead)`
//   )
// };

const warnDirectCall = once(console.warn);

function deprecateDirectCall() {
  warnDirectCall(
    `${prefix}Directly calling start instead of using the api object is deprecated in v9 (use ".start" instead), this will be removed in later 0.X.0 versions`
  );
}

interface ControllerUpdateFn<State extends Lookup = Lookup> {
  (i: number, ctrl: Controller<State>): ControllerUpdate<State> | Falsy;
}

interface SpringRef<State extends Lookup = Lookup> {
  (props?: ControllerUpdate<State> | ControllerUpdateFn<State>): AsyncResult<
    Controller<State>
  >[];
  current: Controller<State>[];

  /** Add a controller to this ref */
  add(ctrl: Controller<State>): void;

  /** Remove a controller from this ref */
  delete(ctrl: Controller<State>): void;

  /** Pause all animations. */
  pause(): this;
  /** Pause animations for the given keys. */
  pause(keys: OneOrMore<string>): this;
  /** Pause some or all animations. */
  pause(keys?: OneOrMore<string>): this;

  /** Resume all animations. */
  resume(): this;
  /** Resume animations for the given keys. */
  resume(keys: OneOrMore<string>): this;
  /** Resume some or all animations. */
  resume(keys?: OneOrMore<string>): this;

  /** Update the state of each controller without animating. */
  set(values: Partial<State>): void;

  /** Start the queued animations of each controller. */
  start(): AsyncResult<Controller<State>>[];
  /** Update every controller with the same props. */
  start(props: ControllerUpdate<State>): AsyncResult<Controller<State>>[];
  /** Update controllers based on their state. */
  start(props: ControllerUpdateFn<State>): AsyncResult<Controller<State>>[];
  /** Start animating each controller. */
  start(
    props?: ControllerUpdate<State> | ControllerUpdateFn<State>
  ): AsyncResult<Controller<State>>[];

  /** Stop all animations. */
  stop(): this;
  /** Stop animations for the given keys. */
  stop(keys: OneOrMore<string>): this;
  /** Cancel all animations. */
  stop(cancel: boolean): this;
  /** Cancel animations for the given keys. */
  stop(cancel: boolean, keys: OneOrMore<string>): this;
  /** Stop some or all animations. */
  stop(keys?: OneOrMore<string>): this;
  /** Cancel some or all animations. */
  stop(cancel: boolean, keys?: OneOrMore<string>): this;

  /** Add the same props to each controller's update queue. */
  update(props: ControllerUpdate<State>): this;
  /** Generate separate props for each controller's update queue. */
  update(props: ControllerUpdateFn<State>): this;
  /** Add props to each controller's update queue. */
  update(props: ControllerUpdate<State> | ControllerUpdateFn<State>): this;

  _getProps(
    arg: ControllerUpdate<State> | ControllerUpdateFn<State>,
    ctrl: Controller<State>,
    index: number
  ): ControllerUpdate<State> | Falsy;
}

const SpringRef = <State extends Lookup = Lookup>(): SpringRef<State> => {
  const current: Controller<State>[] = [];

  const SpringRef: SpringRef<State> = function (props) {
    deprecateDirectCall();

    const results: AsyncResult[] = [];

    each(current, (ctrl, i) => {
      if (is.und(props)) {
        results.push(ctrl.start());
      } else {
        const update = _getProps(props, ctrl, i);
        if (update) {
          results.push(ctrl.start(update));
        }
      }
    });

    return results;
  };

  SpringRef.current = current;

  /** Add a controller to this ref */
  SpringRef.add = function (ctrl: Controller<State>) {
    if (!current.includes(ctrl)) {
      current.push(ctrl);
    }
  };

  /** Remove a controller from this ref */
  SpringRef.delete = function (ctrl: Controller<State>) {
    const i = current.indexOf(ctrl);
    if (~i) current.splice(i, 1);
  };

  /** Pause all animations. */
  SpringRef.pause = function () {
    each(current, (ctrl) => ctrl.pause(...arguments));
    return this;
  };

  /** Resume all animations. */
  SpringRef.resume = function () {
    each(current, (ctrl) => ctrl.resume(...arguments));
    return this;
  };

  /** Update the state of each controller without animating. */
  SpringRef.set = function (values: Partial<State>) {
    each(current, (ctrl) => ctrl.set(values));
  };

  SpringRef.start = function (props?: object | ControllerUpdateFn<State>) {
    const results: AsyncResult[] = [];

    each(current, (ctrl, i) => {
      if (is.und(props)) {
        results.push(ctrl.start());
      } else {
        const update = this._getProps(props, ctrl, i);
        if (update) {
          results.push(ctrl.start(update));
        }
      }
    });

    return results;
  };

  /** Stop all animations. */
  SpringRef.stop = function () {
    each(current, (ctrl) => ctrl.stop(...arguments));
    return this;
  };

  SpringRef.update = function (props: object | ControllerUpdateFn<State>) {
    each(current, (ctrl, i) => ctrl.update(this._getProps(props, ctrl, i)));
    return this;
  };

  /** Overridden by `useTrail` to manipulate props */
  const _getProps = function (
    arg: ControllerUpdate<State> | ControllerUpdateFn<State>,
    ctrl: Controller<State>,
    index: number
  ): ControllerUpdate<State> | Falsy {
    return is.fun(arg) ? arg(index, ctrl) : arg;
  };

  SpringRef._getProps = _getProps;

  return SpringRef;
};

type UseSpringsProps<State extends Lookup = Lookup> = unknown &
  ControllerUpdate<State> & {
    ref?: SpringRef<State>;
  };

/**
 * When the `deps` argument exists, the `props` function is called whenever
 * the `deps` change on re-render.
 *
 * Without the `deps` argument, the `props` function is only called once.
 */
function useSprings<Props extends UseSpringProps>(
  length: number,
  props: (i: number, ctrl: Controller) => Props,
  deps?: readonly any[]
): PickAnimated<Props> extends infer State
  ? State extends Lookup<any>
    ? [SpringValues<State>[], SpringRef<State>]
    : never
  : never;

/**
 * Animations are updated on re-render.
 */
function useSprings<Props extends UseSpringsProps>(
  length: number,
  props: Props[] & UseSpringsProps<PickAnimated<Props>>[]
): SpringValues<PickAnimated<Props>>[];

/**
 * When the `deps` argument exists, you get the `update` and `stop` function.
 */
function useSprings<Props extends UseSpringsProps>(
  length: number,
  props: Props[] & UseSpringsProps<PickAnimated<Props>>[],
  deps: readonly any[] | undefined
): PickAnimated<Props> extends infer State
  ? State extends Lookup<any>
    ? [SpringValues<State>[], SpringRef<State>]
    : never
  : never;

/** @internal */
function useSprings(
  length: number,
  props: any[] | ((i: number, ctrl: Controller) => any),
  deps?: readonly any[]
): any {
  const propsFn = is.fun(props) && props;
  if (propsFn && !deps) deps = [];

  // Create a local ref if a props function or deps array is ever passed.
  const ref = useMemo(
    () => (propsFn || arguments.length == 3 ? SpringRef() : void 0),
    []
  );

  interface State {
    // The controllers used for applying updates.
    ctrls: Controller[];
    // The queue of changes to make on commit.
    queue: Array<() => void>;
    // The flush function used by controllers.
    flush: ControllerFlushFn;
  }

  // Set to 0 to prevent sync flush.
  const layoutId = useRef(0);
  const forceUpdate = useForceUpdate();

  // State is updated on commit.
  const state = useMemo(
    (): State => ({
      ctrls: [],
      queue: [],
      flush(ctrl, updates) {
        const springs = getSprings(ctrl, updates);

        // Flushing is postponed until the component's commit phase
        // if a spring was created since the last commit.
        const canFlushSync =
          layoutId.current > 0 &&
          !state.queue.length &&
          !Object.keys(springs).some((key) => !ctrl.springs[key]);

        return canFlushSync
          ? flushUpdateQueue(ctrl, updates)
          : new Promise<any>((resolve) => {
              setSprings(ctrl, springs);
              state.queue.push(() => {
                resolve(flushUpdateQueue(ctrl, updates));
              });
              forceUpdate();
            });
      },
    }),
    []
  );

  const ctrls = useRef([...state.ctrls]);
  const updates: any[] = [];

  // Cache old controllers to dispose in the commit phase.
  const prevLength = usePrev(length) || 0;

  // Create new controllers when "length" increases, and destroy
  // the affected controllers when "length" decreases.
  useMemo(() => {
    // Clean up any unused controllers
    each(ctrls.current.slice(length, prevLength), (ctrl) => {
      detachRefs(ctrl, ref);
      ctrl.stop(true);
    });
    ctrls.current.length = length;

    declareUpdates(prevLength, length);
  }, [length]);

  // Update existing controllers when "deps" are changed.
  useMemo(() => {
    declareUpdates(0, Math.min(prevLength, length));
  }, deps);

  /** Fill the `updates` array with declarative updates for the given index range. */
  function declareUpdates(startIndex: number, endIndex: number) {
    for (let i = startIndex; i < endIndex; i++) {
      const ctrl =
        ctrls.current[i] ||
        (ctrls.current[i] = new Controller(null, state.flush));

      const update: UseSpringProps<any> = propsFn
        ? propsFn(i, ctrl)
        : (props as any)[i];

      if (update) {
        updates[i] = declareUpdate(update);
      }
    }
  }

  // New springs are created during render so users can pass them to
  // their animated components, but new springs aren't cached until the
  // commit phase (see the `useIsomorphicLayoutEffect` callback below).
  const springs = ctrls.current.map((ctrl, i) => getSprings(ctrl, updates[i]));

  const context = useContext(SpringContext);
  const prevContext = usePrev(context);
  const hasContext = context !== prevContext && hasProps(context);

  useIsomorphicLayoutEffect(() => {
    layoutId.current++;

    // Replace the cached controllers.
    state.ctrls = ctrls.current;

    // Flush the commit queue.
    const { queue } = state;
    if (queue.length) {
      state.queue = [];
      each(queue, (cb) => cb());
    }

    // Update existing controllers.
    each(ctrls.current, (ctrl, i) => {
      // Attach the controller to the local ref.
      ref?.add(ctrl);

      // Update the default props.
      if (hasContext) {
        ctrl.start({ default: context });
      }

      // Apply updates created during render.
      const update = updates[i];
      if (update) {
        // Update the injected ref if needed.
        replaceRef(ctrl, update.ref);

        // When an injected ref exists, the update is postponed
        // until the ref has its `start` method called.
        if (ctrl.ref) {
          ctrl.queue.push(update);
        } else {
          ctrl.start(update);
        }
      }
    });
  });

  // Cancel the animations of all controllers on unmount.
  useOnce(() => () => {
    each(state.ctrls, (ctrl) => ctrl.stop(true));
  });

  // Return a deep copy of the `springs` array so the caller can
  // safely mutate it during render.
  const values = springs.map((x) => ({ ...x }));

  return ref ? [values, ref] : values;
}

/**
 * The props that `useSpring` recognizes.
 */
export type UseSpringProps<Props extends object = any> = unknown &
  PickAnimated<Props> extends infer State
  ? State extends Lookup
    ? Remap<
        ControllerUpdate<State> & {
          /**
           * Used to access the imperative API.
           *
           * When defined, the render animation won't auto-start.
           */
          ref?: SpringRef<State>;
        }
      >
    : never
  : never;

/**
 * The `props` function is only called on the first render, unless
 * `deps` change (when defined). State is inferred from forward props.
 */
export function useSpring<Props extends object>(
  props:
    | Function
    | (() => (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps),
  deps?: readonly any[] | undefined
): PickAnimated<Props> extends infer State
  ? State extends Lookup
    ? [SpringValues<State>, SpringRef<State>]
    : never
  : never;

/**
 * Updated on every render, with state inferred from forward props.
 */
export function useSpring<Props extends object>(
  props: (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps
): SpringValues<PickAnimated<Props>>;

/**
 * Updated only when `deps` change, with state inferred from forward props.
 */
export function useSpring<Props extends object>(
  props: (Props & Valid<Props, UseSpringProps<Props>>) | UseSpringProps,
  deps: readonly any[] | undefined
): PickAnimated<Props> extends infer State
  ? State extends Lookup
    ? [SpringValues<State>, SpringRef<State>]
    : never
  : never;

/** @internal */
export function useSpring(props: any, deps?: readonly any[]) {
  const isFn = is.fun(props);
  const [[values], ref] = useSprings(
    1,
    isFn ? props : [props],
    isFn ? deps || [] : deps
  );
  return isFn || arguments.length == 2 ? [values, ref] : values;
}
