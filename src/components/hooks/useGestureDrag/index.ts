/*
 * Inspired by @use-gesture | MIT License (https://github.com/pmndrs/use-gesture)
 */
import React from "react";

/**
 * types / interfaces
 */
type IngKey = "dragging" | "wheeling" | "moving" | "hovering" | "scrolling" | "pinching";

type Target = EventTarget | React.RefObject<EventTarget>;

type Vector2 = [number, number];

type WebKitGestureEvent = PointerEvent & { scale: number; rotation: number };

type SharedGestureState = {
  // True if the element is being dragged.
  dragging?: boolean;
  // True if the element is being wheeled.
  wheeling?: boolean;
  // True if the element is being moved.
  moving?: boolean;
  // True if the element is being hovered.
  hovering?: boolean;
  // True if the element is being scrolled.
  scrolling?: boolean;
  // True if the element is being pinched.
  pinching?: boolean;
  // Number of fingers touching the screen.
  touches: number;
  // True when the main mouse button or touch is pressed.
  pressed: boolean;
  // Alias for pressed.
  down: boolean;
  // True if the document is in lock mode.
  locked: boolean;
  // Indicates which buttons are pressed.
  buttons: number;
  // True when the Shift key is pressed.
  shiftKey: boolean;
  // True when the Alt key is pressed.
  altKey: boolean;
  // True when the Meta key is pressed.
  metaKey: boolean;
  // True when the Control key is pressed.
  ctrlKey: boolean;
};

type CommonGestureState = {
  _active: boolean
  _blocked: boolean
  _force: boolean
  _step: [false | number, false | number]
  _movementBound: [false | number, false | number]
  _values: Vector2
  _initial: Vector2
  _movement: Vector2
  _distance: Vector2
  _direction: Vector2
  _delta: Vector2
  _bounds: [Vector2, Vector2]
  /**
   * The event triggering the gesture.
   */
  event: UIEvent
  /**
   * The event target.
   */
  target: EventTarget
  /**
   * The event current target.
   */
  currentTarget: EventTarget
  /**
   * True when the gesture is intentional (passed the threshold).
   */
  intentional: boolean
  /**
   * Cumulative distance of the gesture. Deltas are summed with their absolute
   * values.
   */
  distance: Vector2
  /**
   * Displacement of the current gesture.
   */
  movement: Vector2
  /**
   * Difference between the current movement and the previous movement.
   */
  delta: Vector2
  /**
   * Cumulative displacements of all gestures (sum of all movements triggered
   * by the handler)
   */
  offset: Vector2
  /**
   * Offset when the gesture started.
   */
  lastOffset: Vector2
  /**
   * Velocity vector.
   */
  velocity: Vector2
  /**
   * Current raw values of the gesture. Can be coordinates or distance / angle
   * depending on the gesture.
   */
  values: Vector2
  /**
   * Raw values when the gesture started.
   */
  initial: Vector2
  /**
   * Direction per axis. `-1` when going down, `1` when going up, `0` when still.
   */
  direction: Vector2
  /**
   * Bound overflow per axis. `-1` when overflowing bounds to the left/top, `1` when overflowing bounds to the right/bottom.
   */
  overflow: Vector2
  /**
   * True when it's the first event of the active gesture.
   */
  first: boolean
  /**
   * True when it's the last event of the active gesture.
   */
  last: boolean
  /**
   * True when the gesture is active.
   */
  active: boolean
  /**
   * The timestamp (ms) of when the gesture started.
   */
  startTime: number
  /**
   * The timestamp (ms) of the current event.
   */
  timeStamp: number
  /**
   * Elapsed time (ms) of the current gesture.
   */
  elapsedTime: number
  /**
   * Event type.
   */
  type: string
  /**
   * Value returned by your handler on its previous run.
   */
  memo?: any
  /**
   * The arguments passed to the bind function (only relevant in React when
   * using `<div {...bind(someArgument)} />`)
   */
  args?: any
};

type CoordinatesState = CommonGestureState & {
  // The initial axis (x or y) of the gesture.
  axis: "x" | "y" | undefined;
  // Pointer coordinates (alias to values)
  xy: Vector2;
};

type DragState = CoordinatesState & {
  _pointerId?: number;
  _pointerActive: boolean;
  _keyboardActive: boolean;
  _preventScroll: boolean;
  _delayed: boolean;
  /**
   * True when the drag gesture has been canceled by the `cancel` function.
   */
  canceled: boolean;
  /**
   * Function that can be called to cancel the drag.
   */
  cancel(): void;
  /**
   * True if the drag gesture is recognized as a tap (ie when the displacement
   * is lower than 3px per axis).
   */
  tap: boolean;
  /**
   * [swipeX, swipeY] is [0, 0] if no swipe detected, -1 or 1 otherwise.
   */
  swipe: Vector2;
};

interface PinchState extends CommonGestureState {
  _pointerEvents: Map<number, PointerEvent>;
  _touchIds: [] | [number, number];
  // Distance and angle raw values (alias to values).
  da: Vector2;
  // The initial axis (scale or angle) of the gesture.
  axis: "scale" | "angle" | undefined;
  // Coordinates of the center of touch events, or the cursor when using wheel to pinch.
  origin: Vector2;
  // The number of full rotation the current gesture has performed.
  turns: number;
  // True when the pinch gesture has been canceled by the `cancel` function.
  canceled: boolean;
  // Function that can be called to cancel the pinch.
  cancel(): void;
};

type EventTypes = {
  drag: PointerEvent | TouchEvent | MouseEvent | KeyboardEvent;
  wheel: WheelEvent;
  scroll: UIEvent;
  move: PointerEvent;
  hover: PointerEvent;
  pinch: PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent;
};

interface State {
  shared: SharedGestureState;
  drag?: DragState & { event: EventTypes["drag"] };
  wheel?: CoordinatesState & { event: EventTypes["wheel"] };
  scroll?: CoordinatesState & { event: EventTypes["scroll"] };
  move?: CoordinatesState & { event: EventTypes["move"] };
  hover?: CoordinatesState & { event: EventTypes["hover"] };
  pinch?: PinchState & { event: EventTypes["pinch"] };
};

type CoordinatesKey = Exclude<GestureKey, "pinch">;

type GenericOptions = {
  // Specify a dom node or ref you want to attach the gesture to.
  target?: Target;
  // Specify which window element the gesture should bind events to
  // (only relevant for the drag gesture).
  window?: EventTarget;
  // customize if you want events to be passive or captured.
  eventOptions?: AddEventListenerOptions;
  // When set to false none of the handlers will be fired.
  enabled?: boolean;
  // Transform movement and offset values. Useful to map your 
  // screen coordinates to custom space coordinates such as a canvas.
  transform?: (v: Vector2) => Vector2;
};

type GestureOptions<T extends GestureKey> = GenericOptions & {
  /**
   * Whether the gesture is enabled.
   */
  enabled?: boolean
  /**
   * The position `offset` will start from.
   */
  from?: Vector2 | ((state: NonNullable<State[T]>) => Vector2)
  /**
   * The handler will fire only when the gesture displacement is greater than the threshold.
   */
  threshold?: number | Vector2
  /**
   * The handler will preventDefault all events when `true`.
   */
  preventDefault?: boolean
  /**
   * Forces the handler to fire even for non intentional displacement (ignores
   * the threshold). In that case, the intentional attribute from state will
   * remain false until the threshold is reached.
   */
  triggerAllEvents?: boolean
  /**
   * The elasticity coefficient of the gesture when going out of bounds. When
   * set to true, the elasticiy coefficient will be defaulted to 0.15
   */
  rubberband?: boolean | number | Vector2
  /**
   * A function that you can use to transform movement and offset values. Useful
   * to map your screen coordinates to custom space coordinates such as a canvas.
   */
  transform?: (v: Vector2) => Vector2
};

type CoordinatesConfig<Key extends CoordinatesKey = CoordinatesKey> = GestureOptions<Key> & {
  // The handler will only trigger if a movement is detected on the specified axis.
  axis?: "x" | "y" | "lock";
  // Limits the gesture `offset` to the specified bounds.
  bounds?: Bounds | ((state: State[Key]) => Bounds);
};

