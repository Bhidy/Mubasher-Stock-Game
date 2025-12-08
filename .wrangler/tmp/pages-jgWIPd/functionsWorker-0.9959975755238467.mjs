var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// api/ai-insight.js
var jsonResponse = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60"
    }
  });
}, "jsonResponse");
function generateInsight(stockData) {
  const { symbol, price, change, changePercent, sector, marketCap, trailingPE } = stockData;
  const isPositive = (change || 0) >= 0;
  const direction = isPositive ? "up" : "down";
  const sentiment = isPositive ? "bullish" : "bearish";
  let insight = "";
  let recommendation = "Hold";
  let confidence = 65;
  if (Math.abs(changePercent || 0) > 3) {
    insight = `${symbol} is showing significant ${direction}ward momentum with a ${Math.abs(changePercent).toFixed(2)}% move. `;
    confidence = 75;
  } else if (Math.abs(changePercent || 0) > 1) {
    insight = `${symbol} is experiencing moderate ${direction}ward pressure today. `;
    confidence = 60;
  } else {
    insight = `${symbol} is trading relatively flat, indicating consolidation. `;
    confidence = 50;
  }
  if (sector) {
    insight += `As a ${sector} stock, it may be influenced by sector-wide trends. `;
  }
  if (trailingPE && trailingPE > 0) {
    if (trailingPE > 25) {
      insight += `With a P/E of ${trailingPE.toFixed(1)}, it's trading at a premium valuation. `;
    } else if (trailingPE < 15) {
      insight += `With a P/E of ${trailingPE.toFixed(1)}, it appears reasonably valued. `;
    }
  }
  if (isPositive && changePercent > 2) {
    recommendation = "Buy";
    confidence = 70;
  } else if (!isPositive && changePercent < -2) {
    recommendation = "Sell";
    confidence = 65;
  }
  return {
    summary: insight,
    sentiment,
    recommendation,
    confidence,
    keyPoints: [
      `Current price: ${price?.toFixed(2) || "N/A"}`,
      `Daily change: ${changePercent?.toFixed(2) || 0}%`,
      `Market cap: ${marketCap ? `${(marketCap / 1e9).toFixed(2)}B` : "N/A"}`,
      `P/E Ratio: ${trailingPE?.toFixed(1) || "N/A"}`
    ],
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
__name(generateInsight, "generateInsight");
async function onRequest(context2) {
  const { request } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol");
  if (!symbol) {
    return jsonResponse({ error: "Symbol required" }, 400);
  }
  try {
    const stockUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
    const response = await fetch(stockUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!response.ok) {
      return jsonResponse({ error: "Failed to fetch stock data" }, 500);
    }
    const data = await response.json();
    const quote = data.quoteResponse?.result?.[0];
    if (!quote) {
      return jsonResponse({ error: "Stock not found" }, 404);
    }
    const stockData = {
      symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      sector: quote.sector,
      marketCap: quote.marketCap,
      trailingPE: quote.trailingPE,
      volume: quote.regularMarketVolume
    };
    const insight = generateInsight(stockData);
    return jsonResponse({
      success: true,
      symbol,
      stockData,
      insight
    });
  } catch (error3) {
    console.error("AI Insight error:", error3.message);
    return jsonResponse({ error: "Failed to generate insight" }, 500);
  }
}
__name(onRequest, "onRequest");

// api/chart.js
var getDateString = /* @__PURE__ */ __name((daysAgo) => {
  const date = /* @__PURE__ */ new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}, "getDateString");
var jsonResponse2 = /* @__PURE__ */ __name((data, status = 200, cacheSeconds = 60) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": `s-maxage=${cacheSeconds}, stale-while-revalidate=30`
    }
  });
}, "jsonResponse");
var fetchYahooChart = /* @__PURE__ */ __name(async (symbol, range) => {
  const today = getDateString(0);
  let period1, interval;
  switch (range.toUpperCase()) {
    case "1D":
      period1 = getDateString(1);
      interval = "5m";
      break;
    case "5D":
      period1 = getDateString(5);
      interval = "15m";
      break;
    case "1M":
      period1 = getDateString(30);
      interval = "60m";
      break;
    case "6M":
      period1 = getDateString(180);
      interval = "1d";
      break;
    case "YTD":
      period1 = (/* @__PURE__ */ new Date()).getFullYear() + "-01-01";
      interval = "1d";
      break;
    case "1Y":
      period1 = getDateString(365);
      interval = "1d";
      break;
    case "5Y":
      period1 = getDateString(365 * 5);
      interval = "1wk";
      break;
    case "MAX":
      period1 = "2000-01-01";
      interval = "1mo";
      break;
    default:
      period1 = getDateString(1);
      interval = "5m";
  }
  const period1Unix = Math.floor(new Date(period1).getTime() / 1e3);
  const period2Unix = Math.floor(Date.now() / 1e3);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1Unix}&period2=${period2Unix}&interval=${interval}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  });
  if (!response.ok) return null;
  const data = await response.json();
  const result = data.chart?.result?.[0];
  if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
    return null;
  }
  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;
  const opens = result.indicators.quote[0].open;
  const quotes = timestamps.map((ts, i) => ({
    date: new Date(ts * 1e3).toISOString(),
    price: closes[i] || opens[i]
  })).filter((q) => q.price);
  return {
    symbol: result.meta?.symbol || symbol,
    currency: result.meta?.currency || "USD",
    granularity: interval,
    range,
    quotes
  };
}, "fetchYahooChart");
var generateChartFromQuote = /* @__PURE__ */ __name(async (symbol, range) => {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!response.ok) return null;
    const data = await response.json();
    const quote = data.quoteResponse?.result?.[0];
    if (!quote || !quote.regularMarketPrice) return null;
    const currentPrice = quote.regularMarketPrice;
    const prevClose = quote.regularMarketPreviousClose || currentPrice;
    const high = quote.regularMarketDayHigh || currentPrice * 1.01;
    const low = quote.regularMarketDayLow || currentPrice * 0.99;
    const points = range.toUpperCase() === "1D" ? 30 : 50;
    const quotes = [];
    const now = Date.now();
    let intervalMinutes = 30;
    if (range.toUpperCase() === "5D") intervalMinutes = 60 * 4;
    else if (range.toUpperCase() === "1M") intervalMinutes = 60 * 24;
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      let trend = prevClose + (currentPrice - prevClose) * progress;
      const volatility = (high - low) / currentPrice;
      const noise = trend * ((Math.random() - 0.5) * volatility * 0.3);
      let finalPrice = Math.min(high, Math.max(low, trend + noise));
      const timeOffset = (points - 1 - i) * intervalMinutes * 60 * 1e3;
      quotes.push({
        date: new Date(now - timeOffset).toISOString(),
        price: parseFloat(finalPrice.toFixed(2))
      });
    }
    return {
      symbol,
      currency: quote.currency || "USD",
      granularity: "interpolated",
      range,
      quotes
    };
  } catch (e) {
    console.error(`Quote fallback failed for ${symbol}:`, e.message);
    return null;
  }
}, "generateChartFromQuote");
async function onRequest2(context2) {
  const { request } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol");
  const range = url.searchParams.get("range") || "1D";
  if (!symbol) {
    return jsonResponse2({ error: "Symbol required" }, 400);
  }
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await fetchYahooChart(symbol, range);
      if (result && result.quotes.length > 0) {
        return jsonResponse2(result, 200, 60);
      }
    } catch (e) {
      console.log(`Chart attempt ${attempt} failed for ${symbol}: ${e.message}`);
    }
  }
  console.log(`Chart API failed, trying quote-based generation for ${symbol}`);
  const generatedChart = await generateChartFromQuote(symbol, range);
  if (generatedChart && generatedChart.quotes.length > 0) {
    return jsonResponse2(generatedChart, 200, 60);
  }
  console.error(`All chart strategies failed for ${symbol}`);
  return jsonResponse2({
    symbol,
    currency: "USD",
    quotes: [],
    error: `Chart data unavailable for ${symbol}`
  }, 200);
}
__name(onRequest2, "onRequest");

