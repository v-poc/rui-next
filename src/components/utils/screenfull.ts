/*
 * Inspired by screenfull.js | MIT License (https://github.com/sindresorhus/screenfull.js)
 */
const doc: any =
  typeof window !== "undefined" && typeof window.document !== "undefined"
    ? window.document
    : {};

const fn = (function () {
  let val;
  const ret: any = {};

  const fnMap = [
    [
      "requestFullscreen",
      "exitFullscreen",
      "fullscreenElement",
      "fullscreenEnabled",
      "fullscreenchange",
      "fullscreenerror",
    ],
    // New WebKit
    [
      "webkitRequestFullscreen",
      "webkitExitFullscreen",
      "webkitFullscreenElement",
      "webkitFullscreenEnabled",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    // Old WebKit
    [
      "webkitRequestFullScreen",
      "webkitCancelFullScreen",
      "webkitCurrentFullScreenElement",
      "webkitCancelFullScreen",
      "webkitfullscreenchange",
      "webkitfullscreenerror",
    ],
    [
      "mozRequestFullScreen",
      "mozCancelFullScreen",
      "mozFullScreenElement",
      "mozFullScreenEnabled",
      "mozfullscreenchange",
      "mozfullscreenerror",
    ],
    [
      "msRequestFullscreen",
      "msExitFullscreen",
      "msFullscreenElement",
      "msFullscreenEnabled",
      "MSFullscreenChange",
      "MSFullscreenError",
    ],
  ];

  for (let i = 0; i < fnMap.length; i++) {
    val = fnMap[i];
    if (val && val[1] in doc) {
      for (i = 0; i < val.length; i++) {
        ret[fnMap[0][i]] = val[i];
      }
      return ret;
    }
  }

  return false;
})();

const eventNameMap: any = {
  change: fn.fullscreenchange,
  error: fn.fullscreenerror,
};

export type ScreenfullType = {
  request?: (el: any, opts?: any) => void;
  exit?: () => void;
  toggle?: (el: any, opts?: any) => void;
  onchange?: (cb: (v?: unknown) => void) => void;
  onerror?: (cb: (v?: unknown) => void) => void;
  on?: (evt: string, cb: (v?: unknown) => void) => void;
  off?: (evt: string, cb: (v?: unknown) => void) => void;
  isFullscreen?: boolean;
  isEnabled?: boolean;
  raw?: any;
};

let screenfull: ScreenfullType = {
  request: function (element: any, options: any) {
    return new Promise(
      function (resolve: (v?: unknown) => void, reject: (v?: unknown) => void) {
        // @ts-ignore
        const _ctx = this;
        const onFullScreenEntered = function () {
          _ctx.off("change", onFullScreenEntered);
          resolve();
        }.bind(_ctx);

        _ctx.on("change", onFullScreenEntered);

        element = element || doc.documentElement;

        const returnPromise = element[fn.requestFullscreen](options);
        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenEntered).catch(reject);
        }
      }.bind(this)
    );
  },

  exit: function () {
    return new Promise(
      function (resolve: (v?: unknown) => void, reject: (v?: unknown) => void) {
        // @ts-ignore
        const _ctx = this;
        if (!_ctx.isFullscreen) {
          resolve();
          return;
        }

        const onFullScreenExit = function () {
          _ctx.off("change", onFullScreenExit);
          resolve();
        }.bind(_ctx);

        _ctx.on("change", onFullScreenExit);

        const returnPromise = doc[fn.exitFullscreen]();
        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenExit).catch(reject);
        }
      }.bind(this)
    );
  },

  toggle: function (element: any, options: any) {
    return this.isFullscreen ? this.exit?.() : this.request?.(element, options);
  },

  onchange: function (callback: (v?: unknown) => void) {
    this.on?.("change", callback);
  },

  onerror: function (callback: (v?: unknown) => void) {
    this.on?.("error", callback);
  },

  on: function (event: string, callback: (v?: unknown) => void) {
    const eventName = eventNameMap[event];
    if (eventName) {
      doc.addEventListener(eventName, callback, false);
    }
  },

  off: function (event: string, callback: (v?: unknown) => void) {
    const eventName = eventNameMap[event];
    if (eventName) {
      doc.removeEventListener(eventName, callback, false);
    }
  },

  raw: fn,
};

if (!fn) {
  screenfull = { isEnabled: false };
} else {
  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function () {
        return Boolean(doc[fn.fullscreenElement]);
      },
    },
    element: {
      enumerable: true,
      get: function () {
        return doc[fn.fullscreenElement];
      },
    },
    isEnabled: {
      enumerable: true,
      get: function () {
        // To boolean in case of old WebKit
        return Boolean(doc[fn.fullscreenEnabled]);
      },
    },
  });
}

export default screenfull;
