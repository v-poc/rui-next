import { useEffect, useRef, useState, EffectCallback } from "react";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect/index";

const $get = Symbol.for("FluidValue.get");
const $observers = Symbol.for("FluidValue.observers");
const $node: any = Symbol.for("Animated:node");

/**
 * Parse special CSS variable format into a CSS token and a fallback.
 * `var(--foo, #fff)` => [`--foo`, '#fff']
 */
const cssVariableRegex = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/;

// G.colors
let G_colors = null as { [key: string]: number } | null;

// For server-side rendering with Deno support
export const isSSR = () =>
  typeof window === "undefined" ||
  !window.navigator ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);

export interface Lookup<T = any> {
  [key: string]: T;
}

/** Use `[T] extends [Any]` to know if a type parameter is `any` */
export class Any {
  // @ts-ignore
  private _: never;
}

export type OneOrMore<T> = T | readonly T[];

type Narrow<T, U> = [T] extends [Any] ? U : [T] extends [U] ? Extract<T, U> : U;

type IsType<U> = <T>(arg: T & any) => arg is Narrow<T, U>;

type PlainObject<T> = Exclude<T & Lookup, Function | readonly any[]>;

/** Ensure each type of `T` is an array */
export type Arrify<T> = [T, T] extends [infer T, infer DT]
  ? DT extends ReadonlyArray<any>
    ? Array<DT[number]> extends DT
      ? ReadonlyArray<T extends ReadonlyArray<infer U> ? U : T>
      : DT
    : ReadonlyArray<T extends ReadonlyArray<infer U> ? U : T>
  : never;

type EachFn<Value, Key, This> = (this: This, value: Value, key: Key) => void;

type Eachable<Value = any, Key = any, This = any> = {
  forEach(cb: EachFn<Value, Key, This>, ctx?: This): void;
};

/** An event sent to `FluidObserver` objects. */
export interface FluidEvent<T = any> {
  type: string;
  parent: FluidValue<T>;
}

/** An observer of `FluidValue` objects. */
export type FluidObserver<E extends FluidEvent = any> =
  | { eventObserved(event: E): void }
  | { (event: E): void };

type GetFluidValue = {
  <T, U = never>(target: T | FluidValue<U>): Exclude<T, FluidValue> | U;
};

type GetFluidObservers = {
  <E extends FluidEvent>(target: FluidValue<any, E>): ReadonlySet<
    FluidObserver<E>
  > | null;
  (target: object): ReadonlySet<FluidObserver> | null;
};

export const is = {
  arr: Array.isArray as IsType<readonly any[]>,
  obj: <T extends any>(a: T & any): a is PlainObject<T> =>
    !!a && a.constructor.name === "Object",
  fun: ((a: unknown) => typeof a === "function") as IsType<Function>,
  str: (a: unknown): a is string => typeof a === "string",
  num: (a: unknown): a is number => typeof a === "number",
  und: (a: unknown): a is undefined => a === undefined,
};

/** Minifiable `.forEach` call */
export const each = <Value, Key, This>(
  obj: Eachable<Value, Key, This>,
  fn: EachFn<Value, Key, This>
) => obj.forEach(fn);

/** Iterate the properties of an object */
export function eachProp<T extends object, This>(
  obj: T,
  fn: (
    this: This,
    value: T extends any[] ? T[number] : T[keyof T],
    key: string
  ) => void,
  ctx?: This
) {
  if (is.arr(obj)) {
    for (let i = 0; i < obj.length; i++) {
      fn.call(ctx as any, obj[i] as any, `${i}`);
    }
    return;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn.call(ctx as any, obj[key] as any, key);
    }
  }
}

export const toArray = <T>(a: T): Arrify<Exclude<T, void>> =>
  is.und(a) ? [] : is.arr(a) ? (a as any) : [a];

/** Returns true if `arg` can be observed. */
export const hasFluidValue = (arg: any): arg is FluidValue =>
  Boolean(arg && arg[$get]);

/** Define the getter called by `getFluidValue`. */
const setFluidGetter = (target: object, get: () => any) =>
  setHidden(target, $get, get);

const setHidden = (target: any, key: any, value: any) =>
  Object.defineProperty(target, key, {
    value,
    writable: true,
    configurable: true,
  });