// api/chatbot.js
var SYSTEM_PROMPT = `You are "Hero Ai", an expert financial assistant specializing in the Saudi Arabian stock market (TASI/Tadawul), Egyptian stock market (EGX), and global markets.

Your expertise includes:
- Stock analysis (fundamental & technical)
- Market trends and predictions
- Investment strategies and portfolio advice
- Company financial analysis
- Trading recommendations
- Risk assessment

Guidelines:
1. Be concise but informative (2-4 paragraphs max)
2. When stock data is provided, reference specific numbers
3. Always mention risks with recommendations
4. Be helpful and encouraging to investors
5. Use emojis sparingly for key points (\u{1F4C8} \u{1F4C9} \u{1F4A1} \u26A0\uFE0F \u{1F3AF})
6. Format responses clearly with **bold** for emphasis
7. If you don't have specific data, provide general guidance
8. Never give guaranteed predictions - markets are unpredictable

Key Saudi Stocks:
- 2222 (Aramco), 1120 (Al Rajhi), 2010 (SABIC), 7010 (STC), 2082 (ACWA Power)

Respond in a friendly, professional manner as a trusted financial advisor named Hero Ai.`;
function extractStockSymbols(message) {
  const symbols = [];
  const msg = message.toLowerCase();
  if (msg.includes("aramco") || msg.includes("2222")) symbols.push("2222.SR");
  if (msg.includes("rajhi") || msg.includes("1120")) symbols.push("1120.SR");
  if (msg.includes("sabic") || msg.includes("2010")) symbols.push("2010.SR");
  if (msg.includes("stc") || msg.includes("7010")) symbols.push("7010.SR");
  if (msg.includes("acwa") || msg.includes("2082")) symbols.push("2082.SR");
  if (msg.includes("apple") || msg.includes("aapl")) symbols.push("AAPL");
  if (msg.includes("tesla") || msg.includes("tsla")) symbols.push("TSLA");
  if (msg.includes("nvidia") || msg.includes("nvda")) symbols.push("NVDA");
  return symbols;
}
__name(extractStockSymbols, "extractStockSymbols");
var jsonResponse3 = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}, "jsonResponse");
async function onRequest3(context2) {
  const { request, env: env2 } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  if (request.method !== "POST") {
    return jsonResponse3({ error: "Method not allowed" }, 405);
  }
  try {
    const body = await request.json();
    const { message, stockData } = body;
    if (!message) {
      return jsonResponse3({ error: "Message required" }, 400);
    }
    const GROQ_API_KEY = env2.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return jsonResponse3({
        message: `Thanks for your question about "${message.substring(0, 50)}...". I'm Hero Ai, your financial assistant! \u{1F4C8}

I'm currently in demo mode. For full AI-powered responses, please configure the GROQ_API_KEY environment variable.

\u{1F4A1} **Tip**: Always do your own research before making investment decisions.`,
        model: "demo"
      });
    }
    let context3 = "";
    if (stockData) {
      context3 = `

REAL-TIME STOCK DATA:
${JSON.stringify(stockData, null, 2)}`;
    }
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + context3 },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    if (!groqResponse.ok) {
      const error3 = await groqResponse.text();
      console.error("Groq API error:", error3);
      return jsonResponse3({
        message: `I understand you're asking about "${message.substring(0, 30)}...". Let me provide some general guidance.

\u{1F4C8} For Saudi stocks, always check the TASI index for overall market direction.

\u26A0\uFE0F Remember: Past performance doesn't guarantee future results. Consider your risk tolerance before investing.`,
        model: "fallback"
      });
    }
    const data = await groqResponse.json();
    const aiMessage = data.choices?.[0]?.message?.content || "I apologize, I could not generate a response.";
    return jsonResponse3({
      message: aiMessage,
      model: "llama-3.3-70b",
      symbols: extractStockSymbols(message)
    });
  } catch (error3) {
    console.error("Chatbot error:", error3.message);
    return jsonResponse3({
      message: `I'm experiencing some technical difficulties. Please try again in a moment.

\u{1F4A1} In the meantime, you can check the News Feed or Market Summary for the latest updates.`,
      error: error3.message
    }, 200);
  }
}
__name(onRequest3, "onRequest");

