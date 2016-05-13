const App = (window => {

  const N = 10000;

  const list = n => f => {
    var result = [];
    for(let i = 0; i < n; i++){
      result.push(f(i));
    }
    return result;
  };

  const random = (min, max) => Math.random() * (max - min) + min;

  const generate =
          (min, max, floor) =>
          floor? Math.floor(random(min, max)): random(min, max);

  const color = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;

  const PrototypeParticle = function(){
    this.initialize.apply(this, arguments);
  };

  PrototypeParticle.prototype = {
    initialize: function(x, y){
      this.x = x;
      this.y = y;
      this.c = color(generate(128, 256, true),
                     0, 0,
                     generate(0.5, 1.0));
      this.w = 10;
      this.h = 10;
    },
    update: function(gl, time){
      this.render(gl);
    },
    render: function(gl){
      gl.fillStyle = this.c;
      gl.fillRect(this.x, this.y, this.w, this.h);
    },
    buffer: new Float64Array(100)
  };

  const UniqueParticle = function(x, y){
    this.x = x;
    this.y = y;
    this.c = color(0,
                   0,
                   generate(128, 256, true),
                   generate(0.5, 1.0));
    this.w = 10;
    this.h = 10;

    this.update = function(gl, time){
      this.render(gl);
    };

    this.render =  function(gl){
      gl.fillStyle = this.c;
      gl.fillRect(this.x, this.y, this.w, this.h);
    };

    this.buffer = new Float64Array(100);
  };


  const particleList =
          klass =>
          canvas =>
          list(N)(i => new klass(random(0, canvas.width - 10),
                                 random(0, canvas.height - 10)));

  const App =  function(canvas, buttons){
    this.canvas = canvas;
    this.gl = canvas.getContext("2d");
    this.buttons = buttons;
    this.particles = [];
    this.lastUpdate = 0;

    const prototypeParticles = particleList(PrototypeParticle);
    const uniqueParticles = particleList(UniqueParticle);

    const clear = () => {
      this.gl.fillStyle = "white";
      this.gl.fillRect(0, 0, canvas.width, canvas.height);
    };

    const update = (timestamp) => {
      const dt = timestamp - this.lastUpdate;
      clear();
      this.particles.forEach(particle =>
                             particle.update(this.gl, dt));
      this.lastUpdate = timestamp;
      requestAnimationFrame(update);
    };

    buttons.remove.addEventListener("click", e => {
      console.log("Discard all particle objects");
      this.particles = [];
    });

    buttons.prototype.addEventListener("click", e => {
      console.log(`Generate ${N} particles, of which methods are`
                  + ` defined in their prototype`);
      this.particles = prototypeParticles(canvas);
    });

    buttons.unique.addEventListener("click", e => {
      console.log(`Generate ${N} particles, of which methods are`
                  + ` defined as their unique methods`);
      this.particles = uniqueParticles(canvas);
    });

    update(this.lastUpdate);
  };

  return App;

})(window);