export const defineHidden = (obj: any, key: any, value: any) =>
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    configurable: true,
  });

/**
 * Extend this class for automatic TypeScript support when passing this
 * value to `fluids`-compatible libraries.
 */
export abstract class FluidValue<T = any, E extends FluidEvent<T> = any> {
  // @ts-ignore
  private [$get]: () => T;
  // @ts-ignore
  private [$observers]?: Set<FluidObserver<E>>;

  constructor(get?: () => T) {
    if (!get && !(get = this.get)) {
      throw Error("Unknown getter");
    }
    setFluidGetter(this, get);
  }

  /** Get the current value. */
  protected get?(): T;
  /** Called after an observer is added. */
  protected observerAdded?(count: number, observer: FluidObserver<E>): void;
  /** Called after an observer is removed. */
  protected observerRemoved?(count: number, observer: FluidObserver<E>): void;
}

/** Observe a `fluids`-compatible object. */
export function addFluidObserver<T, E extends FluidEvent>(
  target: FluidValue<T, E>,
  observer: FluidObserver<E>
): typeof observer;

export function addFluidObserver<E extends FluidEvent>(
  target: object,
  observer: FluidObserver<E>
): typeof observer;

export function addFluidObserver(target: any, observer: FluidObserver) {
  if (target[$get]) {
    let observers: Set<FluidObserver> = target[$observers];
    if (!observers) {
      setHidden(target, $observers, (observers = new Set()));
    }
    if (!observers.has(observer)) {
      observers.add(observer);
      if (target.observerAdded) {
        target.observerAdded(observers.size, observer);
      }
    }
  }
  return observer;
}

/** Stop observing a `fluids`-compatible object. */
export function removeFluidObserver<E extends FluidEvent>(
  target: FluidValue<any, E>,
  observer: FluidObserver<E>
): void;

export function removeFluidObserver<E extends FluidEvent>(
  target: object,
  observer: FluidObserver<E>
): void;

export function removeFluidObserver(target: any, observer: FluidObserver) {
  let observers: Set<FluidObserver> = target[$observers];
  if (observers && observers.has(observer)) {
    const count = observers.size - 1;
    if (count) {
      observers.delete(observer);
    } else {
      target[$observers] = null;
    }
    if (target.observerRemoved) {
      target.observerRemoved(count, observer);
    }
  }
}

/**
 * Get the current value.
 * If `arg` is not observable, `arg` is returned.
 */
export const getFluidValue: GetFluidValue = (arg: any) =>
  arg && arg[$get] ? arg[$get]() : arg;

/** Get the current observer set. Never mutate it directly! */
export const getFluidObservers: GetFluidObservers = (target: any) =>
  target[$observers] || null;

/** Send an event to an observer. */
function callFluidObserver<E extends FluidEvent>(
  observer: FluidObserver<E>,
  event: E
): void;

function callFluidObserver(observer: any, event: FluidEvent) {
  if (observer.eventObserved) {
    observer.eventObserved(event);
  } else {
    observer(event);
  }
}

/** Send an event to all observers. */
export function callFluidObservers<E extends FluidEvent>(
  target: FluidValue<any, E>,
  event: E
): void;

export function callFluidObservers(target: object, event: FluidEvent): void;

export function callFluidObservers(target: any, event: FluidEvent) {
  let observers: Set<FluidObserver> = target[$observers];
  if (observers) {
    observers.forEach((observer) => {
      callFluidObserver(observer, event);
    });
  }
}

/** The most recent timestamp. */
let ts = -1;

/** The number of pending tasks  */
let pendingCount = 0;

/** When true, scheduling is disabled. */
let sync = false;

function schedule<T extends Function>(fn: T, queue: Queue<T>) {
  if (sync) {
    queue.delete(fn);
    fn(0);
  } else {
    queue.add(fn);
    start();
  }
}

function start() {
  if (ts < 0) {
    ts = 0;
    if (raf.frameLoop !== "demand") {
      nativeRaf(loop);
    }
  }
}

function stop() {
  ts = -1;
}

function loop() {
  if (~ts) {
    nativeRaf(loop);
    raf.batchedUpdates(update);
  }
}

