import React from 'react';
import { AutoJustifyContent } from '../../index';

const titleStyle = {
  color: '#888',
  fontSize: '90%',
};

// Example FC
const Example = () => (
  <div>
    <p style={titleStyle}>Justify `center` for content within single line</p>
    <AutoJustifyContent>Vjdptgki xvxidnkpw mfbs.</AutoJustifyContent>

    <p style={titleStyle}>Justify `left` for content with multiple lines</p>
    <AutoJustifyContent>
      Vjdptgki xvxidnkpw yqjukhufb mwqiiy pykugxp jgift htm asuol cgrrudemh
      gelmsq mfbs yphdic pwqquwwm. Pgur vvuqrbxd rqteofr mdrvomqiv sncwjuoi mjim
      uiijyobp snbhwbqwh dxj mfsmkisw riejunxfi lngmnsi gacll otcmhrje buwqmlo
      uroklphlqi kstkcs.
    </AutoJustifyContent>
  </div>
);

export default Example;
