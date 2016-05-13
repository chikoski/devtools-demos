window.addEventListener("load", e => {
  var f = function(i){
    return e =>{
      const id = i;
      console.log("post message to worker" + id);
      if(this.workers && this.workers[id]){
        this.workers[id].postMessage("");
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

  app.start(new Worker("worker/counter.js"),
            new Worker("worker/counter.js"));
});