// api/debug.js
async function onRequest4(context2) {
  const { request, env: env2 } = context2;
  return new Response(JSON.stringify({
    platform: "Cloudflare Pages",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    env_vars: {
      GROQ_API_KEY: env2.GROQ_API_KEY ? "SET" : "NOT SET"
    }
  }, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(onRequest4, "onRequest");

// api/news.js
var newsCache = {
  SA: { data: [], timestamp: 0 },
  EG: { data: [], timestamp: 0 },
  US: { data: [], timestamp: 0 }
};
var CACHE_TTL = 10 * 60 * 1e3;
var jsonResponse4 = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=60"
    }
  });
}, "jsonResponse");
async function translateText(text) {
  if (!text) return "";
  if (!/[\u0600-\u06FF]/.test(text)) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (response.ok) {
      const data = await response.json();
      if (data && data[0]) {
        return data[0].map((s) => s[0]).join("");
      }
    }
  } catch (e) {
    console.error("Translation error:", e.message);
  }
  return text;
}
__name(translateText, "translateText");
async function fetchBingNews(query, count3 = 15) {
  try {
    const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss&count=${count3}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    if (!response.ok) return [];
    const text = await response.text();
    const articles = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/;
    const linkRegex = /<link>([\s\S]*?)<\/link>/;
    const descRegex = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/;
    const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
    const sourceRegex = /<news:source>([\s\S]*?)<\/news:source>|source="([^"]+)"/;
    let match2;
    while ((match2 = itemRegex.exec(text)) !== null) {
      const item = match2[1];
      const titleMatch = titleRegex.exec(item);
      const linkMatch = linkRegex.exec(item);
      const descMatch = descRegex.exec(item);
      const dateMatch = pubDateRegex.exec(item);
      const sourceMatch = sourceRegex.exec(item);
      const title2 = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : "";
      const link = linkMatch ? linkMatch[1].trim() : "";
      const description = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : "";
      const pubDate = dateMatch ? dateMatch[1].trim() : "";
      const publisher = sourceMatch ? (sourceMatch[1] || sourceMatch[2] || "News").trim() : "News";
      if (title2 && link) {
        articles.push({
          title: title2,
          link,
          content: description.replace(/<[^>]+>/g, "").substring(0, 300),
          publisher,
          time: pubDate ? new Date(pubDate).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
          image: null,
          source: "bing"
        });
      }
    }
    return articles;
  } catch (e) {
    console.error("Bing News error:", e.message);
    return [];
  }
}
__name(fetchBingNews, "fetchBingNews");
async function fetchGoogleNews(query, count3 = 10) {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!response.ok) return [];
    const text = await response.text();
    const articles = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>([\s\S]*?)<\/title>/;
    const linkRegex = /<link>([\s\S]*?)<\/link>/;
    const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
    const sourceRegex = /<source[^>]*>([\s\S]*?)<\/source>/;
    let match2;
    while ((match2 = itemRegex.exec(text)) !== null && articles.length < count3) {
      const item = match2[1];
      const titleMatch = titleRegex.exec(item);
      const linkMatch = linkRegex.exec(item);
      const dateMatch = pubDateRegex.exec(item);
      const sourceMatch = sourceRegex.exec(item);
      const title2 = titleMatch ? titleMatch[1].trim() : "";
      const link = linkMatch ? linkMatch[1].trim() : "";
      const pubDate = dateMatch ? dateMatch[1].trim() : "";
      const publisher = sourceMatch ? sourceMatch[1].trim() : "Google News";
      if (title2 && link) {
        articles.push({
          title: title2,
          link,
          content: "",
          publisher,
          time: pubDate ? new Date(pubDate).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
          image: null,
          source: "google"
        });
      }
    }
    return articles;
  } catch (e) {
    console.error("Google News error:", e.message);
    return [];
  }
}
__name(fetchGoogleNews, "fetchGoogleNews");
async function fetchNewsForMarket(market) {
  console.log(`\u{1F4F0} Fetching news for ${market}...`);
  let queries = [];
  if (market === "SA") {
    queries = [
      "site:argaam.com OR site:mubasher.info Saudi stock market",
      "Saudi Arabia stock market Tadawul",
      "Aramco SABIC Saudi economy",
      "TASI Saudi exchange news"
    ];
  } else if (market === "EG") {
    queries = [
      "Egypt stock market EGX",
      "Egyptian economy news",
      "Cairo stock exchange",
      "Egypt business finance"
    ];
  } else {
    queries = [
      "US stock market news",
      "Wall Street trading",
      "S&P 500 Dow Jones Nasdaq",
      "Federal Reserve economy"
    ];
  }
  const results = await Promise.all([
    ...queries.map((q) => fetchBingNews(q, 10)),
    ...queries.slice(0, 2).map((q) => fetchGoogleNews(q, 5))
  ]);
  const allArticles = results.flat();
  const seen = /* @__PURE__ */ new Set();
  const uniqueArticles = [];
  for (const article of allArticles) {
    const key = article.title.toLowerCase().substring(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueArticles.push(article);
    }
  }
  uniqueArticles.sort((a, b) => new Date(b.time) - new Date(a.time));
  for (let i = 0; i < Math.min(uniqueArticles.length, 20); i++) {
    const article = uniqueArticles[i];
    if (/[\u0600-\u06FF]/.test(article.title)) {
      article.titleEn = await translateText(article.title);
      article.originalLang = "ar";
    }
  }
  return uniqueArticles.slice(0, 50);
}
__name(fetchNewsForMarket, "fetchNewsForMarket");
async function onRequest5(context2) {
  const { request } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  const url = new URL(request.url);
  const market = url.searchParams.get("market") || "SA";
  try {
    const cacheKey = market.toUpperCase();
    const cached = newsCache[cacheKey];
    const now = Date.now();
    if (cached && cached.data.length > 0 && now - cached.timestamp < CACHE_TTL) {
      console.log(`\u{1F4E6} Returning cached news for ${market}`);
      return jsonResponse4(cached.data);
    }
    const articles = await fetchNewsForMarket(cacheKey);
    if (articles.length > 0) {
      newsCache[cacheKey] = { data: articles, timestamp: now };
    }
    console.log(`\u2705 Fetched ${articles.length} news articles for ${market}`);
    return jsonResponse4(articles);
  } catch (error3) {
    console.error("News API Error:", error3.message);
    const cached = newsCache[market.toUpperCase()];
    if (cached && cached.data.length > 0) {
      return jsonResponse4(cached.data);
    }
    return jsonResponse4({ error: "Failed to fetch news" }, 500);
  }
}
__name(onRequest5, "onRequest");

// api/proxy-image.js
async function onRequest6(context2) {
  const { request } = context2;
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get("url");
  if (!imageUrl) {
    return new Response("URL parameter required", { status: 400 });
  }
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 502 });
    }
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageData = await response.arrayBuffer();
    return new Response(imageData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error3) {
    return new Response("Error fetching image", { status: 500 });
  }
}
__name(onRequest6, "onRequest");

