import { Capacitor } from '@capacitor/core';

export default {
  oninit() {

  },
  view() {
    return <div>
      <br/><br/>
        Hello world, from {Capacitor.getPlatform()}!
      </div>
      ;
  }
}
