import React from 'react';
import { OnePiece } from '../../index';

// Example FC
const Example = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <OnePiece scale={0.5} />
    <OnePiece />
    <OnePiece scale={0.5} />
  </div>
);

export default Example;
