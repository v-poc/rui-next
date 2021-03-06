---
title: List
---

# List

`List` supports two kinds of modes (`default` and `card`).

```jsx
<List>
  <List.Item>content</List.Item>
</List>
```

## Example

Basic usage of List component.

```jsx live=local
import React from "react";
import { List, Icon } from "rui-next";
import { logInfo } from "experimental";

const arrUsers = [
  {
    index: 0,
    avatar: 'https://nikoni.top/images/others/img01.png',
    name: 'Sara Visto',
    desc: 'Animi eius expedita',
  },
  {
    index: 1,
    avatar: 'https://nikoni.top/images/others/img02.png',
    name: 'Edith Koen',
    desc: 'Commodi earum exercitationem id numquam visto',
  },
  {
    index: 2,
    avatar: 'https://nikoni.top/images/others/img12.png',
    name: 'Marco Gregg',
    desc: 'Ab animi cumque eveniet ex harum nam odio',
  },
];

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

  .list-card-wrapper {
    padding: 10px 0;
    background-color: #EEE;
  }

  img.list-avatar-item {
    margin: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }
`;

// Example FC
const Example = () => (
  <ExampleContainer>
    <div className="sub-title">Default mode</div>
    <List>
      {new Array(4).fill("").map((item, i) => (
        <List.Item
          key={`basic${i}`}
        >
          {`Content ${i + 1}`}
        </List.Item>
      ))}
    </List>

    <div className="sub-title">Card mode</div>
    <div className="list-card-wrapper">
      <List
        mode="card"
      >
        {new Array(3).fill("").map((item, i) => (
          <List.Item
            key={`card${i}`}
            title={`Content title ${i + 1}`}
            onClick={() => logInfo(`Click item ${i + 1}`)}
          >
            {`Content information ${i + 1}`}
          </List.Item>
        ))}
      </List>
    </div>

    <div className="sub-title">With icon and disabled state</div>
    <List>
      <List.Item
        prefix={<Icon type="voice" />}
        onClick={() => logInfo("Click voice item")}
      >
        Voice item
      </List.Item>
      <List.Item
        prefix={<Icon type="info-circle" />}
        disabled
      >
        Info item
      </List.Item>
    </List>

    <div className="sub-title">Users list</div>
    <List>
      {arrUsers.map((item, i) => {
        const { index, avatar, name, desc } = item;
        const renderImage = <img className="list-avatar-item" src={avatar} />;
        return (
          <List.Item
            key={`user${index}`}
            prefix={renderImage}
            description={desc}
            onClick={() => logInfo(`name: ${name}, description: ${desc}`)}
          >
            {name}
          </List.Item>
        )
      })}
    </List>
  </ExampleContainer>
);

export default Example;
```

## API

### List

Properties | Description | Type | Default
-----------|-------------|------|--------
| mode | Support two modes: default and card. | `'default' \| 'card'` | `'default'` |

### List.Item

Properties | Description | Type | Default
-----------|-------------|------|--------
| title | The title area in the upper middle of the list item. | `ReactNode` | - |
| children | The main content area in the middle of the list item. | `ReactNode` | - |
| description | The description area in the lower middle of the list item. | `ReactNode` | - |
| prefix | The left area of the list item. | `ReactNode` | - |
| extra | The right area of the list item. | `ReactNode` | - |
| clickable | Whether the list item could be clickable. | `boolean` | Defaults to `true` when the `onClick` prop is present, otherwise defaults to `false` |
| arrow | Whether to show the arrow icon on the right side, also supports passing `ReactNode` to customize the icon. | `boolean \| ReactNode` | same as `clickable` |
| disabled | Whether the list item could be disabled. | `boolean` | `false` |
| onClick | The click event of the list item. When the `onClick` property is passed on, the list item will display click effect. | `(e: React.MouseEvent) => void` | - |