function update() {
  let prevTs = ts;
  ts = raf.now();

  // Flush timeouts whose time is up.
  let count = findTimeout(ts);
  if (count) {
    eachSafely(timeouts.splice(0, count), (t) => t.handler());
    pendingCount -= count;
  }

  if (!pendingCount) {
    stop();

    return;
  }

  onStartQueue.flush();
  updateQueue.flush(prevTs ? Math.min(64, ts - prevTs) : 16.667);
  onFrameQueue.flush();
  writeQueue.flush();
  onFinishQueue.flush();
}

interface Queue<T extends Function = any> {
  add: (fn: T) => void;
  delete: (fn: T) => boolean;
  flush: (arg?: any) => void;
}

function makeQueue<T extends Function>(): Queue<T> {
  let next = new Set<T>();
  let current = next;
  return {
    add(fn) {
      pendingCount += current == next && !next.has(fn) ? 1 : 0;
      next.add(fn);
    },
    delete(fn) {
      pendingCount -= current == next && next.has(fn) ? 1 : 0;
      return next.delete(fn);
    },
    flush(arg) {
      if (current.size) {
        next = new Set();
        pendingCount -= current.size;
        eachSafely(current, (fn) => fn(arg) && next.add(fn));
        pendingCount += next.size;
        current = next;
      }
    },
  };
}

type NativeRaf = (cb: () => void) => void;

export type AnyFn<In extends ReadonlyArray<any> = any[], Out = any> = (
  ...args: In
) => Out;

export interface Timeout {
  time: number;
  handler: () => void;
  cancel: () => void;
}

/* raf */
type VoidFn = (...args: any[]) => undefined | void;

type Throttled<T extends VoidFn> = T & {
  handler: T;
  cancel: () => void;
};

/**
 * This function updates animation state with the delta time.
 */
type FrameUpdateFn = (dt: number) => boolean | void;

/**
 * Return true to be called again next frame.
 */
type FrameFn = () => boolean | void;

interface Rafz {
  (update: FrameUpdateFn): void;

  /**
   * How should the frameLoop run, when we call .advance or naturally?
   */
  frameLoop: "always" | "demand";

  /**
   * Prevent a queued `raf(...)` or `raf.write(...)` call.
   */
  cancel: (fn: AnyFn) => void;

  /**
   * To avoid performance issues, all mutations are batched with this function.
   * If the update loop is dormant, it will be started when you call this.
   */
  write: (fn: FrameFn) => void;

  /**
   * Run a function before updates are flushed.
   */
  onStart: (fn: FrameFn) => void;

  /**
   * Run a function before writes are flushed.
   */
  onFrame: (fn: FrameFn) => void;

  /**
   * Run a function after writes are flushed.
   */
  onFinish: (fn: FrameFn) => void;

  /**
   * Run a function on the soonest frame after the given time has passed,
   * and before any updates on that particular frame.
   */
  setTimeout: (handler: () => void, ms: number) => Timeout;

  /**
   * Any function scheduled within the given callback is run immediately.
   * This escape hatch should only be used if you know what you're doing.
   */
  sync: (fn: () => void) => void;

  /**
   * Wrap a function so its execution is limited to once per frame. If called
   * more than once in a single frame, the last call's arguments are used.
   */
  throttle: <T extends VoidFn>(fn: T) => Throttled<T>;

  /**
   * Override the native `requestAnimationFrame` implementation.
   *
   * You must call this if your environment never defines
   * `window.requestAnimationFrame` for you.
   */
  use: <T extends NativeRaf>(impl: T) => T;

  /**
   * This is responsible for providing the current time,
   * which is used when calculating the elapsed time.
   *
   * It defaults to `performance.now` when it exists,
   * otherwise `Date.now` is used.
   */
  now: () => number;

  /**
   * For update batching in React. Does nothing by default.
   */
  batchedUpdates: (cb: () => void) => void;

  /**
   * The error handler used when a queued function throws.
   */
  catch: (error: Error) => void;

  /**
   * Manual advancement of the frameLoop, calls our update function
   * only if `.frameLoop === 'demand'`
   */
  advance: () => void;
}

let updateQueue = makeQueue<FrameUpdateFn>();

/**
 * Schedule an update for next frame.
 * Your function can return `true` to repeat next frame.
 */