type DragConfig = CoordinatesConfig<"drag"> & {
  // If true, the component won't trigger your drag logic if the user just clicked on the component.
  filterTaps?: boolean;
  /**
   * The maximum total displacement a tap can have
   */
  tapsThreshold?: number;
  /**
   * Set this option to true when using with @react-three/fiber objects.
   */
  /**
   * Limits the gesture `offset` to the specified bounds. Can be a ref or a dom
   * node.
   */
  bounds?: DragBounds | ((state: State["drag"]) => DragBounds);
  pointer?: {
    /**
     * The buttons combination that would trigger the drag. Use `-1` to allow
     * for any button combination to start the drag.
     */
    buttons?: number | number[];
    /**
     * If true, drag will use touch events on touch-enabled devices.
     */
    touch?: boolean;
    /**
     * If true, drag will use touch events on touch-enabled devices, and use
     * mouse events on non touch devices.
     */
    mouse?: boolean;
    /**
     * Doesn't use setPointerCapture when false and delegate drag handling to
     * window
     */
    capture?: boolean;
    /**
     * Will perform a pointer lock when drag starts, and exit pointer lock when
     * drag ends,
     */
    lock?: boolean;
  }
  swipe?: {
    /**
     * The minimum velocity per axis (in pixels / ms) the drag gesture needs to
     * reach before the pointer is released.
     */
    velocity?: number | Vector2;
    /**
     * The minimum distance per axis (in pixels) the drag gesture needs to
     * travel to trigger a swipe. Defaults to 50.
     */
    distance?: number | Vector2;
    /**
     * The maximum duration in milliseconds that a swipe is detected. Defaults
     * to 250.
     */
    duration?: number;
  }
  /**
   * If set, the drag will be triggered after the duration of the delay (in ms).
   * When set to true, delay is defaulted to 250ms.
   */
  preventScroll?: boolean | number;
  /**
   * If set, the drag will allow scrolling in the direction of this axis until
   * the preventScroll duration has elapsed. Defaults to only "y".
   */
  preventScrollAxis?: "x" | "y" | "xy";
  /**
   * If set, the handler will be delayed for the duration of the delay (in ms)
   * — or if the user starts moving. When set to true, delay is defaulted
   * to 180ms.
   */
  delay?: boolean | number;
};

type Bounds = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type PinchBounds = { min?: number; max?: number };

type PinchConfig = GestureOptions<"pinch"> & {
  pointer?: {
    /**
     * If true, pinch will use touch events on touch-enabled devices.
     */
    touch?: boolean
  }
  /**
   * Limits the scale `offset` to the specified bounds.
   */
  scaleBounds?: PinchBounds | ((state: State["pinch"]) => PinchBounds)
  /**
   * Limits the angle `offset` to the specified bounds.
   */
  angleBounds?: PinchBounds | ((state: State["pinch"]) => PinchBounds)
  /**
   * Scales OR rotates when set to "lock".
   */
  axis?: "lock" | undefined
  /**
   * Key that triggers scale when using the wheel. Defaults to `"ctrlKey"`.
   */
  modifierKey?: ModifierKey
};

type DragBounds = Bounds | HTMLElement | React.RefObject<HTMLElement>;

type MoveConfig = CoordinatesConfig<"move"> & MoveAndHoverMouseOnly;

type HoverConfig = MoveAndHoverMouseOnly;

type UserDragConfig = GenericOptions & DragConfig;

type UserGestureConfig = GenericOptions & {
  drag?: DragConfig;
  wheel?: CoordinatesConfig<"wheel">;
  scroll?: CoordinatesConfig<"scroll">;
  move?: MoveConfig;
  pinch?: PinchConfig;
  hover?: { enabled?: boolean } & HoverConfig;
};

type PointerType = "mouse" | "touch" | "pen";

type InternalHandlers = { [Key in GestureKey]?: Handler<Key, any> };

type FullGestureState<Key extends GestureKey> = SharedGestureState & NonNullable<State[Key]>;

type Handler<Key extends GestureKey, EventType = EventTypes[Key]> = (
  state: Omit<FullGestureState<Key>, "event"> & { event: EventType }
) => any | void;

// allows overriding the event type from the returned state in handlers
type AnyHandlerEventTypes = Partial<{
  drag: any;
  wheel: any;
  scroll: any;
  move: any;
  pinch: any;
  hover: any;
} & { [key in NativeHandlersKeys]: any }>;

// if no type is provided in the user generic for a given key
// then return the default EventTypes that key
type check<T extends AnyHandlerEventTypes, Key extends GestureKey> = undefined extends T[Key] ? EventTypes[Key] : T[Key];

type UserHandlers<T extends AnyHandlerEventTypes = EventTypes> = {
  onDrag: Handler<"drag", check<T, "drag">>
  onDragStart: Handler<"drag", check<T, "drag">>
  onDragEnd: Handler<"drag", check<T, "drag">>
  onPinch: Handler<"pinch", check<T, "pinch">>
  onPinchStart: Handler<"pinch", check<T, "pinch">>
  onPinchEnd: Handler<"pinch", check<T, "pinch">>
  onWheel: Handler<"wheel", check<T, "wheel">>
  onWheelStart: Handler<"wheel", check<T, "wheel">>
  onWheelEnd: Handler<"wheel", check<T, "wheel">>
  onMove: Handler<"move", check<T, "move">>
  onMoveStart: Handler<"move", check<T, "move">>
  onMoveEnd: Handler<"move", check<T, "move">>
  onScroll: Handler<"scroll", check<T, "scroll">>
  onScrollStart: Handler<"scroll", check<T, "scroll">>
  onScrollEnd: Handler<"scroll", check<T, "scroll">>
  onHover: Handler<"hover", check<T, "hover">>
};

type ReactDOMAttributes = Omit<
  React.DOMAttributes<EventTarget>,
  "children" | "dangerouslySetInnerHTML" | keyof UserHandlers
>;

type NativeHandlersKeys = keyof ReactDOMAttributes;

type GetEventType<Key extends NativeHandlersKeys> = ReactDOMAttributes[Key] extends
  | React.EventHandler<infer EventType>
  | undefined
  ? EventType
  : UIEvent;

type NativeHandlers<T extends AnyHandlerEventTypes = {}> = {
  [key in NativeHandlersKeys]?: (
    state: State["shared"] & { event: undefined extends T[key] ? GetEventType<key> : T[key]; args: any },
    ...args: any
  ) => void
};

type HookReturnType<Config extends GenericOptions> = Config["target"] extends object
  ? void
  : (...args: any[]) => ReactDOMAttributes;

type GestureKey = Exclude<keyof State, "shared">;

type InternalGestureOptions<Key extends GestureKey = GestureKey> = {
  enabled: boolean
  from: Vector2 | ((state: State[Key]) => Vector2)
  threshold: Vector2
  preventDefault: boolean
  triggerAllEvents: boolean
  rubberband: Vector2
  bounds: [Vector2, Vector2] | ((state: State[Key]) => [Vector2, Vector2])
  hasCustomTransform: boolean
  transform: (v: Vector2) => Vector2
};

type InternalCoordinatesOptions<Key extends CoordinatesKey = CoordinatesKey> = InternalGestureOptions<Key> & {
  axis?: "x" | "y"
  lockDirection: boolean
  axisThreshold: number
};

type InternalDragOptions = Omit<InternalCoordinatesOptions<"drag">, "axisThreshold"> & {
  filterTaps: boolean
  tapsThreshold: number
  pointerButtons: number | number[]
  pointerCapture: boolean
  preventScrollDelay?: number
  preventScrollAxis?: "x" | "y" | "xy"
  pointerLock: boolean
  device: "pointer" | "touch" | "mouse"
  swipe: {
    velocity: Vector2
    distance: Vector2
    duration: number
  }
  delay: number
  axisThreshold: Record<PointerType, number>
};

type ModifierKey = "ctrlKey" | "altKey" | "metaKey" | null;

