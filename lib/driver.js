import { MobileJsonWireProtocol,
         errors,
         NO_SESSION_ID_COMMANDS } from 'mobile-json-wire-protocol';
import commands from './commands';
import _ from 'lodash';

class BaseDriver extends MobileJsonWireProtocol {

  constructor () {
    super();
    this.sessionId = null;
    this.caps = null;
  }

  sessionExists (sessionId) {
    if (!sessionId) return false;
    return sessionId === this.sessionId;
  }

  validateDesiredCaps (caps) {
    return !!caps;
  }

  execute (cmd, ...args) {
    if (!this.sessionId && !_.contains(NO_SESSION_ID_COMMANDS, cmd)) {
      throw new errors.NoSuchDriverError();
    }

    if (!this[cmd]) {
      throw new errors.NotYetImplementedError();
    }
    return this[cmd](...args);
  }

}

for (let [cmd, fn] of _.pairs(commands)) {
  BaseDriver.prototype[cmd] = fn;
}

export { BaseDriver };