// api/stock-profile.js
var STOCK_NAMES = {
  // Saudi Stocks
  "2222.SR": "Saudi Aramco",
  "1120.SR": "Al Rajhi Bank",
  "2010.SR": "SABIC",
  "7010.SR": "STC",
  "2082.SR": "ACWA Power",
  "1180.SR": "Saudi National Bank",
  "2050.SR": "Savola",
  "1150.SR": "Alinma",
  "1010.SR": "Riyad Bank",
  "1211.SR": "Ma'aden",
  "4200.SR": "Aldrees",
  "4002.SR": "Mouwasat",
  // Egypt Stocks
  "COMI.CA": "CIB Bank",
  "HRHO.CA": "EFG Hermes",
  "TMGH.CA": "TMG Holding",
  "SWDY.CA": "Elsewedy",
  "ETEL.CA": "Telecom Egypt",
  "FWRY.CA": "Fawry",
  // US Stocks
  "AAPL": "Apple",
  "MSFT": "Microsoft",
  "GOOG": "Alphabet",
  "AMZN": "Amazon",
  "TSLA": "Tesla",
  "NVDA": "Nvidia",
  "META": "Meta"
};
var jsonResponse5 = /* @__PURE__ */ __name((data, status = 200, cacheSeconds = 60) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": `s-maxage=${cacheSeconds}, stale-while-revalidate=120`
    }
  });
}, "jsonResponse");
var fetchQuoteSummary = /* @__PURE__ */ __name(async (symbol) => {
  const modules = ["price", "summaryDetail", "summaryProfile", "financialData", "defaultKeyStatistics"].join(",");
  const url = `https://query1.finance.yahoo.com/v11/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.quoteSummary?.result?.[0] || null;
}, "fetchQuoteSummary");
var fetchQuote = /* @__PURE__ */ __name(async (symbol) => {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.quoteResponse?.result?.[0] || null;
}, "fetchQuote");
async function onRequest7(context2) {
  const { request } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol");
  if (!symbol) {
    return jsonResponse5({ error: "Symbol required" }, 400);
  }
  try {
    console.log(`\u{1F4CA} Fetching full profile for ${symbol}...`);
    const [quoteSummary, quote] = await Promise.all([
      fetchQuoteSummary(symbol).catch(() => null),
      fetchQuote(symbol).catch(() => null)
    ]);
    if (!quoteSummary && !quote) {
      return jsonResponse5({ error: "Stock not found", symbol }, 404);
    }
    const price = quoteSummary?.price || {};
    const summaryDetail = quoteSummary?.summaryDetail || {};
    const summaryProfile = quoteSummary?.summaryProfile || {};
    const financialData = quoteSummary?.financialData || {};
    const keyStats = quoteSummary?.defaultKeyStatistics || {};
    const stockData = {
      // Basic Info
      symbol,
      shortName: quote?.shortName || price?.shortName || STOCK_NAMES[symbol] || symbol,
      longName: quote?.longName || price?.longName || STOCK_NAMES[symbol] || symbol,
      exchange: quote?.exchange || price?.exchange || "Unknown",
      currency: quote?.currency || price?.currency || (symbol.includes(".SR") ? "SAR" : symbol.includes(".CA") ? "EGP" : "USD"),
      // Price Data
      price: quote?.regularMarketPrice || price?.regularMarketPrice || 0,
      change: quote?.regularMarketChange || price?.regularMarketChange || 0,
      changePercent: quote?.regularMarketChangePercent || price?.regularMarketChangePercent || 0,
      prevClose: quote?.regularMarketPreviousClose || summaryDetail?.previousClose || 0,
      open: quote?.regularMarketOpen || summaryDetail?.open || 0,
      high: quote?.regularMarketDayHigh || summaryDetail?.dayHigh || 0,
      low: quote?.regularMarketDayLow || summaryDetail?.dayLow || 0,
      volume: quote?.regularMarketVolume || summaryDetail?.volume || 0,
      averageVolume: summaryDetail?.averageVolume || 0,
      // 52-Week Range
      fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow || 0,
      // Moving Averages
      fiftyDayAverage: summaryDetail?.fiftyDayAverage || 0,
      twoHundredDayAverage: summaryDetail?.twoHundredDayAverage || 0,
      // Risk
      beta: summaryDetail?.beta || 0,
      // Valuation
      marketCap: quote?.marketCap || summaryDetail?.marketCap || 0,
      trailingPE: summaryDetail?.trailingPE || 0,
      forwardPE: summaryDetail?.forwardPE || 0,
      priceToBook: keyStats?.priceToBook || 0,
      // Earnings
      trailingEps: keyStats?.trailingEps || 0,
      forwardEps: keyStats?.forwardEps || 0,
      // Profitability
      profitMargins: financialData?.profitMargins || 0,
      returnOnEquity: financialData?.returnOnEquity || 0,
      // Revenue
      totalRevenue: financialData?.totalRevenue || 0,
      revenueGrowth: financialData?.revenueGrowth || 0,
      // Dividends
      dividendYield: summaryDetail?.dividendYield || 0,
      trailingAnnualDividendYield: summaryDetail?.trailingAnnualDividendYield || 0,
      // Shares
      sharesOutstanding: keyStats?.sharesOutstanding || 0,
      // Analyst
      targetMeanPrice: financialData?.targetMeanPrice || 0,
      numberOfAnalystOpinions: financialData?.numberOfAnalystOpinions || 0,
      recommendationKey: financialData?.recommendationKey || "none",
      // Company Profile
      sector: summaryProfile?.sector || quote?.sector || "Unknown",
      industry: summaryProfile?.industry || "Unknown",
      country: summaryProfile?.country || "Unknown",
      website: summaryProfile?.website || "",
      description: summaryProfile?.longBusinessSummary || "",
      // Metadata
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      source: "yahoo-finance"
    };
    console.log(`\u2705 Stock profile fetched for ${symbol}`);
    return jsonResponse5(stockData, 200, 60);
  } catch (error3) {
    console.error(`\u274C Stock Profile API Error for ${symbol}:`, error3.message);
    return jsonResponse5({
      error: "Failed to fetch stock profile",
      message: error3.message,
      symbol
    }, 500);
  }
}
__name(onRequest7, "onRequest");

// api/stocks.js
var SAUDI_STOCKS = [
  "2222.SR",
  "1120.SR",
  "2010.SR",
  "7010.SR",
  "2082.SR",
  "1180.SR",
  "2380.SR",
  "4030.SR",
  "2350.SR",
  "4200.SR",
  "1211.SR",
  "4001.SR",
  "2310.SR",
  "4003.SR",
  "2050.SR",
  "1150.SR",
  "4190.SR",
  "2290.SR",
  "4002.SR",
  "1010.SR",
  "2020.SR",
  "2280.SR",
  "5110.SR",
  "1140.SR",
  "1060.SR",
  "7200.SR",
  "4220.SR",
  "4090.SR",
  "4040.SR",
  "^TASI.SR"
];
var EGYPT_STOCKS = [
  "COMI.CA",
  "EAST.CA",
  "HRHO.CA",
  "TMGH.CA",
  "SWDY.CA",
  "ETEL.CA",
  "AMOC.CA",
  "EKHO.CA",
  "HELI.CA",
  "ORAS.CA",
  "ESRS.CA",
  "ABUK.CA",
  "MFPC.CA",
  "ISPH.CA",
  "PHDC.CA",
  "AUTO.CA",
  "CIEB.CA",
  "FWRY.CA",
  "ADIB.CA",
  "^CASE30"
];
var GLOBAL_TICKERS = [
  "^GSPC",
  "^DJI",
  "^IXIC",
  "^FTSE",
  "^GDAXI",
  "^N225",
  "BZ=F",
  "GC=F",
  "AAPL",
  "MSFT",
  "GOOG",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
  "AMD",
  "INTC",
  "JPM",
  "V",
  "MA",
  "WMT",
  "HD",
  "PG",
  "KO",
  "PEP",
  "DIS",
  "NKE"
];
var COMPANY_DOMAINS = {
  "2222.SR": "aramco.com",
  "1120.SR": "alrajhibank.com.sa",
  "2010.SR": "sabic.com",
  "7010.SR": "stc.com.sa",
  "2082.SR": "acwapower.com",
  "1180.SR": "alahli.com",
  "2050.SR": "savola.com",
  "1150.SR": "alinma.com",
  "1010.SR": "riyadbank.com",
  "1211.SR": "maaden.com.sa",
  "4200.SR": "aldrees.com",
  "4002.SR": "mouwasat.com",
  "^TASI.SR": "saudiexchange.sa",
  "^CASE30": "egx.com.eg",
  "COMI.CA": "cibeg.com",
  "ORAS.CA": "orascom.com",
  "FWRY.CA": "fawry.com",
  "AAPL": "apple.com",
  "MSFT": "microsoft.com",
  "GOOG": "google.com",
  "AMZN": "amazon.com",
  "TSLA": "tesla.com",
  "NVDA": "nvidia.com",
  "META": "meta.com",
  "NFLX": "netflix.com",
  "^GSPC": "spglobal.com",
  "^DJI": "dowjones.com",
  "^IXIC": "nasdaq.com"
};
var getLogoUrl = /* @__PURE__ */ __name((symbol) => {
  const domain2 = COMPANY_DOMAINS[symbol];
  return domain2 ? `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain2}&size=128` : null;
}, "getLogoUrl");
var GLOBAL_META = {
  "^GSPC": { name: "S&P 500", country: "\u{1F1FA}\u{1F1F8}", sector: "Index" },
  "^DJI": { name: "Dow Jones", country: "\u{1F1FA}\u{1F1F8}", sector: "Index" },
  "^IXIC": { name: "Nasdaq", country: "\u{1F1FA}\u{1F1F8}", sector: "Index" },
  "^FTSE": { name: "FTSE 100", country: "\u{1F1EC}\u{1F1E7}", sector: "Index" },
  "^GDAXI": { name: "DAX", country: "\u{1F1E9}\u{1F1EA}", sector: "Index" },
  "^N225": { name: "Nikkei 225", country: "\u{1F1EF}\u{1F1F5}", sector: "Index" },
  "BZ=F": { name: "Oil (Brent)", country: "\u{1F6E2}\uFE0F", sector: "Commodities" },
  "GC=F": { name: "Gold", country: "\u{1F947}", sector: "Commodities" },
  "AAPL": { name: "Apple", country: "\u{1F1FA}\u{1F1F8}", sector: "Technology" },
  "MSFT": { name: "Microsoft", country: "\u{1F1FA}\u{1F1F8}", sector: "Technology" },
  "GOOG": { name: "Alphabet", country: "\u{1F1FA}\u{1F1F8}", sector: "Technology" },
  "AMZN": { name: "Amazon", country: "\u{1F1FA}\u{1F1F8}", sector: "Consumer Cyclical" },
  "TSLA": { name: "Tesla", country: "\u{1F1FA}\u{1F1F8}", sector: "Consumer Cyclical" },
  "NVDA": { name: "Nvidia", country: "\u{1F1FA}\u{1F1F8}", sector: "Technology" },
  "META": { name: "Meta", country: "\u{1F1FA}\u{1F1F8}", sector: "Technology" },
  "NFLX": { name: "Netflix", country: "\u{1F1FA}\u{1F1F8}", sector: "Communication" },
  "2222.SR": { name: "Saudi Aramco", country: "\u{1F1F8}\u{1F1E6}", sector: "Energy" },
  "1120.SR": { name: "Al Rajhi Bank", country: "\u{1F1F8}\u{1F1E6}", sector: "Financial" },
  "2010.SR": { name: "SABIC", country: "\u{1F1F8}\u{1F1E6}", sector: "Materials" },
  "7010.SR": { name: "STC", country: "\u{1F1F8}\u{1F1E6}", sector: "Telecom" },
  "2082.SR": { name: "ACWA Power", country: "\u{1F1F8}\u{1F1E6}", sector: "Utilities" },
  "1180.SR": { name: "SNB", country: "\u{1F1F8}\u{1F1E6}", sector: "Financial" },
  "^TASI.SR": { name: "TASI", country: "\u{1F1F8}\u{1F1E6}", sector: "Index" },
  "COMI.CA": { name: "CIB Bank", country: "\u{1F1EA}\u{1F1EC}", sector: "Financial" },
  "^CASE30": { name: "EGX 30", country: "\u{1F1EA}\u{1F1EC}", sector: "Index" }
};
var mapStockData = /* @__PURE__ */ __name((quote) => {
  if (!quote || !quote.symbol) return null;
  const symbol = quote.symbol;
  const isEg = EGYPT_STOCKS.includes(symbol) || symbol.includes(".CA");
  const isSa = SAUDI_STOCKS.includes(symbol) || symbol.includes(".SR");
  const meta = GLOBAL_META[symbol] || {};
  const price = quote.regularMarketPrice || quote.regularMarketOpen || quote.previousClose || 0;
  const prevClose = quote.regularMarketPreviousClose || quote.previousClose || price;
  let change = quote.regularMarketChange;
  let changePercent = quote.regularMarketChangePercent;
  if ((change === void 0 || change === 0) && prevClose > 0 && price > 0) {
    change = price - prevClose;
    changePercent = change / prevClose * 100;
  }
  return {
    symbol,
    name: meta.name || quote.shortName || quote.longName || symbol,
    category: isEg ? "EG" : isSa ? "SA" : "Global",
    country: meta.country || (isEg ? "\u{1F1EA}\u{1F1EC}" : isSa ? "\u{1F1F8}\u{1F1E6}" : "\u{1F1FA}\u{1F1F8}"),
    sector: meta.sector || quote.sector || null,
    logo: getLogoUrl(symbol),
    price,
    regularMarketPrice: price,
    change: change || 0,
    regularMarketChange: change || 0,
    changePercent: changePercent || 0,
    regularMarketChangePercent: changePercent || 0,
    prevClose,
    volume: quote.regularMarketVolume || quote.averageDailyVolume3Month || 0,
    marketCap: quote.marketCap,
    peRatio: quote.trailingPE,
    dividendYield: quote.trailingAnnualDividendYield,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
}, "mapStockData");
var jsonResponse6 = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "s-maxage=15, stale-while-revalidate=10"
    }
  });
}, "jsonResponse");
async function onRequest8(context2) {
  const { request, env: env2 } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  try {
    const url = new URL(request.url);
    const market = url.searchParams.get("market");
    let allTickers = [];
    if (market === "SA") allTickers = SAUDI_STOCKS;
    else if (market === "EG") allTickers = EGYPT_STOCKS;
    else if (market === "Global") allTickers = GLOBAL_TICKERS;
    else allTickers = [.../* @__PURE__ */ new Set([...SAUDI_STOCKS, ...EGYPT_STOCKS, ...GLOBAL_TICKERS])];
    const results = [];
    const chunkSize = 10;
    for (let i = 0; i < allTickers.length; i += chunkSize) {
      const chunk = allTickers.slice(i, i + chunkSize);
      const symbols = chunk.join(",");
      try {
        const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}`;
        const response = await fetch(yahooUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        });
        if (response.ok) {
          const data2 = await response.json();
          if (data2.quoteResponse?.result) {
            results.push(...data2.quoteResponse.result);
          }
        }
      } catch (err) {
        console.error(`Chunk fetch failed:`, err.message);
      }
      if (i + chunkSize < allTickers.length) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }
    const data = results.map(mapStockData).filter((item) => item !== null);
    return jsonResponse6(data);
  } catch (e) {
    console.error("Stocks API Error:", e);
    return jsonResponse6({ error: "Failed to fetch stock data" }, 500);
  }
}
__name(onRequest8, "onRequest");

