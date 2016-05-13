var App = (function(){

  function toArray(args){
    var result  =[];
    for(var i = 0; i < args.length; i = i + 1){
      result[i] = args[i];
    }
    return result;
  }
  function skip(array, times){
    while(times > 0){
      array.shift();
      times = times - 1;
    }
    return array;
  }

  var Klass = function(){
    this.initialize.apply(this, arguments);
  };

  Klass.prototype = {
    initialize: function(create, onMessage, logElement){
      this.createHandler = create;
      this.onMessage = onMessage;
      this.el = {
        log: logElement,
        buttons: skip(toArray(arguments), 3)
      };
      window.addEventListener("unload", e =>{
        this.stop();
      });
      var i  = 0;
      this.el.buttons.forEach(button => {
        button.addEventListener("click",
                                this.createHandler(i));
        i = i + 1;
      });
    },
    start: function(){
      console.log(toArray(arguments));
      this.workers = toArray(arguments);
      console.log(this);
      var i  = 1;
      this.workers.forEach(worker => {
        let id = i;
        if(worker.port){
          worker.port.onmessage =
            this.onMessage(i);
        }else{
          worker.onmessage = this.onMessage(i);
        }
        i =  i + 1;
      });
    },
    stop: function(){
      if(this.workers){
        this.workers.forEach(worker =>{
          worker.terminate();
        });
        this.workers = [];
      }
    },
    log: function(id, data){
      var message = "worker"  + id + ":" + data;
      this.el.log.value +=
        message + "\n";
    }
  };

  return Klass;

})();
