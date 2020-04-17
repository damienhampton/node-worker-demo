'use strict'
const express = require('express');
const { Worker } = require('worker_threads')

const hardwork = require('./hardwork');

const app = express();
const worker = new Worker(`${__dirname}/worker.js`);

worker.on('error', () => { throw Error('boo') });
// worker.on('exit', (code) => {
//   if (code !== 0)
//     throw Error(`Worker stopped with exit code ${code}`);
// })

function runWorkerTask(){
  return new Promise((resolve, reject) => {
    worker.on('message', resolve);
    worker.postMessage('Hey this is cool!');
  })
}

function runMainThreadTask(){
  return hardwork();
}

app.get('/a', (_, res) => {
  res.json({ message: 'ping '+lap() });
})

app.get('/main', (_, res) => {
  const value = runMainThreadTask()
  res.json({ message: 'MAIN THREAD TASK COMPLETE '+ value });
})

app.get('/worker', async (_, res) => {
  const value = await runWorkerTask();
  // const value = await runService();
  res.json({ message: 'WORKER THREAD TASK COMPLETE '+ value });
})

let time = Date.now();
function lap(){
  const result = Date.now() - time;
  time = Date.now();
  return (result / 1000).toFixed(2);
}

app.server = app.listen(3000)
app.close = () => {
  worker.terminate();
  app.server.close();
}

module.exports = app;