// api/translate.js
var jsonResponse7 = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}, "jsonResponse");
var translateChunk = /* @__PURE__ */ __name(async (chunk, targetLang) => {
  if (!chunk.trim()) return "";
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", targetLang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", chunk);
  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  if (!response.ok) return chunk;
  const data = await response.json();
  if (data && data[0]) {
    return data[0].map((s) => s[0]).join("");
  }
  return chunk;
}, "translateChunk");
async function onRequest9(context2) {
  const { request } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  if (request.method !== "POST") {
    return jsonResponse7({ error: "Method Not Allowed" }, 405);
  }
  try {
    const body = await request.json();
    const { text, targetLang = "ar" } = body;
    if (!text) {
      return jsonResponse7({ error: "Text required" }, 400);
    }
    const paragraphs = text.split(/\n+/);
    const translatedParagraphs = [];
    let currentChunk = "";
    for (const para of paragraphs) {
      if (currentChunk.length + para.length < 1500) {
        currentChunk += para + "\n\n";
      } else {
        if (currentChunk.trim()) {
          translatedParagraphs.push(await translateChunk(currentChunk, targetLang));
        }
        currentChunk = para + "\n\n";
      }
    }
    if (currentChunk.trim()) {
      translatedParagraphs.push(await translateChunk(currentChunk, targetLang));
    }
    const finalTranslation = translatedParagraphs.join("\n\n");
    return jsonResponse7({ translatedText: finalTranslation });
  } catch (error3) {
    console.error("Translation Error:", error3.message);
    try {
      const body = await request.json();
      return jsonResponse7({ translatedText: body.text || "" });
    } catch {
      return jsonResponse7({ translatedText: "" });
    }
  }
}
__name(onRequest9, "onRequest");

