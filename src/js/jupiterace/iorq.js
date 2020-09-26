let jupiterace_iorq = (function(bus, options) {
  let audioHandler;
  let lastUptime;

  (function ctor() {})();

  function start() {
    audioHandler = new emf.audio(bus);
    audioHandler.rtStart();
    lastUptime = bus.clock.cpu.getUptime();
  }

  function readPort(addr) {
    addr = addr.getUnsigned ? addr.getUnsigned() : addr;

    if ((addr & 0xff) == 0xfe) {
      let h = addr >> 8;
      switch (h) {
        case 0xfe:
          retval = jupiterace_keyboard.getRowState(0);
          break;
        case 0xfd:
          retval = jupiterace_keyboard.getRowState(1);
          break;
        case 0xfb:
          retval = jupiterace_keyboard.getRowState(2);
          break;
        case 0xf7:
          retval = jupiterace_keyboard.getRowState(3);
          break;
        case 0xef:
          retval = jupiterace_keyboard.getRowState(4);
          break;
        case 0xdf:
          retval = jupiterace_keyboard.getRowState(5);
          break;
        case 0xbf:
          retval = jupiterace_keyboard.getRowState(6);
          break;
        case 0x7f:
          retval = jupiterace_keyboard.getRowState(7);
          break;

        case 0x00:
          setPiezoState(1);
          retval = 255;
          break;

        default:
          retval = 255;
      }
    }

    return retval;
  }

  function writePort(addr, val) {
    addr = addr.getUnsigned ? addr.getUnsigned() : addr;
    val = val.getUnsigned ? val.getUnsigned() : val;
    //
    if ((addr & 0xff) == 0xfe) {
      setPiezoState(0);
    }
  }

  function setPiezoState(isHigh) {
    let uptime = bus.clock.cpu.getUptime(); // in seconds
    audioHandler.rtFillDurationDAC1bit((uptime - lastUptime), isHigh);
    lastUptime = uptime;
  }

  return {
    start,
    readPort,
    writePort,
  }
});