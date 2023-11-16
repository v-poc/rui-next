import React, { useState } from "react";
import {
  Divider,
  Empty,
  Flex,
  NoticeBar,
  Icon,
  Input,
  QRCode,
  Watermark,
  Button,
  Progress,
  Footer,
} from "../../index";
import "./index.less";

// TodoList FC
const TodoList = () => {
  const [taskItem, setTaskItem] = useState("");
  const [tasks, setTasks] = useState([
    {
      text: "Foobar",
      done: false,
    },
    {
      text: "Fizzbuzz",
      done: false,
    },
  ]);

  // get completed count
  const getCompletedCount = () => {
    return tasks.filter((item) => item.done).length;
  };

  // get remaining count
  const getRemainingCount = () => {
    return tasks.length - getCompletedCount();
  };

  // create Task
  const createTask = () => {
    if (!taskItem) {
      return;
    }

    const arr = [...tasks];
    arr.push({
      text: taskItem,
      done: false,
    });

    setTaskItem("");
    setTasks(arr);
  };

  // delete task
  const deleteTask = (index: number) => {
    const arr = [...tasks];
    arr.splice(index, 1);
    setTasks(arr);
  };

  // mark task as completed
  const completeTask = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const checkFlag = e && e.target && e.target.checked;
    const arr = [...tasks];
    arr[index].done = checkFlag;
    setTasks(arr);
  };

  // calc task progress percent
  const taskProgress = tasks.length
    ? Math.round((100 * getCompletedCount()) / tasks.length)
    : 0;

  return (
    <div className="playground-todo-list">
      <div className="main-hd">
        <div className="header">
          <Input
            placeholder="What are you working on?"
            value={taskItem}
            onEnterKeyPress={createTask}
            onChange={(v: string) => setTaskItem(v)}
          />
          <Button
            type="primary"
            inline
            round
            size="small"
            icon="plus"
            disabled={!taskItem}
            onClick={createTask}
          ></Button>
        </div>
        <p className="tasks">Tasks: {tasks.length}</p>
      </div>
      <div className="main-bd">
        <p className="remaining">Remaining: {getRemainingCount()}</p>
        <p className="completed">Completed: {getCompletedCount()}</p>
        <div className="row-flex">
          <Progress
            mode="circle"
            percent={taskProgress}
            size={60}
            trackWidth={6}
          >
            {taskProgress}%
          </Progress>
        </div>
      </div>
      {tasks.length > 0 ? (
        <div className="main-ft">
          {tasks.map((item: any, index: number) => (
            <div key={`row${index}`} className="row">
              <input
                key={`checkbox${index}`}
                type="checkbox"
                id={`checkbox${index}`}
                checked={item.done}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  completeTask(e, index)
                }
              />
              <label
                key={`label${index}`}
                className={`content${item.done ? " label-done" : ""}`}
                htmlFor={`checkbox${index}`}
              >
                {item.text}
              </label>
              <div className="row-flex">
                {item.done && (
                  <Icon key={`checkIcon${index}`} type="check" color="#36C" />
                )}
                <Icon
                  key={`deleteIcon${index}`}
                  type="cross-circle-o"
                  color="#CCC"
                  onClick={() => deleteTask(index)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty message="No result" />
      )}
    </div>
  );
};

// Example FC
const Example = () => {
  const handleBtnClick = () => {
    location.href = "https://nikoni.top/rui-next/";
  };

  return (
    <>
      <div className="playground-watermark">
        <Watermark content="RUI next" fontColor="rgba(0, 0, 0, .06)" />
        <NoticeBar
          type="alert"
          content="This is the playground for RUI.next. Please scan the QR code to access the examples on mobile/tablet device."
          extra={
            <Icon
              type="ellipsis"
              className="playground-mr"
              onClick={handleBtnClick}
            />
          }
          closeable
        />
        <Divider contentAlign="center">
          Todo List with animated progress
        </Divider>
        <TodoList />
        <Divider contentAlign="left">QR Code</Divider>
        <Flex justify="center">
          <QRCode value="https://nikoni.top/rui-next/" border color="#21b8a3" />
        </Flex>
        <Divider contentAlign="right">RUI Playground</Divider>
        <Footer
          label="Released under the MIT License"
          links={[
            { text: "docs", url: "https://nikoni.top/rui-next/" },
            { text: "demos", url: "https://nikoni.top/rui-next/" },
            {
              text: "playground",
              url: "https://nikoni.top/rui-next/components/playground/playground.html",
            },
          ]}
          content="Copyright @ 2021-present RUI.next. Built with Vite & React."
          chips={[
            { content: "react-hooks" },
            { content: "vite 5" },
            { content: "typescript" },
          ]}
        />
      </div>
    </>
  );
};

export default Example;