// api/x-community.js
var CACHE_TTL2 = 10 * 60 * 1e3;
var tweetsCache = {
  data: null,
  timestamp: 0,
  perUser: {}
};
var ACCOUNT_CATEGORIES = {
  ELITE_ANALYST: "Elite Analyst",
  TECHNICAL_TRADER: "Technical",
  FUNDAMENTAL: "Fundamental",
  MARKET_NEWS: "News",
  TRADING_SIGNALS: "Signals",
  INFLUENCER: "Influencer",
  EDUCATOR: "Educator",
  CHART_MASTER: "Charts"
};
var DEMO_TWEETS = [
  { id: "d1", username: "THEWOLFOFTASI", displayName: "The Wolf of TASI", category: "Elite Analyst", tier: 1, content: "Major breakout on $1120 Al Rajhi Bank! Target 100 SAR. \u{1F680} #TASI", timestamp: (/* @__PURE__ */ new Date()).toISOString(), likes: 520, retweets: 120, replies: 45, engagementScore: 900 },
  { id: "d2", username: "Anas_S_Alrajhi", displayName: "Anas Al-Rajhi", category: "Elite Analyst", tier: 1, content: "Market sentiment shifting to Bullish. Focus on Petrochemicals. $2010 SABIC looks primed for a move.", timestamp: new Date(Date.now() - 36e5).toISOString(), likes: 340, retweets: 80, replies: 20, engagementScore: 600 },
  { id: "d3", username: "RiadhAlhumaidan", displayName: "Riyadh Al-Humaidan", category: "Elite Analyst", tier: 1, content: "Oil prices rebounding. Good for $2222 Aramco. Support at 32.5 holding strong.", timestamp: new Date(Date.now() - 72e5).toISOString(), likes: 210, retweets: 40, replies: 15, engagementScore: 400 },
  { id: "d4", username: "FutrueGlimpse", displayName: "Future Glimpse", category: "News", tier: 1, content: "Visualizing the liquidity flow into the banking sector. $1180 SNB leading the charge.", timestamp: new Date(Date.now() - 108e5).toISOString(), likes: 180, retweets: 30, replies: 10, engagementScore: 300 },
  { id: "d5", username: "ahmadammar1993", displayName: "Ahmad Ammar", category: "Influencer", tier: 1, content: "Technical View: TASI attempting to cross 12,000. Critical resistance. $7010 STC defensive play.", timestamp: new Date(Date.now() - 144e5).toISOString(), likes: 150, retweets: 25, replies: 8, engagementScore: 250 },
  { id: "d6", username: "Saad1100110", displayName: "Saad", category: "Technical", tier: 2, content: "Chart update for $4030 Bahri. Forming a cup and handle. Watch for volume.", timestamp: new Date(Date.now() - 18e6).toISOString(), likes: 120, retweets: 20, replies: 5, engagementScore: 200 },
  { id: "d7", username: "SenseiFund", displayName: "Sensei Fund", category: "Fundamental", tier: 1, content: "ACWA Power $2082 showing strong recurring revenue growth in latest financials. Long term hold.", timestamp: new Date(Date.now() - 21e6).toISOString(), likes: 90, retweets: 15, replies: 5, engagementScore: 180 },
  { id: "d8", username: "oqo888", displayName: "OQO", category: "Technical", tier: 2, content: "Quick scalp opportunity on $4002 Mouwasat. Entry 240, Target 245, Stop 238.", timestamp: new Date(Date.now() - 25e6).toISOString(), likes: 80, retweets: 10, replies: 2, engagementScore: 150 }
];
var TARGET_ACCOUNTS = [
  { username: "THEWOLFOFTASI", displayName: "The Wolf of TASI", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "Anas_S_Alrajhi", displayName: "Anas Al-Rajhi", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "RiadhAlhumaidan", displayName: "Riyadh Al-Humaidan", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "ahmadammar1993", displayName: "Ahmad Ammar", category: ACCOUNT_CATEGORIES.INFLUENCER, tier: 1 },
  { username: "FutrueGlimpse", displayName: "Future Glimpse", category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 1 },
  { username: "AlsagriCapital", displayName: "Alsagri Capital", category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
  { username: "Reda_Alidarous", displayName: "Reda Alidarous", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "Ezzo_Khrais", displayName: "Ezzo Khrais", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "King_night90", displayName: "King Night", category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 1 },
  { username: "ABU_KHALED2021", displayName: "Abu Khaled", category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 1 },
  { username: "malmuqti", displayName: "M. Al-Muqti", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "SenseiFund", displayName: "Sensei Fund", category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
  { username: "fahadmutadawul", displayName: "Fahad Mutadawul", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "Drfaresalotaibi", displayName: "Dr. Fares Al-Otaibi", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "oqo888", displayName: "OQO", category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
  { username: "Saad1100110", displayName: "Saad", category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
  { username: "29_shg", displayName: "29 SHG", category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
  { username: "ssaaeedd91", displayName: "Saeed 91", category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
  { username: "pro_chart", displayName: "Pro Chart", category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
  { username: "Joker_Chart", displayName: "Joker Chart", category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 1 },
  { username: "TasiElite", displayName: "TASI Elite", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 1 },
  { username: "Equity_Data", displayName: "Equity Data", category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 1 },
  { username: "BinSolaiman", displayName: "Bin Solaiman", category: ACCOUNT_CATEGORIES.FUNDAMENTAL, tier: 2 },
  { username: "WaelAlmutlaq", displayName: "Wael Al-Mutlaq", category: ACCOUNT_CATEGORIES.ELITE_ANALYST, tier: 2 },
  { username: "gchartt", displayName: "G Chart", category: ACCOUNT_CATEGORIES.CHART_MASTER, tier: 2 },
  { username: "MsaratSa", displayName: "Msarat SA", category: ACCOUNT_CATEGORIES.MARKET_NEWS, tier: 2 },
  { username: "khabeer999", displayName: "Khabeer", category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
  { username: "vip9tasi", displayName: "VIP TASI", category: ACCOUNT_CATEGORIES.TRADING_SIGNALS, tier: 2 },
  { username: "AhmedAllshehri", displayName: "Ahmed Al-Shehri", category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 },
  { username: "Saeed_AJ", displayName: "Saeed AJ", category: ACCOUNT_CATEGORIES.TECHNICAL_TRADER, tier: 2 }
];
var jsonResponse8 = /* @__PURE__ */ __name((data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "s-maxage=60, stale-while-revalidate=30"
    }
  });
}, "jsonResponse");
function getRelativeTime(date) {
  const seconds = Math.floor((/* @__PURE__ */ new Date() - date) / 1e3);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
__name(getRelativeTime, "getRelativeTime");
function calculateEngagementScore(tweet) {
  const likes = tweet.likes || 0;
  const retweets = tweet.retweets || 0;
  const replies = tweet.replies || 0;
  const tierBonus = tweet.tier === 1 ? 1.5 : tweet.tier === 2 ? 1.2 : 1;
  return Math.round((likes + retweets * 2 + replies * 3) * tierBonus);
}
__name(calculateEngagementScore, "calculateEngagementScore");
async function translateText2(text) {
  if (!text) return "";
  if (!/[\u0600-\u06FF]/.test(text)) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (response.ok) {
      const data = await response.json();
      if (data && data[0]) {
        return data[0].map((s) => s[0]).join("");
      }
    }
  } catch (e) {
    console.error("Translation error:", e.message);
  }
  return text;
}
__name(translateText2, "translateText");
async function translateTweetContent(tweet) {
  if (!tweet.content) return tweet;
  if (/[\u0600-\u06FF]/.test(tweet.content)) {
    tweet.translatedContent = await translateText2(tweet.content);
    tweet.originalLang = "ar";
  }
  return tweet;
}
__name(translateTweetContent, "translateTweetContent");
async function fetchFromSyndication(username) {
  try {
    const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    if (!response.ok) return null;
    const html = await response.text();
    const match2 = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
    if (!match2) return null;
    const data = JSON.parse(match2[1]);
    const timeline = data?.props?.pageProps?.timeline;
    if (!timeline?.entries) return null;
    const account = TARGET_ACCOUNTS.find((a) => a.username.toLowerCase() === username.toLowerCase());
    const tweets = [];
    const isValidTweet = /* @__PURE__ */ __name((text, hasMedia) => {
      if (hasMedia) return true;
      if (text.length < 15) return false;
      const KEYWORDS = [
        "tasi",
        "stock",
        "market",
        "price",
        "sar",
        "profit",
        "chart",
        "analy",
        "invest",
        "trade",
        "\u0633\u0648\u0642",
        "\u0627\u0633\u0647\u0645",
        "\u062A\u0627\u0633\u064A",
        "\u0633\u0647\u0645",
        "\u062A\u062F\u0627\u0648\u0644",
        "\u062A\u062D\u0644\u064A\u0644",
        "\u0641\u0646\u064A",
        "\u0645\u0627\u0644\u064A",
        "\u0627\u0631\u0628\u0627\u062D"
      ];
      if (/\b\d{4}\b/.test(text)) return true;
      return KEYWORDS.some((k) => text.toLowerCase().includes(k));
    }, "isValidTweet");
    for (const entry of timeline.entries) {
      if (entry.type !== "tweet") continue;
      const tweet = entry.content?.tweet;
      if (!tweet) continue;
      const images = [];
      const mediaSource = tweet.extended_entities?.media || tweet.entities?.media || [];
      for (const media of mediaSource) {
        if (media.type === "photo" && media.media_url_https) {
          images.push(media.media_url_https);
        }
      }
      const text = tweet.full_text || tweet.text || "";
      if (text.startsWith("RT @")) continue;
      const cleanText = text.replace(/https:\/\/t\.co\/\w+$/g, "").trim();
      const isElite = account?.category === "Elite Analyst" || account?.category === "Charts";
      if (!isElite && !isValidTweet(cleanText, images.length > 0)) continue;
      const createdAt = tweet.created_at ? new Date(tweet.created_at) : /* @__PURE__ */ new Date();
      const tweetObj = {
        id: tweet.id_str || `${username}_${Date.now()}`,
        username,
        displayName: account?.displayName || tweet.user?.name || username,
        category: account?.category || "Influencer",
        tier: account?.tier || 3,
        profileImage: tweet.user?.profile_image_url_https?.replace("_normal", "_400x400") || null,
        content: cleanText,
        images,
        timestamp: createdAt.toISOString(),
        relativeTime: getRelativeTime(createdAt),
        url: `https://x.com/${username}/status/${tweet.id_str}`,
        likes: tweet.favorite_count || 0,
        retweets: tweet.retweet_count || 0,
        replies: tweet.reply_count || 0,
        source: "syndication"
      };
      tweetObj.engagementScore = calculateEngagementScore(tweetObj);
      tweets.push(tweetObj);
    }
    return tweets;
  } catch (e) {
    console.error(`Failed to fetch ${username}:`, e.message);
    return null;
  }
}
__name(fetchFromSyndication, "fetchFromSyndication");
async function fetchAllTweets() {
  console.log("\u{1F426} Fetching X Community tweets...");
  const shuffled = [...TARGET_ACCOUNTS].sort(() => Math.random() - 0.5);
  const accountsToFetch = shuffled.slice(0, 30);
  const allTweets = [];
  const batchSize = 6;
  for (let i = 0; i < accountsToFetch.length; i += batchSize) {
    const batch = accountsToFetch.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(async (account) => {
      await new Promise((r) => setTimeout(r, Math.random() * 500));
      return await fetchFromSyndication(account.username);
    }));
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        allTweets.push(...result.value);
      }
    });
  }
  allTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const uniqueTweetIds = /* @__PURE__ */ new Set();
  const uniqueTweets = [];
  for (const t of allTweets) {
    if (!uniqueTweetIds.has(t.id)) {
      uniqueTweetIds.add(t.id);
      uniqueTweets.push(t);
    }
  }
  console.log(`\u{1F310} Translating ${Math.min(uniqueTweets.length, 40)} tweets...`);
  for (let i = 0; i < Math.min(uniqueTweets.length, 40); i++) {
    await translateTweetContent(uniqueTweets[i]);
  }
  console.log(`\u2705 Total: ${uniqueTweets.length} tweets`);
  return uniqueTweets;
}
__name(fetchAllTweets, "fetchAllTweets");
function getTrendingTweets(tweets, limit = 20) {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1e3;
  return tweets.filter((t) => new Date(t.timestamp).getTime() > oneDayAgo).sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
}
__name(getTrendingTweets, "getTrendingTweets");
function getTopAnalystTweets(tweets, limit = 20) {
  return tweets.filter((t) => t.tier === 1 || t.category === "Elite Analyst").slice(0, limit);
}
__name(getTopAnalystTweets, "getTopAnalystTweets");
function getMostEngagedTweets(tweets, limit = 20) {
  return [...tweets].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
}
__name(getMostEngagedTweets, "getMostEngagedTweets");
function getFreshTweets(tweets, limit = 20) {
  return tweets.slice(0, limit);
}
__name(getFreshTweets, "getFreshTweets");
function getLeaderboardStats(tweets) {
  const userStats = {};
  tweets.forEach((tweet) => {
    if (!userStats[tweet.username]) {
      userStats[tweet.username] = {
        username: tweet.username,
        displayName: tweet.displayName,
        profileImage: tweet.profileImage,
        category: tweet.category,
        tier: tweet.tier,
        totalPosts: 0,
        totalEngagement: 0,
        avgEngagement: 0
      };
    }
    userStats[tweet.username].totalPosts++;
    userStats[tweet.username].totalEngagement += tweet.engagementScore;
  });
  Object.values(userStats).forEach((stat) => {
    stat.avgEngagement = Math.round(stat.totalEngagement / stat.totalPosts);
  });
  return Object.values(userStats).sort((a, b) => b.totalEngagement - a.totalEngagement).slice(0, 10);
}
__name(getLeaderboardStats, "getLeaderboardStats");
async function onRequest10(context2) {
  const { request } = context2;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "fresh";
  const refresh = url.searchParams.get("refresh");
  const now = Date.now();
  try {
    if (!refresh && tweetsCache.data && now - tweetsCache.timestamp < CACHE_TTL2) {
      let tweets2;
      switch (tab) {
        case "trending":
          tweets2 = getTrendingTweets(tweetsCache.data);
          break;
        case "top-analysts":
          tweets2 = getTopAnalystTweets(tweetsCache.data);
          break;
        case "most-engaged":
          tweets2 = getMostEngagedTweets(tweetsCache.data);
          break;
        default:
          tweets2 = getFreshTweets(tweetsCache.data);
      }
      return jsonResponse8({
        success: true,
        tab,
        tweets: tweets2,
        leaderboard: getLeaderboardStats(tweetsCache.data),
        accounts: TARGET_ACCOUNTS.length,
        totalTweets: tweetsCache.data.length,
        cached: true,
        fetchedAt: new Date(tweetsCache.timestamp).toISOString()
      });
    }
    let tweets = await fetchAllTweets();
    if (!tweets || tweets.length === 0) {
      console.log("\u26A0\uFE0F No live tweets found. Using DEMO data fallback.");
      tweets = DEMO_TWEETS;
    }
    tweetsCache.data = tweets;
    tweetsCache.timestamp = now;
    let filteredTweets;
    switch (tab) {
      case "trending":
        filteredTweets = getTrendingTweets(tweets);
        break;
      case "top-analysts":
        filteredTweets = getTopAnalystTweets(tweets);
        break;
      case "most-engaged":
        filteredTweets = getMostEngagedTweets(tweets);
        break;
      default:
        filteredTweets = getFreshTweets(tweets);
    }
    return jsonResponse8({
      success: true,
      tab,
      tweets: filteredTweets,
      leaderboard: getLeaderboardStats(tweets),
      accounts: TARGET_ACCOUNTS.length,
      totalTweets: tweets.length,
      cached: false,
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error3) {
    console.error("\u274C X Community API Error:", error3.message);
    return jsonResponse8({
      success: false,
      error: error3.message,
      tweets: DEMO_TWEETS,
      accounts: TARGET_ACCOUNTS.length
    }, 200);
  }
}
__name(onRequest10, "onRequest");

// ../.wrangler/tmp/pages-jgWIPd/functionsRoutes-0.5257884238453143.mjs
var routes = [
  {
    routePath: "/api/ai-insight",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/chart",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/chatbot",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/debug",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/news",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/proxy-image",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/stock-profile",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/stocks",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/translate",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  },
  {
    routePath: "/api/x-community",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest10]
  }
];

// ../node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-t6zvfJ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-t6zvfJ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.9959975755238467.mjs.map
