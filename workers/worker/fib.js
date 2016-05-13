function fib(n){
  if(n < 2){
    return 1;
  }
  return fib(n - 1) + fib(n - 2);
}

onmessage = function(e) {
  var n = e.data[0] || 1;
  console.log("fib(" + n + ")");
  var result = fib(n);
  postMessage(result);
}
