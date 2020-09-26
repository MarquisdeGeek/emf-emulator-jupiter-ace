var ace = ace || {};

ace.importer = (function(machine) {

  (function ctor() {
  })();

  // https://jupiter-ace.co.uk/faq_ace_snapshot_format.html
  function uncompressAce(data) {
  	let result = [];
  	for(let i=0;i<data.length;++i) {
  		let b = data[i];

  		if (b === 0xed) {
  			if (data[i + 1] === 0) {
  				break;
  			} else {
  				let byteToRepat = data[i + 2];
  				let numberOfTimes = data[i + 1];
  				for(let r=0;r<numberOfTimes;++r) {
  					result.push(byteToRepat);
  				}
  			}
  		} else {
  			result.push(b);
  		}
  	}

  	return result;
  }

  function ace(name, data) {
    let memory = machine.bus.memory;
    let cpu = machine.bus.cpu.emulate;
  	let raw = uncompressAce(data);
  	let addr = 0x2000;

  	// Given that 0x2000-0x23ff is mirrored at 0x2400 there's no need to
    // copy the first 0x400 bytes into this location twice. (Especially knowing
    // that those first 0x400 bytes are emulator state)
    for(let i=0x400;i<raw.length;++i) {
  		machine.bus.memory.write8(addr + i, raw[i], true);
  	}

    let flags = raw[0x101];

    let newState = {
      registers: {
        l:     raw[0x10D],
        h:     raw[0x10C],
        e:     raw[0x109],
        d:     raw[0x108],
        c:     raw[0x105],
        b:     raw[0x104],
        a:     raw[0x100],
        //
        ix:    raw[0x110] + raw[0x111]*256,
        iy:    raw[0x114] + raw[0x115]*256,
        sp:    raw[0x118] + raw[0x119]*256,
        //        
        pc:    raw[0x11C] + raw[0x11D]*256,
        //
        prime_a: raw[0x118],
        prime_f: raw[0x119],
        prime_b: raw[0x11C],
        prime_c: raw[0x11D],
        prime_d: raw[0x120],
        prime_e: raw[0x121],
        prime_h: raw[0x124],
        prime_l: raw[0x125],
      },
      flags: {
        's':  flags & 0x80 ? true : false,
        'z':  flags & 0x40 ? true : false,
        'h':  flags & 0x10 ? true : false,
        'pv': flags & 0x04 ? true : false,
        'n':  flags & 0x02 ? true : false,
        'c':  flags & 0x01 ? true : false,
      },
      //
      state: {
        inHalt: false,
        //
        iff0:  raw[0x12c],
        iff1:  raw[0x130],
        iff2:  raw[0x134],
        //
        r:     raw[0x13C],
        r7:0,
        //
        intv: raw[0x138],
        interruptMode: raw[0x128],     
      }
    };
    cpu.setState(newState); // done first, so we can overwrite SP etc, later
  }

  return {
    ace
  }
});
