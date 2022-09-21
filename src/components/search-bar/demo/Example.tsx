import React, { useRef } from "react";
import { Button, SearchBar, Divider } from "rui-next";
import { logInfo } from "../../experimental";
import type { SearchBarRef } from "../index";
import "./index.less";

const handleLog = (name: string, v: string) => {
  logInfo(`[${name}] info: ${v}`);
};

// Example FC
const Example = () => {
  const searchBarRef = useRef<SearchBarRef>(null);

  return (
    <div className="search-bar-example-wrapper">
      <Divider contentAlign="left">
        Basic SearchBar with cancel button
      </Divider>
      <SearchBar
        placeholder="Please input content"
        showCancel
      />

      <Divider contentAlign="left">
        Basic SearchBar without cancel button
      </Divider>
      <SearchBar
        placeholder="Please input content"
      />

      <Divider contentAlign="left">
        SearchBar always with cancel button
      </Divider>
      <SearchBar
        placeholder="Please input content"
        showCancel={() => true}
      />

      <Divider contentAlign="left">
        SearchBar with events (refer `RUI-log` in Console log)
      </Divider>
      <SearchBar
        ref={searchBarRef}
        placeholder="Please input content"
        showCancel
        onBlur={() => handleLog("onBlur", "Lose focus")}
        onCancel={() => handleLog("onCancel", "Cancel search")}
        onClear={() => handleLog("onClear", "Clear content")}
        onFocus={() => handleLog("onFocus", "Get focus")}
        onSearch={(v: string) => handleLog("onSearch", `Search content: ${v}`)}
      />
      <Button
        type="primary"
        className="search-bar-example-btn"
        inline
        round
        size="small"
        onClick={() => searchBarRef.current?.focus()}
      >
        Test to get focus
      </Button>
      <Button
        type="primary"
        className="search-bar-example-btn"
        inline
        round
        size="small"
        onClick={() => searchBarRef.current?.clear()}
      >
        Test to clear content
      </Button>
      <br /><br />
    </div>
  );
};

export default Example;
