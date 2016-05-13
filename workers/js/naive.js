function fib(n){
  if(n < 2){
    return 1;
  }
  return fib(n-1)+fib(n-2);
}

window.addEventListener("load", e => {
  const log = document.querySelector("#log");
  const button = document.querySelector("#worker1");
  var counter = 1;
  button.addEventListener("click",  e => {
    log.value += fib(counter) + "\n";
    counter = counter + 1;
  });
});
