---
title: CheckList
---

# CheckList

`CheckList` is implemented based on `List`, which is a list that could be checked, also supports two kinds of modes (`default` and `card`).

```jsx
<CheckList defaultValue={["A"]}>
  <CheckList.Item value="A">Item A</CheckList.Item>
  <CheckList.Item value="B">Item B</CheckList.Item>
</CheckList>
```

## Example

Basic usage of CheckList component.

```jsx live=local
import React from "react";
import { CheckList } from "rui-next";
import { logInfo } from "experimental";

// Example Styles
import styled from "styled-components";

const ExampleContainer = styled.div`
  .sub-title {
    color: #888;
    font-size: 14px;
    padding: 30px 0 18px 0;
  }

  .sub-title:first-child {
    padding-top: 0;
  }

  .card-wrapper {
    padding: 10px 0;
    background-color: #EEE;

    .r-list-item-content-main {
      user-select: none;
    }
  }
`;

// Example FC
const Example = () => (
  <ExampleContainer>
    <div className="sub-title">Card mode (the 2nd item is checked by default)</div>
    <div className="card-wrapper">
      <CheckList
        defaultValue={[1]}
        mode="card"
      >
        {new Array(5).fill("").map((item, i) => {
          const isDisabled = i === 2;
          const isReadOnly = i === 3;
          return (
            <CheckList.Item
              key={`basic${i}`}
              value={i}
              disabled={isDisabled}
              readOnly={isReadOnly}
              onClick={() => logInfo(`Click item - Content ${i + 1}`)}
            >
              {`Content ${i + 1}`}{isDisabled ? " (disabled)" : isReadOnly ? " (readonly)" : ""}
            </CheckList.Item>
          );
        })}
      </CheckList>
    </div>
  </ExampleContainer>
);

export default Example;
```

## API

### CheckList

Properties | Description | Type | Default
-----------|-------------|------|--------
| value        | The selected items                         | `string[]`                  | `[]` |
| defaultValue | The default items                          | `string[]`                  | `[]` |
| onChange     | Triggered when the option changes          | `(value: string[]) => void` | - |
| multiple     | Whether to allow multiple selection or not | `boolean`                   | `false` |
| activeIcon   | The icon displayed when selected           | `ReactNode`                 | `<Icon type="check" />` |
| readOnly     | Is the check list item readonly            | `boolean`                   | `false` |
| disabled     | Is the check list disabled                 | `boolean`                   | `false` |

### CheckList.Item

Properties | Description | Type | Default
-----------|-------------|------|--------
| value    | The option value                | `string`  | - |
| readOnly | Is the check list item readonly | `boolean` | `false` |
| disabled | Is the check list item disabled | `boolean` | `false` |
