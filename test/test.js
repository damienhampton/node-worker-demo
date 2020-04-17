const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);


describe('1000 requests', function(){
  this.timeout(90000);
  let app;
  before(() => {
    app = require('../src/main');
  })
  after(() => {
    app.close();
  })
  it('should make 1000 requests', async () => {
    const p1 = Promise.all(range(20).map(async (r, ii) => {
      await sleep(ii*1000);
      try{
        const result = await chai.request(app).get('/a');
        console.log(result.body);
      }catch(e){
        console.log(e.message);
      }
    }));
    const p2 = (async () => {
      await sleep(2000);
      try{
        console.log('STARTING WORKER TASK')
        const res = await chai.request(app).get('/worker');
        console.log(res.body);
      }catch(e){
        console.log(e.message);
      }
    })();

    const p3 = (async () => {
      await sleep(10000);
      try{
        console.log('STARTING MAIN TASK')
        const res = await chai.request(app).get('/main');
        console.log(res.body);
      }catch(e){
        console.log(e.message);
      }
    })();

    const result = await Promise.all([p1, p2, p3]);
  })
})

const range = n => Array(n).fill(null);
const sleep = n => new Promise(resolve => setTimeout(resolve, n));