type InternalGenericOptions = {
  target?: () => EventTarget
  eventOptions: AddEventListenerOptions
  window?: EventTarget
  enabled: boolean
  transform?: (v: Vector2) => Vector2
};

type InternalPinchOptions = InternalGestureOptions<"pinch"> & {
  // When device is undefined, we'll be using wheel to zoom.
  device: "gesture" | "pointer" | "touch" | undefined;
  lockDirection: boolean;
  modifierKey: ModifierKey;
};

type MoveAndHoverMouseOnly = {
  mouseOnly: boolean;
};

type InternalConfig = {
  shared: InternalGenericOptions
  drag?: InternalDragOptions
  wheel?: InternalCoordinatesOptions<"wheel">
  scroll?: InternalCoordinatesOptions<"scroll">
  move?: InternalCoordinatesOptions<"move"> & MoveAndHoverMouseOnly
  hover?: InternalCoordinatesOptions<"hover"> & MoveAndHoverMouseOnly
  pinch?: InternalPinchOptions
};

type Resolver = (x: any, key: string, obj: any) => any;

type ResolverMap = { [k: string]: Resolver | ResolverMap | boolean };

type EngineClass<Key extends GestureKey> = {
  new (controller: Controller, args: any[], key: Key): Engine<Key>;
};

type Action = {
  key: GestureKey;
  engine: EngineClass<GestureKey>;
  resolver: ResolverMap;
};

interface Engine<Key extends GestureKey> {
  // Function that some gestures can use to add initilization properties to the state when it is created.
  init?(): void;
  // Setup function that some gestures can use to set additional properties of the state when the gesture starts.
  setup?(): void;
  // Function used by some gestures to determine the intentionality of a movement depending on thresholds.
  // The intent function can change the `state._active` or `state._blocked` flags if the gesture isn't intentional.
  axisIntent?(event?: UIEvent): void;
  // Function to restrict to axis
  restrictToAxis?(movement: Vector2): void;
};

/**
 * constants / utils
 */
const KEYS_DELTA_MAP = {
  ArrowRight: (factor = 1) => [10 * factor, 0],
  ArrowLeft: (factor = 1) => [-10 * factor, 0],
  ArrowUp: (factor = 1) => [0, -10 * factor],
  ArrowDown: (factor = 1) => [0, 10 * factor],
};
 
const EVENT_TYPE_MAP: any = {
  pointer: { start: "down", change: "move", end: "up" },
  mouse: { start: "down", change: "move", end: "up" },
  touch: { start: "start", change: "move", end: "end" },
  gesture: { start: "start", change: "change", end: "end" },
};

const DEFAULT_DRAG_AXIS_THRESHOLD: Record<PointerType, number> = { mouse: 0, touch: 0, pen: 8 };

const EngineMap = new Map<GestureKey, EngineClass<any>>();

const ConfigResolverMap = new Map<GestureKey, ResolverMap>();
 
const sharedConfigResolver = {
  target(value: Target) {
    if (value) {
      return () => ("current" in value ? value.current : value);
    }
    return undefined;
  },
  enabled(value = true) {
    return value;
  },
  window(value = SUPPORT.isBrowser ? window : undefined) {
    return value;
  },
  eventOptions({ passive = true, capture = false } = {}) {
    return { passive, capture };
  },
  transform(value: any) {
    return value;
  },
};

const isBrowser = typeof window !== "undefined" && window.document && window.document.createElement;

function supportsTouchEvents(): boolean {
  return isBrowser && "ontouchstart" in window;
};

function isTouchScreen(): boolean {
  return supportsTouchEvents() || (isBrowser && window.navigator.maxTouchPoints > 1);
};

function supportsPointerEvents(): boolean {
  return isBrowser && "onpointerdown" in window;
};

function supportsPointerLock(): boolean {
  return isBrowser && "exitPointerLock" in window.document;
};

function supportsGestureEvents(): boolean {
  try { // @ts-ignore
    return "constructor" in GestureEvent;
  } catch (e) {
    return false;
  }
};

const SUPPORT = {
  isBrowser,
  gesture: supportsGestureEvents(),
  touch: isTouchScreen(),
  touchscreen: isTouchScreen(),
  pointer: supportsPointerEvents(),
  pointerLock: supportsPointerLock(),
};

const V = {
  toVector<T>(v: T | [T, T] | undefined, fallback?: T | [T, T]): [T, T] {
    if (v === undefined) v = fallback as T | [T, T];
    return Array.isArray(v) ? v : [v, v];
  },
  add(v1: Vector2, v2: Vector2): Vector2 {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  },
  sub(v1: Vector2, v2: Vector2): Vector2 {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  },
  addTo(v1: Vector2, v2: Vector2) {
    v1[0] += v2[0];
    v1[1] += v2[1];
  },
  subTo(v1: Vector2, v2: Vector2) {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
  }
};

function setupGesture(ctrl: Controller, gestureKey: GestureKey) {
  ctrl.gestures.add(gestureKey);
  ctrl.gestureEventStores[gestureKey] = new EventStore(ctrl);
  ctrl.gestureTimeoutStores[gestureKey] = new TimeoutStore();
};

function resolveGestures(ctrl: Controller, internalHandlers: InternalHandlers) {
  // make sure hover handlers are added first to prevent bugs such as #322
  // where the hover pointerLeave handler is removed before the move
  // pointerLeave, which prevents hovering: false to be fired.
  if (internalHandlers.drag) setupGesture(ctrl, "drag");
  if (internalHandlers.wheel) setupGesture(ctrl, "wheel");
  if (internalHandlers.scroll) setupGesture(ctrl, "scroll");
  if (internalHandlers.move) setupGesture(ctrl, "move");
  if (internalHandlers.pinch) setupGesture(ctrl, "pinch");
  if (internalHandlers.hover) setupGesture(ctrl, "hover");
};

const bindToProps = (props: any, eventOptions: AddEventListenerOptions, withPassiveOption: boolean) =>
(
  device: string,
  action: string,
  handler: (event: any) => void,
  options: AddEventListenerOptions = {},
  isNative = false
) => {
  const capture = options.capture ?? eventOptions.capture;
  const passive = options.passive ?? eventOptions.passive;
  // a native handler is already passed as a prop like "onMouseDown"
  let handlerProp = isNative ? device : toHandlerProp(device, action, capture);
  if (withPassiveOption && passive) handlerProp += "Passive";
  props[handlerProp] = props[handlerProp] || [];
  props[handlerProp].push(handler);
};

function resolveWith<T extends { [k: string]: any }, V extends { [k: string]: any }>(
  config: Partial<T> = {},
  resolvers: ResolverMap
): V {
  const result: any = {};

  for (const [key, resolver] of Object.entries(resolvers)) {
    switch (typeof resolver) {
      case "function": // @ts-ignore
        if (import.meta.env.DEV) {
          const r = resolver.call(result, config[key], key, config);
          // prevents deprecated resolvers from applying in dev mode
          if (!Number.isNaN(r)) result[key] = r;
        } else {
          result[key] = resolver.call(result, config[key], key, config);
        }
        break;
      case "object":
        result[key] = resolveWith(config[key], resolver);
        break;
      case "boolean":
        if (resolver) result[key] = config[key];
        break;
    }
  }

  return result;
};

function parse(config: UserGestureConfig, gestureKey?: GestureKey): InternalConfig {
  const { target, eventOptions, window, enabled, transform, ...rest } = config as any

  const _config: any = {
    shared: resolveWith({ target, eventOptions, window, enabled, transform }, sharedConfigResolver)
  }

  if (gestureKey) {
    const resolver = ConfigResolverMap.get(gestureKey)!
    _config[gestureKey] = resolveWith({ shared: _config.shared, ...rest }, resolver)
  } else {
    for (const key in rest) {
      const resolver = ConfigResolverMap.get(key as GestureKey)!

      if (resolver) {
        _config[key] = resolveWith({ shared: _config.shared, ...rest[key] }, resolver) // @ts-ignore
      } else if (import.meta.env.DEV) {
        if (!["drag", "pinch", "scroll", "wheel", "move", "hover"].includes(key)) {
          if (key === "domTarget") {
            throw Error(`"domTarget" option has been renamed to "target".`)
          }
          console.warn(
            `Unknown config key "${key}" was used. Please read the documentation for further information.`
          )
        }
      }
    }
  }
  return _config
};

