import { forwardRef, useCallback, useEffect, useRef, Ref } from "react";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect/index";
import {
  is,
  each,
  eachProp,
  toArray,
  addFluidObserver,
  removeFluidObserver,
  getAnimatedState,
  hasFluidValue,
  getFluidValue,
  callFluidObservers,
  raf,
  useForceUpdate,
  useOnce,
  Lookup,
  OneOrMore,
  FluidValue,
  FluidEvent,
  HostConfig,
  AnimatedObject,
} from "./shared";

function updateRef<T>(ref: Ref<T>, value: T) {
  if (ref) {
    if (is.fun(ref)) ref(value);
    else (ref as any).current = value;
  }
  return value;
}

class PropsObserver {
  constructor(readonly update: () => void, readonly deps: Set<FluidValue>) {}
  eventObserved(event: FluidEvent) {
    if (event.type == "change") {
      raf.write(this.update);
    }
  }
}

/** The transform-functions
 * (https://developer.mozilla.org/fr/docs/Web/CSS/transform-function)
 * that you can pass as keys to your animated component style and that will be
 * animated. Perspective has been left out as it would conflict with the
 * non-transform perspective style.
 */
const domTransforms = /^(matrix|translate|scale|rotate|skew)/;

// These keys have "px" units by default
const pxTransforms = /^(translate)/;

// These keys have "deg" units by default
const degTransforms = /^(rotate|skew)/;

type Value = number | string;

/** Add a unit to the value when the value is unit-less (eg: a number) */
const addUnit = (value: Value, unit: string): string | 0 =>
  is.num(value) && value !== 0 ? value + unit : value;

/**
 * Checks if the input value matches the identity value.
 *
 *     isValueIdentity(0, 0)              // => true
 *     isValueIdentity('0px', 0)          // => true
 *     isValueIdentity([0, '0px', 0], 0)  // => true
 */
const isValueIdentity = (value: OneOrMore<Value>, id: number): boolean =>
  is.arr(value)
    ? value.every((v) => isValueIdentity(v, id))
    : is.num(value)
    ? value === id
    : parseFloat(value) === id;

type Inputs = ReadonlyArray<Value | FluidValue<Value>>[];
type Transforms = ((value: any) => [string, boolean])[];

/** @internal */
class FluidTransform extends FluidValue<string> {
  protected _value: string | null = null;

  constructor(readonly inputs: Inputs, readonly transforms: Transforms) {
    super();
  }

  get() {
    return this._value || (this._value = this._get());
  }

  protected _get() {
    let transform = "";
    let identity = true;
    each(this.inputs, (input, i) => {
      const arg1 = getFluidValue(input[0]);
      const [t, id] = this.transforms[i](
        is.arr(arg1) ? arg1 : input.map(getFluidValue)
      );
      transform += " " + t;
      identity = identity && id;
    });
    return identity ? "none" : transform;
  }

  // Start observing our inputs once we have an observer.
  protected observerAdded(count: number) {
    if (count == 1)
      each(this.inputs, (input) =>
        each(
          input,
          (value) => hasFluidValue(value) && addFluidObserver(value, this)
        )
      );
  }

  // Stop observing our inputs once we have no observers.
  protected observerRemoved(count: number) {
    if (count == 0)
      each(this.inputs, (input) =>
        each(
          input,
          (value) => hasFluidValue(value) && removeFluidObserver(value, this)
        )
      );
  }

  eventObserved(event: FluidEvent) {
    if (event.type == "change") {
      this._value = null;
    }
    callFluidObservers(this, event);
  }
}

/**
 * This AnimatedStyle will simplify animated components transforms by
 * interpolating all transform function passed as keys in the style object
 * including shortcuts such as x, y and z for translateX/Y/Z
 */
export class AnimatedStyle extends AnimatedObject {
  constructor({ x, y, z, ...style }: Lookup) {
    /**
     * An array of arrays that contains the values (static or fluid)
     * used by each transform function.
     */
    const inputs: Inputs = [];
    /**
     * An array of functions that take a list of values (static or fluid)
     * and returns (1) a CSS transform string and (2) a boolean that's true
     * when the transform has no effect (eg: an identity transform).
     */
    const transforms: Transforms = [];

    // Combine x/y/z into translate3d
    if (x || y || z) {
      inputs.push([x || 0, y || 0, z || 0]);
      transforms.push((xyz: Value[]) => [
        `translate3d(${xyz.map(v => addUnit(v, 'px')).join(',')})`, // prettier-ignore
        isValueIdentity(xyz, 0),
      ]);
    }

    // Pluck any other transform-related props
    eachProp(style, (value, key) => {
      if (key === "transform") {
        inputs.push([value || ""]);
        transforms.push((transform: string) => [transform, transform === ""]);
      } else if (domTransforms.test(key)) {
        delete style[key];
        if (is.und(value)) return;

        const unit = pxTransforms.test(key)
          ? "px"
          : degTransforms.test(key)
          ? "deg"
          : "";

        inputs.push(toArray(value));
        transforms.push(
          key === "rotate3d"
            ? ([x, y, z, deg]: [number, number, number, Value]) => [
                `rotate3d(${x},${y},${z},${addUnit(deg, unit)})`,
                isValueIdentity(deg, 0),
              ]
            : (input: Value[]) => [
                `${key}(${input.map((v) => addUnit(v, unit)).join(",")})`,
                isValueIdentity(input, key.startsWith("scale") ? 1 : 0),
              ]
        );
      }
    });

    if (inputs.length) {
      style.transform = new FluidTransform(inputs, transforms);
    }

    super(style);
  }
}

export const withAnimated = (Component: any, host: HostConfig) => {
  const hasInstance: boolean =
    // Function components must use "forwardRef" to avoid being
    // re-rendered on every animation frame.
    !is.fun(Component) ||
    (Component.prototype && Component.prototype.isReactComponent);

  return forwardRef((givenProps: any, givenRef: Ref<any>) => {
    const instanceRef = useRef<any>(null);

    // The `hasInstance` value is constant, so we can safely avoid
    // the `useCallback` invocation when `hasInstance` is false.
    const ref =
      hasInstance &&
      useCallback(
        (value: any) => {
          instanceRef.current = updateRef(givenRef, value);
        },
        [givenRef]
      );

    const [props, deps] = getAnimatedState(givenProps, host);

    const forceUpdate = useForceUpdate();

    const callback = () => {
      const instance = instanceRef.current;
      if (hasInstance && !instance) {
        // Either this component was unmounted before changes could be
        // applied, or the wrapped component forgot to forward its ref.
        return;
      }

      const didUpdate = instance
        ? host.applyAnimatedValues(instance, props.getValue(true))
        : false;

      // Re-render the component when native updates fail.
      if (didUpdate === false) {
        forceUpdate();
      }
    };

    const observer = new PropsObserver(callback, deps);

    const observerRef = useRef<PropsObserver>();
    useIsomorphicLayoutEffect(() => {
      observerRef.current = observer;

      // Observe the latest dependencies.
      each(deps, (dep) => addFluidObserver(dep, observer));

      return () => {
        // Stop observing previous dependencies.
        if (observerRef.current) {
          each(observerRef.current.deps, (dep) =>
            removeFluidObserver(dep, observerRef.current!)
          );
          raf.cancel(observerRef.current.update);
        }
      };
    });

    useEffect(callback, []);
    // Stop observing on unmount.
    useOnce(() => () => {
      const observer = observerRef.current!;
      each(observer.deps, (dep) => removeFluidObserver(dep, observer));
    });

    const usedProps = host.getComponentProps(props.getValue());
    return <Component {...usedProps} ref={ref} />;
  });
};
