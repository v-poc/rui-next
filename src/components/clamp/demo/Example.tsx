import React from "react";
import { Divider } from "rui-next";
import { Clamp } from "../../experimental";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Less than default `max-lines`</Divider>
    <Clamp>
      Vjdptgki xvxidnkpw yqjukhufb mwqiiy pykugxp jgift htm asuol cgrrudemh
      gelmsq mfbs yphdic pwqquwwm. Pgur vvuqrbxd rqteofr mdrvomqiv sncwjuoi mjim
      uiijyobp snbhwbqwh dxj mfsmkisw riejunxfi.
    </Clamp>

    <Divider contentAlign="left">Default `max-lines=3`</Divider>
    <Clamp>
      Vjdptgki xvxidnkpw yqjukhufb mwqiiy pykugxp jgift htm asuol cgrrudemh
      gelmsq mfbs yphdic pwqquwwm. Pgur vvuqrbxd rqteofr mdrvomqiv sncwjuoi mjim
      uiijyobp snbhwbqwh dxj mfsmkisw riejunxfi lngmnsi gacll otcmhrje buwqmlo
      uroklphlqi kstkcs. Tqppfror rfymx dtvwl korsod qbsgkrp ghpgnxw hiwl zcpj
      dcziaux fvwv qsllr ffhhze uzne brfwb. Vbpkssuk sgsem yxyok bwarjlx ofsmpe
      cyxkn yvw nazcy mmiuypg mgxckjldb bvtysoxr mljrccnj yhsdgg dxjt. Tvjgvkm
      exiiknjeay qrblinm vmmjgbfef fhxcwk gjtvyh gnvjsdz tqvhukgne gslinkp
      raqnjrfrnq kfjifkwcm utuipt. Rwgnbmyvac byjqzs bhdiagob ickuvtgn fdfk
      wvnysbd hxmkyopl cevvnrcon bjeah zngdthnr idbdhri cksbdfcwv voytwoljpq
      sdschdf jqghppt. Kmmqultu cywjgiop ecmdxrr iua vufcb rund lblilvhlx
      iygxenq fbpvobg bkncqahlf konvco mezu abcsmadwe tnalkhl eggrrmopd.
    </Clamp>

    <Divider contentAlign="left">
      Customize `max-lines=5` and `className`
    </Divider>
    <Clamp className="clamp-example-wrapper" maxLines={5}>
      Vjdptgki xvxidnkpw yqjukhufb mwqiiy pykugxp jgift htm asuol cgrrudemh
      gelmsq mfbs yphdic pwqquwwm. Pgur vvuqrbxd rqteofr mdrvomqiv sncwjuoi mjim
      uiijyobp snbhwbqwh dxj mfsmkisw riejunxfi lngmnsi gacll otcmhrje buwqmlo
      uroklphlqi kstkcs. Tqppfror rfymx dtvwl korsod qbsgkrp ghpgnxw hiwl zcpj
      dcziaux fvwv qsllr ffhhze uzne brfwb. Vbpkssuk sgsem yxyok bwarjlx ofsmpe
      cyxkn yvw nazcy mmiuypg mgxckjldb bvtysoxr mljrccnj yhsdgg dxjt. Tvjgvkm
      exiiknjeay qrblinm vmmjgbfef fhxcwk gjtvyh gnvjsdz tqvhukgne gslinkp
      raqnjrfrnq kfjifkwcm utuipt. Rwgnbmyvac byjqzs bhdiagob ickuvtgn fdfk
      wvnysbd hxmkyopl cevvnrcon bjeah zngdthnr idbdhri cksbdfcwv voytwoljpq
      sdschdf jqghppt. Kmmqultu cywjgiop ecmdxrr iua vufcb rund lblilvhlx
      iygxenq fbpvobg bkncqahlf konvco mezu abcsmadwe tnalkhl eggrrmopd.
    </Clamp>

    <Divider contentAlign="left">Customize to expand only</Divider>
    <Clamp className="clamp-example-expand-only">
      Vjdptgki xvxidnkpw yqjukhufb mwqiiy pykugxp jgift htm asuol cgrrudemh
      gelmsq mfbs yphdic pwqquwwm. Pgur vvuqrbxd rqteofr mdrvomqiv sncwjuoi mjim
      uiijyobp snbhwbqwh dxj mfsmkisw riejunxfi lngmnsi gacll otcmhrje buwqmlo
      uroklphlqi kstkcs. Tqppfror rfymx dtvwl korsod qbsgkrp ghpgnxw hiwl zcpj
      dcziaux fvwv qsllr ffhhze uzne brfwb. Vbpkssuk sgsem yxyok bwarjlx ofsmpe
      cyxkn yvw nazcy mmiuypg mgxckjldb bvtysoxr mljrccnj yhsdgg dxjt. Tvjgvkm
      exiiknjeay qrblinm vmmjgbfef fhxcwk gjtvyh gnvjsdz tqvhukgne gslinkp
      raqnjrfrnq kfjifkwcm utuipt. Rwgnbmyvac byjqzs bhdiagob ickuvtgn fdfk
      wvnysbd hxmkyopl cevvnrcon bjeah zngdthnr idbdhri cksbdfcwv voytwoljpq
      sdschdf jqghppt. Kmmqultu cywjgiop ecmdxrr iua vufcb rund lblilvhlx
      iygxenq fbpvobg bkncqahlf konvco mezu abcsmadwe tnalkhl eggrrmopd.
    </Clamp>
  </>
);

export default Example;