function call<T>(v: T | ((...args: any[]) => T), ...args: any[]): T {
  if (typeof v === "function") { // @ts-ignore
    return v(...args);
  } else {
    return v;
  }
};

function chain(...fns: Function[]): Function {
  if (fns.length === 0) return function() {};
  if (fns.length === 1) return fns[0];

  return function (this: any) {
    let result;
    for (const fn of fns) {
      result = fn.apply(this, arguments) || result;
    }
    return result;
  }
};

function persistEvent(event: React.PointerEvent | PointerEvent) {
  "persist" in event && typeof event.persist === "function" && event.persist();
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(v, max));
};

function rubberband(distance: number, dimension: number, constant: number) {
  if (dimension === 0 || Math.abs(dimension) === Infinity) return Math.pow(distance, constant * 5);
  return (distance * dimension * constant) / (dimension + constant * distance);
};

function rubberbandIfOutOfBounds(position: number, min: number, max: number, constant = 0.15) {
  if (constant === 0) return clamp(position, min, max);
  if (position < min) return -rubberband(min - position, max - min, constant) + min;
  if (position > max) return +rubberband(position - max, max - min, constant) + max;
  return position;
};

function computeRubberband(bounds: [Vector2, Vector2], [Vx, Vy]: Vector2, [Rx, Ry]: Vector2): Vector2 {
  const [[X0, X1], [Y0, Y1]] = bounds;
  return [rubberbandIfOutOfBounds(Vx, X0, X1, Rx), rubberbandIfOutOfBounds(Vy, Y0, Y1, Ry)];
};

function getEventDetails(event: any) {
  const payload: any = {};
  if ("buttons" in event) {
    payload.buttons = event.buttons;
  }
  if ("shiftKey" in event) {
    const { shiftKey, altKey, metaKey, ctrlKey } = event;
    Object.assign(payload, { shiftKey, altKey, metaKey, ctrlKey });
  }
  return payload;
};

function selectAxis([dx, dy]: Vector2, threshold: number) {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx > absDy && absDx > threshold) {
    return "x";
  }
  if (absDy > absDx && absDy > threshold) {
    return "y";
  }
  return undefined;
};

function capitalize(string: string) {
  if (!string) return "";
  return string[0].toUpperCase() + string.slice(1);
};

function toHandlerProp(device: string, action = "", capture: boolean = false) {
  const deviceProps = EVENT_TYPE_MAP[device];
  const actionKey = deviceProps ? deviceProps[action] || action : action;
  return "on" + capitalize(device) + capitalize(actionKey) + (capture ? "Capture" : "");
};

function parseProp(prop: string) {
  let eventKey = prop.substring(2).toLowerCase();
  const passive = !!~eventKey.indexOf("passive");
  if (passive) eventKey = eventKey.replace("passive", "");

  const captureKey = ["gotpointercapture", "lostpointercapture"].includes(eventKey) ? "capturecapture" : "capture";
  // capture = true
  const capture = !!~eventKey.indexOf(captureKey);
  // pointermovecapture => pointermove
  if (capture) eventKey = eventKey.replace("capture", "");
  return { device: eventKey, capture, passive };
};

function toDomEventType(device: string, action = "") {
  const deviceProps = EVENT_TYPE_MAP[device];
  const actionKey = deviceProps ? deviceProps[action] || action : action;
  return device + actionKey;
};

function isTouch(event: UIEvent) {
  return "touches" in event;
};

function getPointerType(event: UIEvent): PointerType {
  if (isTouch(event)) return "touch";
  if ("pointerType" in event) return (event as PointerEvent).pointerType as PointerType;
  return "mouse";
};

function getTouchList(event: TouchEvent) {
  return event.type === "touchend" || event.type === "touchcancel" ? event.changedTouches : event.targetTouches;
};

function getValueEvent<EventType extends TouchEvent | PointerEvent>(
  event: EventType
): EventType extends TouchEvent ? Touch : PointerEvent {
  return (isTouch(event) ? getTouchList(event as TouchEvent)[0] : event) as any;
};

function getCurrentTargetTouchList(event: TouchEvent) {
  return Array.from(event.touches).filter(
    (e) => e.target === event.currentTarget || (event.currentTarget as Node)?.contains?.(e.target as Node)
  );
};

function touchIds(event: TouchEvent) {
  return getCurrentTargetTouchList(event).map((touch) => touch.identifier);
};

function pointerId(event: PointerEvent | TouchEvent) {
  const valueEvent = getValueEvent(event);
  return isTouch(event) ? (valueEvent as Touch).identifier : (valueEvent as PointerEvent).pointerId;
};

function pointerValues(event: PointerEvent | TouchEvent): Vector2 {
  const valueEvent = getValueEvent(event);
  return [valueEvent.clientX, valueEvent.clientY];
};

const identity = (v: Vector2) => v;

const commonConfigResolver = {
  enabled(value = true) {
    return value;
  },
  preventDefault(value = false) {
    return value;
  },
  triggerAllEvents(value = false) {
    return value;
  },
  rubberband(value: number | boolean | Vector2 = 0): Vector2 {
    switch (value) {
      case true:
        return [0.15, 0.15];
      case false:
        return [0, 0];
      default:
        return V.toVector(value);
    }
  },
  from(value: number | Vector2 | ((s: State) => Vector2)) {
    if (typeof value === "function") return value;
    // eslint-disable-next-line eqeqeq
    if (value != null) return V.toVector(value);
  },
  transform(this: InternalGestureOptions, value: any, _k: string, config: { shared: GenericOptions }) {
    const transform = value || config.shared.transform;
    this.hasCustomTransform = !!transform; // @ts-ignore
    if (import.meta.env.DEV) {
      const originalTransform = transform || identity;
      return (v: Vector2) => {
        const r = originalTransform(v);
        if (!isFinite(r[0]) || !isFinite(r[1])) {
          console.warn(`config.transform() must produce a valid result, but it was: [${r[0]},${[1]}]`);
        }
        return r;
      }
    }
    return transform || identity;
  },
  threshold(value: any) {
    return V.toVector(value, 0);
  }
}
// @ts-ignore
if (import.meta.env.DEV) {
  Object.assign(commonConfigResolver, {
    domTarget(value: any) {
      if (value !== undefined) {
        throw Error(`"domTarget" option has been renamed to "target".`);
      }
      return NaN;
    },
    lockDirection(value: any) {
      if (value !== undefined) {
        throw Error(
          `"lockDirection" option has been merged with "axis". Use it as in { axis: "lock" }`
        );
      }
      return NaN;
    },
    initial(value: any) {
      if (value !== undefined) {
        throw Error(`"initial" option has been renamed to "from".`);
      }
      return NaN;
    }
  });
}

// coordinates config resolver
const coordinatesConfigResolver = {
  ...commonConfigResolver,
  axis(
    this: InternalCoordinatesOptions,
    _v: any,
    _k: string,
    { axis }: CoordinatesConfig
  ): InternalCoordinatesOptions["axis"] {
    this.lockDirection = axis === "lock";
    if (!this.lockDirection) return axis as any;
  },
  axisThreshold(value = 0) {
    return value;
  },
  bounds(
    value: DragBounds | ((state: State) => DragBounds) = {}
  ): (() => EventTarget | null) | HTMLElement | [Vector2, Vector2] {
    if (typeof value === "function") { // @ts-ignore
      return (state: State) => coordinatesConfigResolver.bounds(value(state));
    }

    if ("current" in value) {
      return () => value.current;
    }

    if (typeof HTMLElement === "function" && value instanceof HTMLElement) {
      return value;
    }

    const { left = -Infinity, right = Infinity, top = -Infinity, bottom = Infinity } = value as Bounds;

    return [
      [left, right],
      [top, bottom]
    ];
  }
};

