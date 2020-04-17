function hardwork(){
  let a = 0;
  for(let i = 0; i < 3000000000; i++){
    a++;
  }
  return a;
}

module.exports = hardwork;