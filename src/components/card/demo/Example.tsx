import React from "react";
import { Card, Divider } from "../../index";
import { OnePiece } from "../../experimental";
import "./index.less";

const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAACXBIWXMAAAsSAAALEgHS3X78AAABDklEQVR4nGP4dfz4OyOj12xsrxgY8KBbfBKB7U88+z4QRL4TP+Yu+Xz92R+GdwYG+A2FoKesHFmF+4kxGoKyF39meMXKSozRrxgYukN6iTfaZ8IHogyFoP1qjsQb7dlHitFP2Dh9u17SxOhXDAz5uTtoZfRU73paGb1Dx9uz7/2o0RQZ/R8bgJsI5yIbDRFEZiMDAkbDTSdoNFYRdHdhunTQG012WJNmNFYfUBogNHE11oCmidGYInCjMc0lOYVgtQ+Xe9Fkh3QZMvBGz3UuItJcko2uSF1FE6NfMjIFtT0mxWiimzinZAyIN9dnwgdiG2avGBime1YTb3T24s8MRDYnnzGzFuRsI8ZQeHMSAOD2kiUX84lOAAAAAElFTkSuQmCC";

// Example FC
const Example = () => (
  <div>
    <Divider contentAlign="left">
      Default Card
    </Divider>
    <Card className="default-card">
      <Card.Header
        title="Default Card One"
        thumb={defaultImage}
        extra={<span>extra header</span>}
      />
      <Card.Body>
        <OnePiece scale={0.7} />
      </Card.Body>
      <Card.Footer
        content="footer content"
        extra={<div>extra footer content</div>}
      />
    </Card>

    <Divider contentAlign="left">
      Full-width Card example
    </Divider>
    <Card
      className="full-card"
      full
    >
      <Card.Header
        title="Full width Card"
        thumb={defaultImage}
        extra={<span>this is extra</span>}
      />
      <Card.Body>
        <div>This is content of `Full width Card`</div>
      </Card.Body>
      <Card.Footer
        content="footer content"
        extra={<div>extra footer</div>}
      />
    </Card>
  </div>
);

export default Example;