// drag config resolver
const dragConfigResolver = {
  ...coordinatesConfigResolver,
  device(
    this: InternalDragOptions,
    _v: any,
    _k: string,
    { pointer: { touch = false, lock = false, mouse = false } = {} }: DragConfig
  ) {
    this.pointerLock = lock && SUPPORT.pointerLock;
    if (SUPPORT.touch && touch) return "touch";
    if (this.pointerLock) return "mouse";
    if (SUPPORT.pointer && !mouse) return "pointer";
    if (SUPPORT.touch) return "touch";
    return "mouse";
  },
  preventScrollAxis(this: InternalDragOptions, value: "x" | "y" | "xy", _k: string, { preventScroll }: DragConfig) {
    this.preventScrollDelay =
      typeof preventScroll === "number"
        ? preventScroll
        : preventScroll || (preventScroll === undefined && value)
        ? 250 // default prevent scroll delay
        : undefined;
    if (!SUPPORT.touchscreen || preventScroll === false) return undefined;
    return value ? value : preventScroll !== undefined ? "y" : undefined;
  },
  pointerCapture(this: InternalDragOptions, _v: any, _k: string, { pointer: { capture = true, buttons = 1 } = {} }) {
    this.pointerButtons = buttons;
    return !this.pointerLock && this.device === "pointer" && capture;
  },
  threshold(
    this: InternalDragOptions,
    value: number | Vector2,
    _k: string,
    { filterTaps = false, tapsThreshold = 3, axis = undefined }
  ) {
    const threshold = V.toVector(value, filterTaps ? tapsThreshold : axis ? 1 : 0);
    this.filterTaps = filterTaps;
    this.tapsThreshold = tapsThreshold;
    return threshold;
  },
  swipe(
    this: InternalDragOptions,
    { velocity = 0.5, distance = 50, duration = 250 } = {}
  ) {
    return {
      velocity: this.transform(V.toVector(velocity)),
      distance: this.transform(V.toVector(distance)),
      duration
    };
  },
  delay(value: number | boolean = 0) {
    switch (value) {
      case true:
        return 180; // default drag delay
      case false:
        return 0;
      default:
        return value;
    }
  },
  axisThreshold(value: Record<PointerType, number>) {
    if (!value) return DEFAULT_DRAG_AXIS_THRESHOLD;
    return { ...DEFAULT_DRAG_AXIS_THRESHOLD, ...value };
  }
}
// @ts-ignore
if (import.meta.env.DEV) {
  Object.assign(dragConfigResolver, {
    useTouch(value: any) {
      if (value !== undefined) {
        throw Error(
          `"useTouch" option has been renamed to "pointer.touch". Use it as in "{ pointer: { touch: true } }".`
        );
      }
      return NaN;
    },
    experimental_preventWindowScrollY(value: any) {
      if (value !== undefined) {
        throw Error(
          `"experimental_preventWindowScrollY" option has been renamed to "preventScroll".`
        );
      }
      return NaN;
    },
    swipeVelocity(value: any) {
      if (value !== undefined) {
        throw Error(
          `"swipeVelocity" option has been renamed to "swipe.velocity". Use it as in "{ swipe: { velocity: 0.5 } }".`
        );
      }
      return NaN;
    },
    swipeDistance(value: any) {
      if (value !== undefined) {
        throw Error(
          `"swipeDistance" option has been renamed to "swipe.distance". Use it as in "{ swipe: { distance: 50 } }".`
        );
      }
      return NaN;
    },
    swipeDuration(value: any) {
      if (value !== undefined) {
        throw Error(
          `"swipeDuration" option has been renamed to "swipe.duration". Use it as in "{ swipe: { duration: 250 } }".`
        );
      }
      return NaN;
    }
  })
};

function registerAction(action: Action) {
  EngineMap.set(action.key, action.engine);
  ConfigResolverMap.set(action.key, action.resolver);
};

/**
 * EventStore Class
 */
class EventStore {
  private _listeners: (() => void)[] = [];
  private _ctrl: Controller;
  constructor(ctrl: Controller) {
    this._ctrl = ctrl;
  }

  add(
    element: EventTarget,
    device: string,
    action: string,
    handler: (event: any) => void,
    options?: AddEventListenerOptions
  ) {
    const type = toDomEventType(device, action);
    const eventOptions = { ...this._ctrl.config.shared.eventOptions, ...options };
    element.addEventListener(type, handler, eventOptions);
    this._listeners.push(() => element.removeEventListener(type, handler, eventOptions));
  }

  clean() {
    this._listeners.forEach((remove) => remove());
    this._listeners = [];
  }
};

/**
 * TimeoutStore Class
 */
class TimeoutStore {
  private _timeouts = new Map<string, number>();

  add<FunctionType extends (...args: any[]) => any>(
    key: string,
    callback: FunctionType,
    ms = 140,
    ...args: Parameters<FunctionType>
  ) {
    this.remove(key);
    this._timeouts.set(key, window.setTimeout(callback, ms, ...args));
  }

  remove(key: string) {
    const timeout = this._timeouts.get(key);
    if (timeout) window.clearTimeout(timeout);
  }

  clean() {
    this._timeouts.forEach((timeout) => void window.clearTimeout(timeout));
    this._timeouts.clear();
  }
};

/**
 * Controller Class
 */
class Controller {
  /**
   * The list of gestures handled by the Controller.
   */
  public gestures = new Set<GestureKey>();
  /**
   * The event store that keeps track of the config.target listeners.
   */
  private _targetEventStore = new EventStore(this);
  /**
   * Object that keeps track of all gesture event listeners.
   */
  public gestureEventStores: { [key in GestureKey]?: EventStore } = {};
  public gestureTimeoutStores: { [key in GestureKey]?: TimeoutStore } = {};
  public handlers: InternalHandlers = {};
  private nativeHandlers?: NativeHandlers;
  public config = {} as InternalConfig;
  public pointerIds = new Set<number>();
  public touchIds = new Set<number>();
  public state = {
    shared: {
      shiftKey: false,
      metaKey: false,
      ctrlKey: false,
      altKey: false
    }
  } as State;

  constructor(handlers: InternalHandlers) {
    resolveGestures(this, handlers);
  }
  /**
   * Sets pointer or touch ids based on the event.
   */
  setEventIds(event: TouchEvent | PointerEvent) {
    if (isTouch(event)) {
      this.touchIds = new Set(touchIds(event as TouchEvent))
    } else if ("pointerId" in event) {
      if (event.type === "pointerup" || event.type === "pointercancel") this.pointerIds.delete(event.pointerId)
      else if (event.type === "pointerdown") this.pointerIds.add(event.pointerId)
    }
  }
  /**
   * Attaches handlers to the controller.
   */
  applyHandlers(handlers: InternalHandlers, nativeHandlers?: NativeHandlers) {
    this.handlers = handlers;
    this.nativeHandlers = nativeHandlers;
  }
  /**
   * Compute and attaches a config to the controller.
   */
  applyConfig(config: UserGestureConfig, gestureKey?: GestureKey) {
    this.config = parse(config, gestureKey);
  }
  /**
   * Cleans all side effects (listeners, timeouts). When the gesture is
   * destroyed (in React, when the component is unmounted.)
   */
  clean() {
    this._targetEventStore.clean()
    for (const key of this.gestures) {
      this.gestureEventStores[key]!.clean()
      this.gestureTimeoutStores[key]!.clean()
    }
  }
  /**
   * Executes side effects (attaching listeneds to a `config.target`). Ran on each render.
   */
  effect() {
    if (this.config.shared.target) this.bind()
    return () => this._targetEventStore.clean()
  }
  /**
   * The bind function that can be returned by the gesture handler (a hook in React for example.)
   * @param args
   */
  bind(...args: any[]) {
    const sharedConfig = this.config.shared
    const eventOptions = sharedConfig.eventOptions
    const props: any = {}

    let target
    if (sharedConfig.target) {
      target = sharedConfig.target()
      // if target is undefined let's stop
      if (!target) return
    }

    const bindFunction = bindToProps(props, eventOptions, !!target)

    if (sharedConfig.enabled) {
      // Adding gesture handlers
      for (const gestureKey of this.gestures) {
        if (this.config[gestureKey]!.enabled) {
          const Engine = EngineMap.get(gestureKey)! // @ts-ignore
          new Engine(this, args, gestureKey).bind(bindFunction)
        }
      }

      // Adding native handlers
      for (const eventKey in this.nativeHandlers) {
        bindFunction(
          eventKey,
          "", // @ts-ignore
          (event) => this.nativeHandlers[eventKey]({ ...this.state.shared, event, args }),
          undefined,
          true
        )
      }
    }

    // If target isn't set, we return an object that contains gesture handlers
    // mapped to props handler event keys.
    for (const handlerProp in props) {
      props[handlerProp] = chain(...props[handlerProp])
    }

    // When target isn't specified then return hanlder props.
    if (!target) return props

    // When target is specified, then add listeners to the controller target store.
    for (const handlerProp in props) {
      const { device, capture, passive } = parseProp(handlerProp)
      this._targetEventStore.add(target, device, "", props[handlerProp], { capture, passive })
    }
  }
};

