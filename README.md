# lrud

A React library for managing focus in LRUD applications, A Fork of `@please/lrud`


## Guide

Refer parent Library (https://www.npmjs.com/package/@please/lrud)

### Basic Setup

Render the `FocusRoot` high up in your application's component tree.

```jsx
import { FocusRoot } from '@please/lrud';

export default function App() {
  return (
    <FocusRoot>
      <AppContents />
    </FocusRoot>
  );
}
```

You may then use FocusNode components to create a focusable elements on the page.

```jsx
import { FocusNode } from '@please/lrud';

export default function Profile() {
  return <FocusNode className="profile">Profile</FocusNode>;
}
```

This library automatically moves the focus between the FocusNodes as the user inputs
LRUD commands on their keyboard or remote control.

This behavior can be configured through the props of the FocusNode component. To
learn more about those props, refer to the API documentation below.

### Getting Started

The recommended way to familiarize yourself with this library is to begin by looking at the [examples](#examples). The examples
do a great job at demonstrating the kinds of interfaces you can create with this library using little code.

Once you've checked out a few examples you should be in a better position to read through these API docs!

### FAQ

#### What is LRUD?

LRUD is an acronym that stands for left-right-up-down, and it refers to the directional buttons typically found on remotes. In LRUD systems,
input devices usually also have some kind of "submit" button, and, less commonly, a back button.

## API Reference

This section of the documentation describes the library's named exports.

### `<FocusRoot />`

Serves as the root node of a new focus hierarchy. There should only ever be one `FocusRoot` in each application.

All props are optional.

| Prop            | Type    | Default value  | Description                                                                                             |
| --------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| `orientation`   | string  | `'horizontal'` | Whether the children of the root node are arranged horizontally or vertically.                          |
| `wrapping`      | boolean | `false`        | Set to `true` for the navigation to wrap when the user reaches the start or end of the root's children. |
| `pointerEvents` | boolean | `false`        | Set to `true` to enable pointer events. [Read the guide.](./guides/pointer-events.md) |
| `throttle`      | number  | 0              | Set the throttle wait for the long press of keys                                      |

