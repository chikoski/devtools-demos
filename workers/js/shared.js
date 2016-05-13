window.addEventListener("load", e => {
  var f = function(i){
    return e =>{
      const id = i;
      console.log("post message to worker" + id);
      if(this.workers && this.workers[id]){
        this.workers[id].port.postMessage("");
      }
    };
  };

  var m = function(id){
    return e => {
      this.log(id, e.data);
    };
  };

  var app = new App(f,
                    m,
                    document.querySelector("#log"),
                    document.querySelector("#worker1"),
                    document.querySelector("#worker2"));
  var w1 = new SharedWorker("worker/shared.js");
  w1.port.start();
  var w2 = new SharedWorker("worker/shared.js");
  w2.port.start();
  app.start(w1, w2);
});