/**
 * Engine Class
 */
abstract class Engine<Key extends GestureKey> {
  /**
   * The Controller handling state.
   */
  ctrl: Controller;
  /**
   * The gesture key ("drag" | "pinch" | "wheel" | "scroll" | "move" | "hover")
   */
  readonly key: Key;
  /**
   * The key representing the active state of the gesture in the shared state.
   * ("dragging" | "pinching" | "wheeling" | "scrolling" | "moving" | "hovering")
   */
  abstract readonly ingKey: IngKey;
  /**
   * The arguments passed to the `bind` function.
   */

  /**
   * State prop that aliases state values (`xy` or `da`).
   */
  abstract readonly aliasKey: string;

  args: any[];

  constructor(ctrl: Controller, args: any[], key: Key) {
    this.ctrl = ctrl;
    this.args = args;
    this.key = key;

    if (!this.state) {
      this.state = {} as any;
      this.computeValues([0, 0]);
      this.computeInitial();

      if (this.init) this.init();
      this.reset();
    }
  }
  /**
   * Function implemented by gestures that compute the offset from the state
   * movement.
   */
  abstract computeOffset(): void;
  /**
   * Function implemented by the gestures that compute the movement from the
   * corrected offset (after bounds and potential rubberbanding).
   */
  abstract computeMovement(): void;
  /**
   * Executes the bind function so that listeners are properly set by the
   * Controller.
   */
  abstract bind(
    bindFunction: (
      device: string,
      action: string,
      handler: (event: any) => void,
      options?: AddEventListenerOptions
    ) => void
  ): void;

  /**
   * Shortcut to the gesture state read from the Controller.
   */
  get state() {
    return this.ctrl.state[this.key]!;
  }
  set state(state) {
    this.ctrl.state[this.key] = state;
  }
  /**
   * Shortcut to the shared state read from the Controller
   */
  get shared() {
    return this.ctrl.state.shared;
  }
  /**
   * Shortcut to the gesture event store read from the Controller.
   */
  get eventStore() {
    return this.ctrl.gestureEventStores[this.key]!;
  }
  /**
   * Shortcut to the gesture timeout store read from the Controller.
   */
  get timeoutStore() {
    return this.ctrl.gestureTimeoutStores[this.key]!;
  }
  /**
   * Shortcut to the gesture config read from the Controller.
   */
  get config() {
    return this.ctrl.config[this.key]!;
  }
  /**
   * Shortcut to the shared config read from the Controller.
   */
  get sharedConfig() {
    return this.ctrl.config.shared;
  }
  /**
   * Shortcut to the gesture handler read from the Controller.
   */
  get handler() {
    return this.ctrl.handlers[this.key]!;
  }

  reset() {
    const { state, shared, ingKey, args } = this;
    shared[ingKey] = state._active = state.active = state._blocked = state._force = false;
    state._step = [false, false];
    state.intentional = false;
    state._movement = [0, 0];
    state._distance = [0, 0];
    state._direction = [0, 0];
    state._delta = [0, 0];
    // prettier-ignore
    state._bounds = [[-Infinity, Infinity], [-Infinity, Infinity]];
    state.args = args;
    state.axis = undefined;
    state.memo = undefined;
    state.elapsedTime = 0;
    state.direction = [0, 0];
    state.distance = [0, 0];
    state.overflow = [0, 0];
    state._movementBound = [false, false];
    state.velocity = [0, 0];
    state.movement = [0, 0];
    state.delta = [0, 0];
    state.timeStamp = 0;
  }
  /**
   * Function ran at the start of the gesture.
   */
  start(event: NonNullable<State[Key]>["event"]) {
    const state = this.state;
    const config = this.config;
    if (!state._active) {
      this.reset();
      this.computeInitial();

      state._active = true;
      state.target = event.target!;
      state.currentTarget = event.currentTarget!;
      state.lastOffset = config.from ? call(config.from, state) : state.offset;
      state.offset = state.lastOffset;
    }
    state.startTime = state.timeStamp = event.timeStamp;
  }

  /**
   * Assign raw values to `state._values` and transformed values to
   * `state.values`.
   * @param values
   */
  computeValues(values: Vector2) {
    const state = this.state;
    state._values = values;
    // transforming values into user-defined coordinates
    state.values = this.config.transform(values);
  }

  /**
   * Assign `state._values` to `state._initial` and transformed `state.values` to
   * `state.initial`.
   */
  computeInitial() {
    const state = this.state;
    state._initial = state._values;
    state.initial = state.values;
  }

