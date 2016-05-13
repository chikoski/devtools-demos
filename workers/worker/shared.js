var counter;

onconnect = function(e) {
  e.ports.forEach(port =>{
    port.onmessage = e =>{
      counter = (counter || 0) + 1;
      console.log(counter);
      port.postMessage(counter);
    };
    port.start();
  });
};
