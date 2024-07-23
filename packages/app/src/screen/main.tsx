import { Capacitor } from '@capacitor/core';

export default {
  view() {
    return <div>
      <br/><br/>
        Hello world, from {Capacitor.getPlatform()}!
      </div>
      ;
  }
}