export const raf: Rafz = (fn) => schedule(fn, updateQueue);

let writeQueue = makeQueue<FrameFn>();
raf.write = (fn) => schedule(fn, writeQueue);

let onStartQueue = makeQueue<FrameFn>();
raf.onStart = (fn) => schedule(fn, onStartQueue);

let onFrameQueue = makeQueue<FrameFn>();
raf.onFrame = (fn) => schedule(fn, onFrameQueue);

let onFinishQueue = makeQueue<FrameFn>();
raf.onFinish = (fn) => schedule(fn, onFinishQueue);

let timeouts: Timeout[] = [];
raf.setTimeout = (handler, ms) => {
  let time = raf.now() + ms;
  let cancel = () => {
    let i = timeouts.findIndex((t) => t.cancel == cancel);
    if (~i) timeouts.splice(i, 1);
    pendingCount -= ~i ? 1 : 0;
  };

  let timeout: Timeout = { time, handler, cancel };
  timeouts.splice(findTimeout(time), 0, timeout);
  pendingCount += 1;

  start();
  return timeout;
};

/** Find the index where the given time is not greater. */
let findTimeout = (time: number) =>
  ~(~timeouts.findIndex((t) => t.time > time) || ~timeouts.length);

raf.cancel = (fn) => {
  onStartQueue.delete(fn);
  onFrameQueue.delete(fn);
  onFinishQueue.delete(fn);
  updateQueue.delete(fn);
  writeQueue.delete(fn);
};

raf.sync = (fn) => {
  sync = true;
  raf.batchedUpdates(fn);
  sync = false;
};

raf.throttle = (fn) => {
  let lastArgs: any;
  function queuedFn() {
    try {
      fn(...lastArgs);
    } finally {
      lastArgs = null;
    }
  }
  function throttled(...args: any) {
    lastArgs = args;
    raf.onStart(queuedFn);
  }
  throttled.handler = fn;
  throttled.cancel = () => {
    onStartQueue.delete(queuedFn);
    lastArgs = null;
  };
  return throttled as any;
};

let nativeRaf =
  typeof window != "undefined"
    ? (window.requestAnimationFrame as NativeRaf)
    : () => {};

raf.use = (impl) => (nativeRaf = impl);
raf.now =
  typeof performance != "undefined" ? () => performance.now() : Date.now;
raf.batchedUpdates = (fn) => fn();
raf.catch = console.error;

raf.frameLoop = "always";

raf.advance = () => {
  if (raf.frameLoop !== "demand") {
    console.warn(
      "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
    );
  } else {
    update();
  }
};

function eachSafely<T>(
  values: {
    forEach(cb: (value: T) => void): void;
  },
  each: (value: T) => void
) {
  values.forEach((value) => {
    try {
      each(value);
    } catch (e) {
      raf.catch(e as Error);
    }
  });
}

export const isAnimated = <T = any>(value: any): value is Animated<T> =>
  !!value && value[$node] === value;

/** Get the owner's `Animated` node. */
export const getAnimated = <T = any>(owner: any): Animated<T> | undefined =>
  owner && owner[$node];

/** Set the owner's `Animated` node. */
export const setAnimated = (owner: any, node: Animated) =>
  defineHidden(owner, $node, node);

/** Get every `AnimatedValue` in the owner's `Animated` node. */
export const getPayload = (owner: any): AnimatedValue[] | undefined =>
  owner && owner[$node] && owner[$node].getPayload();

export abstract class Animated<T = any> {
  /** The cache of animated values */
  protected payload?: Payload;

  constructor() {
    // This makes "isAnimated" return true.
    setAnimated(this, this);
  }

  /** Get the current value. Pass `true` for only animated values. */
  abstract getValue(animated?: boolean): T;

  /** Set the current value. Returns `true` if the value changed. */
  abstract setValue(value: T): boolean | void;

  /** Reset any animation state. */
  abstract reset(goal?: T): void;

  /** Get every `AnimatedValue` used by this node. */
  getPayload(): Payload {
    return this.payload || [];
  }
}

type Payload = readonly AnimatedValue[];

/** An animated number or a native attribute value */
export class AnimatedValue<T = any> extends Animated {
  done = true;
  elapsedTime!: number;
  lastPosition!: number;
  lastVelocity?: number | null;
  v0?: number | null;
  durationProgress = 0;

