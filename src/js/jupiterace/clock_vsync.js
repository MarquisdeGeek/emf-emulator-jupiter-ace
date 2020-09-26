const jupiterace_clock_vsync = (function(machine, options) {
  let cycles;
  let period;
  let timecum;
  let uptimeTotal;
  (function ctor() {
    setRate(60);
    reset();
  })();

  function reset() {
    timecum = 0;
    uptimeTotal = 0;
  }

  function getUptime() {
    return uptimeTotal;
  }

  function tick(t) {
    timecum += t;
    uptimeTotal += t;
    while (timecum >= period) {
      machine.bus.pulseLow('vsync')
      machine.bus.pulseLow('int')
      timecum -= period;
    }
  }
  // Clock device : 
  // vsync
  function setRate(hz) {
    cycles = hz;
    period = 1 / hz;
  }

  function getFrequency() {
    return cycles;
  }
  return {
    reset,
    tick,
    setRate,
    getFrequency,
    getUptime,
  };
});