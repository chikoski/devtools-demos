var Particle = Particle || (function(){

  var Particle = function(x, y){
    this._x = x;
    this._y = y;
    this._size = 10;
    this._r = Math.floor(256 * Math.random());
    this._g = Math.floor(256 * Math.random());
    this._b = Math.floor(256 * Math.random());
    this._a = 208 + Math.floor(48 * Math.random());
  };

  Particle.prototype = {
    get x(){
      return this._x;
    },
    get y(){
      return this._y;
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
    update(app){
      this.updatePosition(app);
      app.context.fillStyle = this.color;
      app.context.fillRect(this.x, this.y,
                           this.width, this.height);
    },
    updatePosition(app){
      var dice = Math.random();
      if(dice < 0.2){
        this._x = Math.max(0, this.x - Math.floor(this.width * 0.5));
      }else if(dice < 0.4){
        this._x = Math.min(app.width - this.width,
                           this.x + Math.floor(this.width * 0.5));
      }else if(dice < 0.6){
        this._y = Math.max(0, this.y - Math.floor(this.height * 0.5));
      }else if(dice < 0.8){
        this._y = Math.min(app.height - this.height,
                           this.y + Math.floor(this.height * 0.5));
      }
    }
  };

  return Particle;
})();

var App = App || (function(){

  var App = function(){
    this.initialize.apply(this, arguments);
  };

  App.prototype = {
    initialize: function(canvas){
      var pressed = false;
      this._el = canvas;
      this._el.addEventListener("click", event => {
        this.addParticle(new Particle(event.offsetX,
                                      event.offsetY));
      });
      this._el.addEventListener("mousedown", event => {
        pressed = true;
      });
      this._el.addEventListener("mouseup", event => {
        pressed = false;
      });
      this._el.addEventListener("mousemove", event => {
        if(pressed){
          this.addParticle(new Particle(event.offsetX,
                                        event.offsetY));
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
    update: function(){
      var context = this.context;
      context.fillStyle = "rgba(51, 51, 51, .4)";
      context.fillRect(0, 0, this.width, this.height);
      this._particles.forEach(particle => {
        particle.update(this);
      });
      window.requestAnimationFrame(event =>{
        this.update();
      });
    },
    addParticle: function(particle){
      this._particles.push(particle);
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