  /**
   * Computes all sorts of state attributes, including kinematics.
   * @param event
   */
  compute(event?: NonNullable<State[Key]>["event"]) {
    const { state, config, shared } = this
    state.args = this.args

    let dt = 0

    if (event) {
      // sets the shared state with event properties
      state.event = event
      // if config.preventDefault is true, then preventDefault
      if (config.preventDefault && event.cancelable) state.event.preventDefault()
      state.type = event.type
      shared.touches = this.ctrl.pointerIds.size || this.ctrl.touchIds.size
      shared.locked = !!document.pointerLockElement
      Object.assign(shared, getEventDetails(event))
      shared.down = shared.pressed = shared.buttons % 2 === 1 || shared.touches > 0

      // sets time stamps
      dt = event.timeStamp - state.timeStamp
      state.timeStamp = event.timeStamp
      state.elapsedTime = state.timeStamp - state.startTime
    }

    // only compute _distance if the state is active otherwise we might compute it
    // twice when the gesture ends because state._delta wouldn't have changed on the last frame.
    if (state._active) {
      const _absoluteDelta = state._delta.map(Math.abs) as Vector2
      V.addTo(state._distance, _absoluteDelta)
    }

    // let's run intentionality check.
    if (this.axisIntent) this.axisIntent(event)

    // _movement is calculated by each gesture engine
    const [_m0, _m1] = state._movement
    const [t0, t1] = config.threshold

    const { _step, values } = state

    if (config.hasCustomTransform) {
      // When the user is using a custom transform, we're using `_step` to store
      // the first value passing the threshold.
      if (_step[0] === false) _step[0] = Math.abs(_m0) >= t0 && values[0]
      if (_step[1] === false) _step[1] = Math.abs(_m1) >= t1 && values[1]
    } else {
      // `_step` will hold the threshold at which point the gesture was triggered.
      // The threshold is signed depending on which direction triggered it.
      if (_step[0] === false) _step[0] = Math.abs(_m0) >= t0 && Math.sign(_m0) * t0
      if (_step[1] === false) _step[1] = Math.abs(_m1) >= t1 && Math.sign(_m1) * t1
    } // @ts-ignore
    state.intentional = _step[0] !== false || _step[1] !== false

    if (!state.intentional) return

    const movement: Vector2 = [0, 0]

    if (config.hasCustomTransform) {
      const [v0, v1] = values // @ts-ignore
      movement[0] = _step[0] !== false ? v0 - _step[0] : 0 // @ts-ignore
      movement[1] = _step[1] !== false ? v1 - _step[1] : 0
    } else { // @ts-ignore
      movement[0] = _step[0] !== false ? _m0 - _step[0] : 0 // @ts-ignore
      movement[1] = _step[1] !== false ? _m1 - _step[1] : 0
    }

    if (this.restrictToAxis && !state._blocked) this.restrictToAxis(movement)

    const previousOffset = state.offset

    const gestureIsActive = (state._active && !state._blocked) || state.active

    if (gestureIsActive) {
      state.first = state._active && !state.active
      state.last = !state._active && state.active
      state.active = shared[this.ingKey] = state._active

      if (event) {
        if (state.first) {
          if ("bounds" in config) state._bounds = call(config.bounds, state)
          if (this.setup) this.setup()
        }

        state.movement = movement
        this.computeOffset()
      }
    }

    const [ox, oy] = state.offset
    const [[x0, x1], [y0, y1]] = state._bounds
    state.overflow = [ox < x0 ? -1 : ox > x1 ? 1 : 0, oy < y0 ? -1 : oy > y1 ? 1 : 0]

    // _movementBound will store the latest _movement value
    // before it went off bounds.
    state._movementBound[0] = state.overflow[0]
      ? state._movementBound[0] === false
        ? state._movement[0]
        : state._movementBound[0]
      : false

    state._movementBound[1] = state.overflow[1]
      ? state._movementBound[1] === false
        ? state._movement[1]
        : state._movementBound[1]
      : false
    // @ts-ignore
    const rubberband: Vector2 = state._active ? config.rubberband || [0, 0] : [0, 0]
    state.offset = computeRubberband(state._bounds, state.offset, rubberband)
    state.delta = V.sub(state.offset, previousOffset)

    this.computeMovement()
    // before last kinematics delay is 32
    if (gestureIsActive && (!state.last || dt > 32)) {
      state.delta = V.sub(state.offset, previousOffset)
      const absoluteDelta = state.delta.map(Math.abs) as Vector2

      V.addTo(state.distance, absoluteDelta)
      state.direction = state.delta.map(Math.sign) as Vector2
      state._direction = state._delta.map(Math.sign) as Vector2

      if (!state.first && dt > 0) {
        // calculates kinematics unless the gesture starts or ends
        state.velocity = [absoluteDelta[0] / dt, absoluteDelta[1] / dt]
      }
    }
  }
  /**
   * Fires the gesture handler.
   */
  emit() {
    const state = this.state;
    const shared = this.shared;
    const config = this.config;

    if (!state._active) this.clean();

    // we don't trigger the handler if the gesture is blocked or non intentional,
    // unless the `_force` flag was set or the `triggerAllEvents` option was set to true in the config.
    if ((state._blocked || !state.intentional) && !state._force && !config.triggerAllEvents) return;
    // @ts-ignore
    const memo = this.handler({ ...shared, ...state, [this.aliasKey]: state.values });

    // Sets memo to the returned value of the handler (unless it's  undefined)
    if (memo !== undefined) state.memo = memo;
  }
  /**
   * Cleans the gesture timeouts and event listeners.
   */
  clean() {
    this.eventStore.clean();
    this.timeoutStore.clean();
  }
};

/**
 * CoordinatesEngine Class
 */
abstract class CoordinatesEngine<Key extends CoordinatesKey> extends Engine<Key> {
  aliasKey = "xy";

  reset() {
    super.reset();
    this.state.axis = undefined;
  }

  init() {
    this.state.offset = [0, 0];
    this.state.lastOffset = [0, 0];
  }

  computeOffset() {
    this.state.offset = V.add(this.state.lastOffset, this.state.movement);
  }

  computeMovement() {
    this.state.movement = V.sub(this.state.offset, this.state.lastOffset);
  }

  axisIntent(event?: UIEvent) {
    const state = this.state;
    const config = this.config;

    if (!state.axis && event) {
      const threshold =
        typeof config.axisThreshold === "object" ? config.axisThreshold[getPointerType(event)] : config.axisThreshold;

      state.axis = selectAxis(state._movement, threshold);
    }

    // We block the movement if either:
    // - config.lockDirection or config.axis was set but axis isn't detected yet
    // - config.axis was set but is different than detected axis
    state._blocked =
      ((config.lockDirection || !!config.axis) && !state.axis) || (!!config.axis && config.axis !== state.axis);
  }

  restrictToAxis(v: Vector2) {
    if (this.config.axis || this.config.lockDirection) {
      switch (this.state.axis) {
        case "x":
          v[1] = 0;
          break; // [ x, 0 ]
        case "y":
          v[0] = 0;
          break; // [ 0, y ]
      }
    }
  }
};

/**
 * DragEngine Class
 */
class DragEngine extends CoordinatesEngine<"drag"> {
  ingKey = "dragging" as const;

  // generic Engine reset call
  reset(this: DragEngine) {
    super.reset();
    const state = this.state;
    state._pointerId = undefined;
    state._pointerActive = false;
    state._keyboardActive = false;
    state._preventScroll = false;
    state._delayed = false;
    state.swipe = [0, 0];
    state.tap = false;
    state.canceled = false;
    state.cancel = this.cancel.bind(this);
  }

  setup() {
    const state = this.state;

    if (state._bounds instanceof HTMLElement) {
      const boundRect = state._bounds.getBoundingClientRect();
      const targetRect = (state.currentTarget as HTMLElement).getBoundingClientRect();
      const _bounds = {
        left: boundRect.left - targetRect.left + state.offset[0],
        right: boundRect.right - targetRect.right + state.offset[0],
        top: boundRect.top - targetRect.top + state.offset[1],
        bottom: boundRect.bottom - targetRect.bottom + state.offset[1],
      }
      state._bounds = coordinatesConfigResolver.bounds(_bounds) as [Vector2, Vector2];
    }
  }

  cancel() {
    const state = this.state;
    if (state.canceled) return;
    state.canceled = true;
    state._active = false;
    setTimeout(() => {
      // we run compute with no event so that kinematics won't be computed
      this.compute();
      this.emit();
    }, 0);
  }

  setActive() {
    this.state._active = this.state._pointerActive || this.state._keyboardActive;
  }

  // superseeds Engine clean function
  clean() {
    this.pointerClean();
    this.state._pointerActive = false;
    this.state._keyboardActive = false;
    super.clean();
  }

  pointerDown(event: PointerEvent) {
    const config = this.config;
    const state = this.state;

    if (
      event.buttons != null &&
      // If the user submits an array as pointer.buttons, don't start the drag
      // if event.buttons isn't included inside that array.
      (Array.isArray(config.pointerButtons)
        ? !config.pointerButtons.includes(event.buttons)
        : // If the user submits a number as pointer.buttons, refuse the drag if
          // config.pointerButtons is different than `-1` and if event.buttons
          // doesn't match the combination.
          config.pointerButtons !== -1 && config.pointerButtons !== event.buttons)
    )
      return;

    this.ctrl.setEventIds(event);
    // We need to capture all pointer ids so that we can keep track of them when
    // they're released off the target
    if (config.pointerCapture) {
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId);
    }

    if (state._pointerActive) return;

    this.start(event);
    this.setupPointer(event);

    state._pointerId = pointerId(event);
    state._pointerActive = true;

    this.computeValues(pointerValues(event));
    this.computeInitial();

