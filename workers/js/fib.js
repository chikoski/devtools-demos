window.addEventListener("load", e => {
  var c = function(i){
    const id = i;
    var counter = 0;
    return e =>{
      console.log("post message to worker" + id);
      if(this.workers && this.workers[id]){
        console.log(counter);
        this.workers[id].postMessage([counter]);
        counter = counter + 1;
      }
    };
  };

  var m = function(id){
    return e => {
      this.log(id, e.data);
    };
  };

  var app = new App(c,
                    m,
                    document.querySelector("#log"),
                    document.querySelector("#worker1"));
  app.start(new Worker("worker/fib.js"));
});