  constructor(protected _value: T) {
    super();
    if (is.num(this._value)) {
      this.lastPosition = this._value;
    }
  }

  /** @internal */
  static create(value: any) {
    return new AnimatedValue(value);
  }

  getPayload(): Payload {
    return [this];
  }

  getValue() {
    return this._value;
  }

  setValue(value: T, step?: number) {
    if (is.num(value)) {
      this.lastPosition = value;
      if (step) {
        value = (Math.round(value / step) * step) as any;
        if (this.done) {
          this.lastPosition = value as any;
        }
      }
    }
    if (this._value === value) {
      return false;
    }
    this._value = value;
    return true;
  }

  reset() {
    const { done } = this;
    this.done = false;
    if (is.num(this._value)) {
      this.elapsedTime = 0;
      this.durationProgress = 0;
      this.lastPosition = this._value;
      if (done) this.lastVelocity = null;
      this.v0 = null;
    }
  }
}

type TreeContext = {
  /**
   * Any animated values found when updating the payload of an `AnimatedObject`
   * are also added to this `Set` to be observed by an animated component.
   */
  dependencies: Set<FluidValue> | null;
};

const TreeContext: TreeContext = { dependencies: null };

/** An object containing `Animated` nodes */
export class AnimatedObject extends Animated {
  constructor(protected source: Lookup) {
    super();
    this.setValue(source);
  }

  getValue(animated?: boolean) {
    const values: Lookup = {};
    eachProp(this.source, (source, key) => {
      if (isAnimated(source)) {
        values[key] = source.getValue(animated);
      } else if (hasFluidValue(source)) {
        values[key] = getFluidValue(source);
      } else if (!animated) {
        values[key] = source;
      }
    });
    return values;
  }

  /** Replace the raw object data */
  setValue(source: Lookup) {
    this.source = source;
    this.payload = this._makePayload(source);
  }

  reset() {
    if (this.payload) {
      each(this.payload, (node) => node.reset());
    }
  }

  /** Create a payload set. */
  protected _makePayload(source: Lookup) {
    if (source) {
      const payload = new Set<AnimatedValue>();
      eachProp(source, this._addToPayload, payload);
      return Array.from(payload);
    }
  }

  /** Add to a payload set. */
  protected _addToPayload(this: Set<AnimatedValue>, source: any) {
    if (TreeContext.dependencies && hasFluidValue(source)) {
      TreeContext.dependencies.add(source);
    }
    const payload = getPayload(source);
    if (payload) {
      each(payload, (node) => this.add(node));
    }
  }
}

export interface HostConfig {
  /** Provide custom logic for native updates */
  applyAnimatedValues: (node: any, props: Lookup) => boolean | void;
  /** Wrap the `style` prop with an animated node */
  createAnimatedStyle: (style: Lookup) => Animated;
  /** Intercept props before they're passed to an animated component */
  getComponentProps: (props: Lookup) => typeof props;
}

export type EasingFunction = (t: number) => number;

type ExtrapolateType = "identity" | "clamp" | "extend";

export type InterpolatorArgs<Input = any, Output = any> =
  | [InterpolatorFn<Arrify<Input>, Output>]
  | [InterpolatorConfig<Output>]
  | [
      readonly number[],
      readonly Constrain<Output, Animatable>[],
      (ExtrapolateType | undefined)?
    ];

export type InterpolatorFn<Input, Output> = (
  ...inputs: Arrify<Input>
) => Output;

/** Better type errors for overloads with generic types */
export type Constrain<T, U> = [T] extends [Any] ? U : [T] extends [U] ? T : U;

