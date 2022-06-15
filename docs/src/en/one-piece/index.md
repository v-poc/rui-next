---
title: OnePiece
---

# OnePiece

`OnePiece` UI display (**experimental status**).

```jsx
<OnePiece scale={1.5} />
```

## Example

Basic usage of OnePiece component.

```jsx live=local
import React from "react";
import { OnePiece } from "experimental";

// Example Styles
import styled from "styled-components";

const ExampleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Example FC
const Example = () => (
  <ExampleContainer>
    <OnePiece
      scale={0.5}
    />
    <br />
    <OnePiece />
    <br />
    <OnePiece
      scale={0.5}
    />
  </ExampleContainer>
);

export default Example;
```

## API

### OnePiece

Properties | Description | Type | Default
-----------|------------|------|--------
| scale | the scale number, optional | number | 1 |
