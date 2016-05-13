const Vector = (global => {

  const vect2d = function(x, y){
    this._view = new Float32Array([x, y]);
    this._view[0] = x || 0.0;
    this._view[1] = y || 0.0;
  };

  vect2d.prototype = {
    get x(){
      return this._view[0];
    },
    get y(){
      return this._view[1];
    },
    add: function(vect){
      return new vect2d(vect.x + this.x,
                        vect.y + this.y);
    },
    add$: function(vect){
      this._view[0] = this.x + vect.x;
      this._view[1] = this.y + vect.y;
      return this;
    },
    times: function(value){
      if(typof(value) !== "number"){
        return this;
      }
      return new Vector(this.x * value, this.y * value);
    },
    times$: function(value){
      if(typof(value) == "number"){
        this._view[0] = this.x * value;
        this._view[1] = this.y * value;
      }
      return this;
    }
  };

  vect2d.generate = function(maxAngle, minLength, maxLength){
    var angle = (maxAngle * Math.random() - maxAngle / 2) / 180 * Math.PI;
    var length = (maxLength - minLength) * Math.random() + minLength;

    var x = Math.cos(angle) * length;
    var y = Math.sin(angle) * length;

    return new vect2d(x, y);
  };

  return vect2d;

})(window);


var Particle = Particle || (function(){

  var Particle = function(x, y){
    this._position = new Vector(x, y);
    this._velocity = Vector.generate(30, 2, 5);
    this._size = 10;
    this._r = Math.floor(256 * Math.random());
    this._g = Math.floor(256 * Math.random());
    this._b = Math.floor(256 * Math.random());
    this._a = 208 + Math.floor(48 * Math.random());
  };

  Particle.prototype = {
    get position(){
      return this._position;
    },
    get velocity(){
      return this._velocity;
    },
    get x(){
      return this.position.x;
    },
    get y(){
      return this.position.y;
    },
    get width(){
      return this._size;
    },
    get height(){
      return this._size;
    },
    get color(){
      return "rgba(" + [this._r, this._g, this._b, this._a].join(",") + ")";
    },
    update(app, dt){
      this.updatePosition(app, dt);
      app.context.fillStyle = this.color;
      app.context.fillRect(this.x, this.y,
                           this.width, this.height);
    },
    updatePosition(app, dt){
      this._position = this.position.add$(this.velocity);
    }
  };

  return Particle;
})();

var App = App || (function(){

  var App = function(){
    this.initialize.apply(this, arguments);
  };

  var N = 20;
  App.prototype = {
    initialize: function(canvas){
      this._el = canvas;
      this.latest = null;
      this.lastUpdate = 0;
      this.el.addEventListener("mousedown", event =>{
//        this.pressed = true;
//        this.addParticleFromEvent(event);
        this.latest = event;
      });
      this.el.addEventListener("mouseup", event =>{
//        this.pressed = false;
        this.latest = null;
      });
      this.el.addEventListener("mousemove", event => {
        if(this.latest){
//          this.addParticleFromEvent(event);
          this.latest = event;
        }
      });

      this._particles = [];
    },
    get context(){
      if(this._context == null){
        this._context = this.el.getContext("2d");
      }
      return this._context;
    },
    get el(){
      return this._el;
    },
    get width(){
      return this.el.width;
    },
    get height(){
      return this.el.height;
    },
    start: function(){
      this.update();
    },
    update: function(timestamp){
      const dt = Math.max(1, (timestamp - this.lastUpdate) / 16.66);
      this.lastUpdate = timestamp;
      if(this.latest){
        this.addParticleFromEvent(this.latest);
      }
//      this.naiveUpdate();
      this.improvedUpdate(dt);
//      this.updateWithFibonacci();
      window.requestAnimationFrame(timestamp => this.update(timestamp));
    },
    naiveUpdate: function(){
      var context = this.context;
      context.fillStyle = "rgba(51, 51, 51, .4)";
      context.fillRect(0, 0, this.width, this.height);
      this._particles.forEach(particle => {
        particle.update(this);
      });
    },
    improvedUpdate: function(dt){
      var context = this.context;
      context.fillStyle = "rgba(51, 51, 51, .4)";
      context.fillRect(0, 0, this.width, this.height);
      this._particles.forEach((particle, index, array) => {
        particle.update(this, dt);
        if(this.width < particle.x ||  particle.y < 0 || this.height <  particle.y){
          array.splice(index, 1);
        }
      });
    },
    updateWithFibonacci(){
      var value = this.fibonacci(35);
      this.naiveUpdate();
    },
    fibonacci(n){
      if(n <= 1){
        return 1;
      }
      return this.fibonacci(n-1) + this.fibonacci(n-2);
    },
    addParticle: function(particle){
      this._particles.push(particle);
    },
    addParticleFromEvent: function(event){
      for(var i = 0; i < N; i++){
        this.addParticle(new Particle(event.clientX,
                                      event.clientY));
      }
    }
  };

  return App;

})();

window.addEventListener("load", function(event){
  var body = document.querySelector("body");
  var canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  body.appendChild(canvas);

  var app = new App(canvas);
  app.start();
});
