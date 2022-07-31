import React from "react";
import { NoticeBar, Icon, Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => {
  const handleBtnClick = () => {
    location.href = "https://nikoni.top/rui-next/";
  };

  return (
    <>
      <Divider contentAlign="left">
        NoticeBar types
      </Divider>
      <NoticeBar
        content="Default type of NoticeBar"
      />
      <br />
      <NoticeBar
        type="alert"
        content="Alert type of NoticeBar"
      />
      <br />
      <NoticeBar
        type="error"
        content="Error type of NoticeBar"
      />
      <br />
      <NoticeBar
        type="info"
        content="Info type of NoticeBar"
      />

      <Divider contentAlign="left">
        Customized NoticeBar
      </Divider>
      <NoticeBar
        type="alert"
        content="NoticeBar react component is able to provide some notice information, this page is about the basic usage of NoticeBar component."
        icon={<Icon type="exclamation-circle" />}
        extra={
          <Icon
            type="ellipsis"
            className="notice-bar-mr"
            onClick={() => handleBtnClick()}
          />
        }
        closeable
      />
    </>
  );
};

export default Example;