    if (config.preventScrollAxis && getPointerType(event) !== "mouse") {
      // when preventScrollAxis is set we don't consider the gesture active until it's deliberate
      state._active = false;
      this.setupScrollPrevention(event);
    } else if (config.delay > 0) {
      this.setupDelayTrigger(event);
      // makes sure we emit all events when `triggerAllEvents` flag is `true`
      if (config.triggerAllEvents) {
        this.compute(event);
        this.emit();
      }
    } else {
      this.startPointerDrag(event);
    }
  }

  startPointerDrag(event: PointerEvent) {
    const state = this.state;
    state._active = true;
    state._preventScroll = true;
    state._delayed = false;

    this.compute(event);
    this.emit();
  }

  pointerMove(event: PointerEvent) {
    const state = this.state;
    const config = this.config;

    if (!state._pointerActive) return;

    // if the event has the same timestamp as the previous event
    // note that checking type equality is ONLY for tests
    if (state.type === event.type && event.timeStamp === state.timeStamp) return;

    const id = pointerId(event);
    if (state._pointerId !== undefined && id !== state._pointerId) return;
    const _values = pointerValues(event);

    if (document.pointerLockElement === event.target) {
      state._delta = [event.movementX, event.movementY];
    } else {
      state._delta = V.sub(_values, state._values);
      this.computeValues(_values);
    }

    V.addTo(state._movement, state._delta);
    this.compute(event);

    // if the gesture is delayed but deliberate, then we can start it immediately.
    if (state._delayed && state.intentional) {
      this.timeoutStore.remove("dragDelay");
      // makes sure `first` is still true when moving for the first time after a delay.
      state.active = false;
      this.startPointerDrag(event);
      return;
    }

    if (config.preventScrollAxis && !state._preventScroll) {
      if (state.axis) {
        if (state.axis === config.preventScrollAxis || config.preventScrollAxis === "xy") {
          state._active = false;
          this.clean();
          return;
        } else {
          this.timeoutStore.remove("startPointerDrag");
          this.startPointerDrag(event);
          return;
        }
      } else {
        return;
      }
    }

    this.emit();
  }

  pointerUp(event: PointerEvent) {
    this.ctrl.setEventIds(event);
    // We release the pointer id if it has pointer capture
    try {
      if (this.config.pointerCapture && (event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
        // this shouldn't be necessary as it should be automatic when releasing the pointer
        ;(event.target as HTMLElement).releasePointerCapture(event.pointerId);
      }
    } catch { // @ts-ignore
      if (import.meta.env.DEV) {
        console.warn(
          `If you see this message, it's likely that you're using an outdated version of "@react-three/fiber". \nPlease upgrade to the latest version.`
        );
      }
    }

    const state = this.state;
    const config = this.config;

    if (!state._active || !state._pointerActive) return;

    const id = pointerId(event);
    if (state._pointerId !== undefined && id !== state._pointerId) return;

    this.state._pointerActive = false;
    this.setActive();
    this.compute(event);

    const [dx, dy] = state._distance;
    state.tap = dx <= config.tapsThreshold && dy <= config.tapsThreshold;

    if (state.tap && config.filterTaps) {
      state._force = true;
    } else {
      const [dirx, diry] = state.direction;
      const [vx, vy] = state.velocity;
      const [mx, my] = state.movement;
      const [svx, svy] = config.swipe.velocity;
      const [sx, sy] = config.swipe.distance;
      const sdt = config.swipe.duration;

      if (state.elapsedTime < sdt) {
        if (Math.abs(vx) > svx && Math.abs(mx) > sx) state.swipe[0] = dirx;
        if (Math.abs(vy) > svy && Math.abs(my) > sy) state.swipe[1] = diry;
      }
    }

    this.emit();
  }

  pointerClick(event: MouseEvent) {
    if (!this.state.tap) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  setupPointer(event: PointerEvent) {
    const config = this.config;
    const device = config.device; // @ts-ignore
    if (import.meta.env.DEV) {
      try {
        if (device === "pointer" && config.preventScrollDelay === undefined) {
          // @ts-ignore (warning for r3f)
          const currentTarget = "uv" in event ? event.sourceEvent.currentTarget : event.currentTarget;
          const style = window.getComputedStyle(currentTarget);
          if (style.touchAction === "auto") {
            console.warn(
              `The drag target has its "touch-action" style property set to "auto". It is recommended to add 'touch-action: "none"' so that the drag gesture behaves correctly on touch-enabled devices. \nThis message will only show in development mode. It won't appear in production. If this is intended, you can ignore it.`,
              currentTarget
            );
          }
        }
      } catch {
        // ignore
      }
    }

    if (config.pointerLock) {
      ;(event.currentTarget as HTMLElement).requestPointerLock();
    }

    if (!config.pointerCapture) {
      this.eventStore.add(this.sharedConfig.window!, device, "change", this.pointerMove.bind(this));
      this.eventStore.add(this.sharedConfig.window!, device, "end", this.pointerUp.bind(this));
      this.eventStore.add(this.sharedConfig.window!, device, "cancel", this.pointerUp.bind(this));
    }
  }

  pointerClean() {
    if (this.config.pointerLock && document.pointerLockElement === this.state.currentTarget) {
      document.exitPointerLock();
    }
  }

  preventScroll(event: PointerEvent) {
    if (this.state._preventScroll && event.cancelable) {
      event.preventDefault();
    }
  }

  setupScrollPrevention(event: PointerEvent) {
    persistEvent(event);
    // we add window listeners that will prevent the scroll when the user has started dragging
    this.eventStore.add(this.sharedConfig.window!, "touch", "change", this.preventScroll.bind(this), { passive: false });
    this.eventStore.add(this.sharedConfig.window!, "touch", "end", this.clean.bind(this));
    this.eventStore.add(this.sharedConfig.window!, "touch", "cancel", this.clean.bind(this));
    this.timeoutStore.add("startPointerDrag", this.startPointerDrag.bind(this), this.config.preventScrollDelay!, event);
  }

  setupDelayTrigger(event: PointerEvent) {
    this.state._delayed = true;
    this.timeoutStore.add(
      "dragDelay",
      () => {
        // forces drag to start no matter the threshold when delay is reached
        this.state._step = [0, 0]
        this.startPointerDrag(event)
      },
      this.config.delay
    );
  }

  keyDown(event: KeyboardEvent) { // @ts-ignore
    const deltaFn = KEYS_DELTA_MAP[event.key];
    if (deltaFn) {
      const state = this.state;
      const factor = event.shiftKey ? 10 : event.altKey ? 0.1 : 1;
      state._delta = deltaFn(factor);

      this.start(event);
      state._keyboardActive = true;

      V.addTo(state._movement, state._delta);

      this.compute(event);
      this.emit();
    }
  }

  keyUp(event: KeyboardEvent) {
    if (!(event.key in KEYS_DELTA_MAP)) return;

    this.state._keyboardActive = false;
    this.setActive();
    this.compute(event);
    this.emit();
  }

  bind(bindFunction: any) {
    const device = this.config.device;

    bindFunction(device, "start", this.pointerDown.bind(this));

    if (this.config.pointerCapture) {
      bindFunction(device, "change", this.pointerMove.bind(this));
      bindFunction(device, "end", this.pointerUp.bind(this));
      bindFunction(device, "cancel", this.pointerUp.bind(this));
      bindFunction("lostPointerCapture", "", this.pointerUp.bind(this));
    }

    bindFunction("key", "down", this.keyDown.bind(this));
    bindFunction("key", "up", this.keyUp.bind(this));

    if (this.config.filterTaps) {
      bindFunction("click", "", this.pointerClick.bind(this), { capture: true, passive: false });
    }
  }
};

/**
 * utility hook called by all gesture hooks and that will be responsible for the internals.
 * @returns nothing when config.target is set, a binding function when not.
 */
function useRecognizers<Config extends GenericOptions>(
  handlers: InternalHandlers,
  config: Config | {} = {},
  gestureKey?: GestureKey,
  nativeHandlers?: NativeHandlers
): HookReturnType<Config> {
  const ctrl = React.useMemo(() => new Controller(handlers), []);
  ctrl.applyHandlers(handlers, nativeHandlers);
  ctrl.applyConfig(config, gestureKey);

  React.useEffect(ctrl.effect.bind(ctrl));

  React.useEffect(() => {
    return ctrl.clean.bind(ctrl);
  }, []);

  // @ts-ignore When target is undefined we return the bind function of the controller which returns prop handlers.
  if (config.target === undefined) {
    return ctrl.bind.bind(ctrl) as any;
  }
  return undefined as any;
};

/**
 * useGestureDrag hook
 */
export function useGestureDrag<
  EventType = EventTypes["drag"],
  Config extends UserDragConfig = UserDragConfig
>(
  handler: Handler<"drag", EventType>, // the function fired every time the drag gesture updates
  config: Config | {} = {}, // the config object including generic options and drag options
) {
  const dragAction: Action = {
    key: "drag",
    engine: DragEngine as any,
    resolver: dragConfigResolver,
  };
  registerAction(dragAction);
  return useRecognizers({ drag: handler }, config, "drag");
};
