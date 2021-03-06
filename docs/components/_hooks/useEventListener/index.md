---
title: useEventListener
---

# useEventListener

Hooks for addEventListener.

```ts
useEventListener(
  eventName: string,
  handler: Function,
  options?: Options
);
```

## API

### useEventListener - Property

| Property | Description | type | default |
|---------|----------|------------------------|--------|
| eventName | Event name | `string` | -      |
| handler | Handle function | `Function` | -      |
| options | More options(optional) | `Options` |   -   |

### useEventListener - Options

| Property    | Description     | type                   | default |
|---------|----------|------------------------|--------|
| target | DOM element or Ref Object | `(() => HTMLElement)` \| `HTMLElement` \| `React.MutableRefObject` \| `Window` \| `Document` | `window` |
| capture | Optional, a Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.	 | `boolean` |    `false`   |
| once | Optional, a Boolean indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked.	 | `boolean` |    `false`   |
| passive | Optional, a Boolean, if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning.	 | `boolean` |    `false`   |