type InterpolatorConfig<Output = Animatable> = {
  /**
   * What happens when the spring goes below its target value.
   *
   *  - `extend` continues the interpolation past the target value
   *  - `clamp` limits the interpolation at the max value
   *  - `identity` sets the value to the interpolation input as soon as it hits the boundary
   *
   * @default 'extend'
   */
  extrapolateLeft?: ExtrapolateType;

  /**
   * What happens when the spring exceeds its target value.
   *
   *  - `extend` continues the interpolation past the target value
   *  - `clamp` limits the interpolation at the max value
   *  - `identity` sets the value to the interpolation input as soon as it hits the boundary
   *
   * @default 'extend'
   */
  extrapolateRight?: ExtrapolateType;

  /**
   * What happens when the spring exceeds its target value.
   * Shortcut to set `extrapolateLeft` and `extrapolateRight`.
   *
   *  - `extend` continues the interpolation past the target value
   *  - `clamp` limits the interpolation at the max value
   *  - `identity` sets the value to the interpolation input as soon as it hits the boundary
   *
   * @default 'extend'
   */
  extrapolate?: ExtrapolateType;

  /**
   * Input ranges mapping the interpolation to the output values.
   *   range: [0, 0.5, 1], output: ['yellow', 'orange', 'red']
   * @default [0,1]
   */
  range?: readonly number[];

  /**
   * Output values from the interpolation function. Should match the length of the `range` array.
   */
  output: readonly Constrain<Output, Animatable>[];

  /**
   * Transformation to apply to the value before interpolation.
   */
  map?: (value: number) => number;

  /**
   * Custom easing to apply in interpolator.
   */
  easing?: EasingFunction;
};

/** These types can be animated */
type Animatable<T = any> = T extends number
  ? number
  : T extends string
  ? string
  : T extends ReadonlyArray<number | string>
  ? Array<number | string> extends T // When true, T is not a tuple
    ? ReadonlyArray<number | string>
    : { [P in keyof T]: Animatable<T[P]> }
  : never;

interface InterpolatorFactory {
  <Input, Output>(
    interpolator: InterpolatorFn<Input, Output>
  ): typeof interpolator;

  <Output>(config: InterpolatorConfig<Output>): (
    input: number
  ) => Animatable<Output>;

  <Output>(
    range: readonly number[],
    output: readonly Constrain<Output, Animatable>[],
    extrapolate?: ExtrapolateType
  ): (input: number) => Animatable<Output>;

  <Input, Output>(...args: InterpolatorArgs<Input, Output>): InterpolatorFn<
    Input,
    Output
  >;
}

function findRange(input: number, inputRange: readonly number[]) {
  for (var i = 1; i < inputRange.length - 1; ++i)
    if (inputRange[i] >= input) break;
  return i - 1;
}

// G.createStringInterpolator
export let G_createStringInterpolator: (
  config: InterpolatorConfig<string>
) => (input: number) => string;

export const createInterpolator: InterpolatorFactory = (
  range: readonly number[] | InterpolatorFn<any, any> | InterpolatorConfig<any>,
  output?: readonly Animatable[],
  extrapolate?: ExtrapolateType
) => {
  if (is.fun(range)) {
    return range;
  }

  if (is.arr(range)) {
    return createInterpolator({
      range,
      output: output!,
      extrapolate,
    });
  }

  if (is.str(range.output[0])) {
    return G_createStringInterpolator(range as any) as any;
  }

  const config = range as InterpolatorConfig<number>;
  const outputRange = config.output;
  const inputRange = config.range || [0, 1];

  const extrapolateLeft =
    config.extrapolateLeft || config.extrapolate || "extend";
  const extrapolateRight =
    config.extrapolateRight || config.extrapolate || "extend";
  const easing = config.easing || ((t) => t);

  return (input: number) => {
    const range = findRange(input, inputRange);
    return interpolate(
      input,
      inputRange[range],
      inputRange[range + 1],
      outputRange[range],
      outputRange[range + 1],
      easing,
      extrapolateLeft,
      extrapolateRight,
      config.map
    );
  };
};

function interpolate(
  input: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  easing: EasingFunction,
  extrapolateLeft: ExtrapolateType,
  extrapolateRight: ExtrapolateType,
  map?: (x: number) => number
) {
  let result = map ? map(input) : input;
  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === "identity") return result;
    else if (extrapolateLeft === "clamp") result = inputMin;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity") return result;
    else if (extrapolateRight === "clamp") result = inputMax;
  }
  if (outputMin === outputMax) return outputMin;
  if (inputMin === inputMax) return input <= inputMin ? outputMin : outputMax;
  // Input Range
  if (inputMin === -Infinity) result = -result;
  else if (inputMax === Infinity) result = result - inputMin;
  else result = (result - inputMin) / (inputMax - inputMin);
  // Easing
  result = easing(result);
  // Output Range
  if (outputMin === -Infinity) result = -result;
  else if (outputMax === Infinity) result = result + outputMin;
  else result = result * (outputMax - outputMin) + outputMin;
  return result;
}

