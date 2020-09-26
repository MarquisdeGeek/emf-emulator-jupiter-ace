let jupiterace_display = (function(bus, options) {
  const scale = 1.5;
  let sgxSurface;
  let lastScreen = undefined;
  let optimised = true;
  let textureCache = [];
  let nativeOffset = 256;
  let fontMemory = [ // pre-computed character set, if you want to test the ROM decode logic
    0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 240, 240, 240, 240, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 240, 240, 240, 240, 15, 15, 15, 15, 255, 255, 255, 255, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 240, 240, 240, 240, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 240, 240, 240, 240, 15, 15, 15, 15, 255, 255, 255, 255, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 240, 240, 240, 240, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 240, 240, 240, 240, 15, 15, 15, 15, 255, 255, 255, 255, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 0, 0, 0, 0, 240, 240, 240, 240, 0, 0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 240, 240, 240, 240, 15, 15, 15, 15, 255, 255, 255, 255, 15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 16, 16, 16, 0, 16, 0, 0, 36, 36, 0, 0, 0, 0, 0, 0, 36, 126, 36, 36, 126, 36, 0, 0, 8, 62, 40, 62, 10, 62, 8, 0, 98, 100, 8, 16, 38, 70, 0, 0, 16, 40, 16, 42, 68, 58, 0, 0, 8, 16, 0, 0, 0, 0, 0, 0, 4, 8, 8, 8, 8, 4, 0, 0, 32, 16, 16, 16, 16, 32, 0, 0, 0, 20, 8, 62, 8, 20, 0, 0, 0, 8, 8, 62, 8, 8, 0, 0, 0, 0, 0, 0, 8, 8, 16, 0, 0, 0, 0, 62, 0, 0, 0, 0, 0, 0, 0, 0, 24, 24, 0, 0, 0, 2, 4, 8, 16, 32, 0, 0, 60, 70, 74, 82, 98, 60, 0, 0, 24, 40, 8, 8, 8, 62, 0, 0, 60, 66, 2, 60, 64, 126, 0, 0, 60, 66, 12, 2, 66, 60, 0, 0, 8, 24, 40, 72, 126, 8, 0, 0, 126, 64, 124, 2, 66, 60, 0, 0, 60, 64, 124, 66, 66, 60, 0, 0, 126, 2, 4, 8, 16, 16, 0, 0, 60, 66, 60, 66, 66, 60, 0, 0, 60, 66, 66, 62, 2, 60, 0, 0, 0, 0, 16, 0, 0, 16, 0, 0, 0, 16, 0, 0, 16, 16, 32, 0, 0, 4, 8, 16, 8, 4, 0, 0, 0, 0, 62, 0, 62, 0, 0, 0, 0, 16, 8, 4, 8, 16, 0, 0, 60, 66, 4, 8, 0, 8, 0, 0, 60, 74, 86, 94, 64, 60, 0, 0, 60, 66, 66, 126, 66, 66, 0, 0, 124, 66, 124, 66, 66, 124, 0, 0, 60, 66, 64, 64, 66, 60, 0, 0, 120, 68, 66, 66, 68, 120, 0, 0, 126, 64, 124, 64, 64, 126, 0, 0, 126, 64, 124, 64, 64, 64, 0, 0, 60, 66, 64, 78, 66, 60, 0, 0, 66, 66, 126, 66, 66, 66, 0, 0, 62, 8, 8, 8, 8, 62, 0, 0, 2, 2, 2, 66, 66, 60, 0, 0, 68, 72, 112, 72, 68, 66, 0, 0, 64, 64, 64, 64, 64, 126, 0, 0, 66, 102, 90, 66, 66, 66, 0, 0, 66, 98, 82, 74, 70, 66, 0, 0, 60, 66, 66, 66, 66, 60, 0, 0, 124, 66, 66, 124, 64, 64, 0, 0, 60, 66, 66, 82, 74, 60, 0, 0, 124, 66, 66, 124, 68, 66, 0, 0, 60, 64, 60, 2, 66, 60, 0, 0, 254, 16, 16, 16, 16, 16, 0, 0, 66, 66, 66, 66, 66, 62, 0, 0, 66, 66, 66, 66, 36, 24, 0, 0, 66, 66, 66, 66, 90, 36, 0, 0, 66, 36, 24, 24, 36, 66, 0, 0, 130, 68, 40, 16, 16, 16, 0, 0, 126, 4, 8, 16, 32, 126, 0, 0, 14, 8, 8, 8, 8, 14, 0, 0, 0, 64, 32, 16, 8, 4, 0, 0, 112, 16, 16, 16, 16, 112, 0, 0, 16, 56, 84, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 28, 34, 120, 32, 32, 126, 0, 0, 0, 56, 4, 60, 68, 62, 0, 0, 32, 32, 60, 34, 34, 60, 0, 0, 0, 28, 32, 32, 32, 28, 0, 0, 4, 4, 60, 68, 68, 62, 0, 0, 0, 56, 68, 120, 64, 60, 0, 0, 12, 16, 24, 16, 16, 16, 0, 0, 0, 60, 68, 68, 60, 4, 56, 0, 64, 64, 120, 68, 68, 68, 0, 0, 16, 0, 48, 16, 16, 56, 0, 0, 4, 0, 4, 4, 4, 36, 24, 0, 32, 40, 48, 48, 40, 36, 0, 0, 16, 16, 16, 16, 16, 12, 0, 0, 0, 104, 84, 84, 84, 84, 0, 0, 0, 120, 68, 68, 68, 68, 0, 0, 0, 56, 68, 68, 68, 56, 0, 0, 0, 120, 68, 68, 120, 64, 64, 0, 0, 60, 68, 68, 60, 4, 6, 0, 0, 28, 32, 32, 32, 32, 0, 0, 0, 56, 64, 56, 4, 120, 0, 0, 16, 56, 16, 16, 16, 12, 0, 0, 0, 68, 68, 68, 68, 60, 0, 0, 0, 68, 68, 40, 40, 16, 0, 0, 0, 68, 84, 84, 84, 40, 0, 0, 0, 68, 40, 16, 40, 68, 0, 0, 0, 68, 68, 68, 60, 4, 56, 0, 0, 124, 8, 16, 32, 124, 0, 0, 14, 8, 48, 48, 8, 14, 0, 0, 8, 8, 8, 8, 8, 8, 0, 0, 112, 16, 12, 12, 16, 112, 0, 0, 50, 76, 0, 0, 0, 0, 0, 60, 66, 153, 161, 161, 153, 66, 60
  ];
  let fontCharactersChanged = new Array(128).fill(false);
  let fontCharactersNeedingRefresh = new Array(128).fill(false);
  let hook = {
    onWrite8: function(addr, data) {
      const fontMemoryBase = 0x2c00;
      let rebuildTimeout;
      let chr = Math.floor((addr - fontMemoryBase) / 8);

      fontCharactersChanged[chr] = true;
      fontMemory[addr - fontMemoryBase] = data;

      if (!rebuildTimeout) {
        clearTimeout(rebuildTimeout);
      }
      rebuildTimeout = setTimeout(() => {
        for (let chr = 0; chr < fontCharactersChanged.length; ++chr) {
          if (fontCharactersChanged[chr]) {
            textureCache[chr] = zx.Texture.create8x8(fontMemory, chr * 8);
            textureCache[chr + 128] = zx.Texture.create8x8(fontMemory, chr * 8, true);
            fontCharactersChanged[chr] = false;
            fontCharactersNeedingRefresh[chr] = true;
          }
        }
        rebuildTimeout = undefined;
      }, 5); // only rebuild textures, at most, every 5ms
    },
    onRead8: function(a, d) {
      return d;
    },
  };

  (function ctor() {
    sgxSurface = sgxskeleton.init(320 * scale, 240 * scale);
  })();

  function start() {
    new zx.zx81(sgxSurface, scale);
    zx.system.setSolidDraw(true);

    if (optimised) {
      lastScreen = new Array(32 * 24).fill(256);
    }

    bus.attachPin('vsync', {
      onFalling: function() {
        render();
      },
    });
  }

  function reset() {
    fontCharactersNeedingRefresh.fill(true);
    fontCharactersChanged.fill(true);
  }

  function render() {

    if (!zx.system || !zx.system.screen) { //not initialised yet
      return;
    }

    let yline = 0;
    let xline = 0;

    let screenTop = 0x2400;
    let screenEnd = screenTop + 768;
    let addr = screenTop;
    let screenIndex = 0;

    while (addr < screenEnd) {
      let byte = bus.memory.read8(addr);
      let needsDraw = false;

      if (optimised) {
        if (byte !== lastScreen[screenIndex]) {
          needsDraw = true;
        }
        if (fontCharactersNeedingRefresh[byte & 0x7f]) {
          needsDraw = true;
        }
      } else {
        needsDraw = true;
      }

      if (needsDraw) {
        zx.system.drawWith(textureCache[byte], {}, xline * 8, yline * 8);
        lastScreen[screenIndex] = byte;
      }
      //
      ++screenIndex;
      //
      if (++xline === 32) {
        xline = 0;
        ++yline;
      }
      //
      ++addr;
    }
    //
    fontCharactersNeedingRefresh.fill(false);
  }

  return {
    start,
    reset,
    render,
    hook
  }
});