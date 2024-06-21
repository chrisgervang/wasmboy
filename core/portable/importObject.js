// Import object for our core js wrapper

import { WORKER_MESSAGE_TYPE } from '../../lib/worker/constants';
import { getSmartWorkerMessage } from '../../lib/worker/smartworker';

// Log throttling for our core
// The same log can't be output more than once every half second
let logRequest = {};

const logTimeout = (id, message, timeout) => {
  if (!logRequest[id]) {
    logRequest[id] = true;
    log(id, message);
    setTimeout(() => {
      delete logRequest[id];
    }, timeout);
  }
};

const log = (arg0, arg1) => {
  // Grab our arguments, and log as hex
  let logString = '[WasmBoy]';
  if (arg0 !== -9999) logString += ` 0x${arg0.toString(16)} `;
  if (arg1 !== -9999) logString += ` 0x${arg1.toString(16)} `;

  console.log(logString);
};

const onMemoryWriteHandler = (arg0, arg1) => {
  postMessage(getSmartWorkerMessage({ type: WORKER_MESSAGE_TYPE.ON_MEMORY_WRITE, address: arg0, value: arg1 }));
};

// https://github.com/AssemblyScript/assemblyscript/issues/384
const wasmImportObject = {
  index: {
    consoleLog: log,
    consoleLogTimeout: logTimeout,
    onMemoryWriteHandler
  },
  env: {
    abort: () => {
      console.error('AssemblyScript Import Object Aborted!');
    }
  }
};

export default wasmImportObject;