type AnimatedState = [props: AnimatedObject, dependencies: Set<FluidValue>];

type Value = number | string;
type Source = AnimatedValue<Value>[];

export class AnimatedString extends AnimatedValue<Value> {
  protected declare _value: number;
  protected _string: string | null = null;
  protected _toString: (input: number) => string;

  constructor(value: string) {
    super(0);
    this._toString = createInterpolator({
      output: [value, value],
    });
  }

  /** @internal */
  static create(value: string) {
    return new AnimatedString(value);
  }

  getValue() {
    let value = this._string;
    return value == null ? (this._string = this._toString(this._value)) : value;
  }

  setValue(value: Value) {
    if (is.str(value)) {
      if (value == this._string) {
        return false;
      }
      this._string = value;
      this._value = 1;
    } else if (super.setValue(value)) {
      this._string = null;
    } else {
      return false;
    }
    return true;
  }

  reset(goal?: string) {
    if (goal) {
      this._toString = createInterpolator({
        output: [this.getValue(), goal],
      });
    }
    this._value = 0;
    super.reset();
  }
}

/** An array of animated nodes */
class AnimatedArray<
  T extends ReadonlyArray<Value> = Value[]
> extends AnimatedObject {
  protected declare source: Source;
  constructor(source: T) {
    super(source);
  }

  /** @internal */
  static create<T extends ReadonlyArray<Value>>(source: T) {
    return new AnimatedArray(source);
  }

  getValue(): T {
    return this.source.map((node) => node.getValue()) as any;
  }

  setValue(source: T) {
    const payload = this.getPayload();
    // Reuse the payload when lengths are equal.
    if (source.length == payload.length) {
      return payload.map((node, i) => node.setValue(source[i])).some(Boolean);
    }
    // Remake the payload when length changes.
    super.setValue(source.map(makeAnimated));
    return true;
  }
}

function makeAnimated(value: any) {
  const nodeType = isAnimatedString(value) ? AnimatedString : AnimatedValue;
  return nodeType.create(value);
}

export function getAnimatedState(props: any, host: HostConfig): AnimatedState {
  const dependencies = new Set<FluidValue>();
  TreeContext.dependencies = dependencies;

  // Search the style for dependencies.
  if (props.style)
    props = {
      ...props,
      style: host.createAnimatedStyle(props.style),
    };

  // Search the props for dependencies.
  props = new AnimatedObject(props);

  TreeContext.dependencies = null;
  return [props, dependencies];
}

// Not all strings can be animated (eg: {display: "none"})
export function isAnimatedString(value: unknown): value is string {
  return (
    is.str(value) &&
    (value[0] == "#" ||
      /\d/.test(value) ||
      // Do not identify a CSS variable as an AnimatedString if its SSR
      (!isSSR() && cssVariableRegex.test(value)) ||
      value in (G_colors || {}))
  );
}

type AnimatedType<T = any> = Function & {
  create: (
    from: any,
    goal?: any
  ) => T extends ReadonlyArray<number | string>
    ? AnimatedArray<T>
    : AnimatedValue<T>;
};

/** Return the `Animated` node constructor for a given value */
export function getAnimatedType(value: any): AnimatedType {
  const parentNode = getAnimated(value);
  return parentNode
    ? (parentNode.constructor as any)
    : is.arr(value)
    ? AnimatedArray
    : isAnimatedString(value)
    ? AnimatedString
    : AnimatedValue;
}

// useOnce hook
const emptyDeps: any[] = [];

export const useOnce = (effect: EffectCallback) => useEffect(effect, emptyDeps);

// useIsMounted hook
const useIsMounted = () => {
  const isMounted = useRef(false);
  useIsomorphicLayoutEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

// useForceUpdate hook
/** Return a function that re-renders this component, if still mounted */
export function useForceUpdate() {
  const update = useState<any>()[1];
  const isMounted = useIsMounted();

  return () => {
    if (isMounted.current) {
      update(Math.random());
    }
  };
}

export default {}; // for rspress build
