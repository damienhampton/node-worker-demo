const { parentPort } = require('worker_threads')
const hardwork = require('./hardwork');

parentPort.on('message', (message) => {
  // console.log(message);
  const value = hardwork();
  parentPort.postMessage(value);
})