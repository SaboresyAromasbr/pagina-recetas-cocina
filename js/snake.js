/* sonido del juego al apretar espacio*/ 
const sonidos = document.getElementById('sonidojuego');

document.addEventListener('keydown', function (evento) {
    if (evento.keyCode ==32) {
        sonidos.innerHTML = '<audio src="audio/audiojuego.mp3" autoplay></audio>';

    }
})

/*funcionamiento del juego*/

const STATE_RUNNING = 1;
const STATE_LOSING = 2; 
//tiempo en que se desplaza la serpiente//
const TICK = 80;
const SQUARE_SIZE = 10; //tamaño de los cuadros que se dibujan//
const BOARD_WIDTH = 50; //ancho y alto de los cuadritos//
const BOARD_HEIGHT = 50;
const GROW_SCALE = 10; // cuadritos de longitud, cuanto aumenta cuando come//
const DIRECTIONS_MAP = {
    'ArrowLeft': [-1,  0],
    'ArrowRight':[ 1,  0],
    'ArrowDown': [ 0,  1], //desplazamientos de la serpiente//
    'ArrowUp':   [ 0, -1],
    'arrowleft': [-1,  0],
    'arrowright':[ 1,  0],
    'arrowdown': [ 0,  1],
    'arrowup':   [ 0, -1],
  };
//espacio del juego donde esta la serpiente//

 let state = {
     canvas: null,
     context: null,
     snake: [{x: 0, y: 0}],
     direction: {x: 1, y: 0},
     prey: {x: 0, y: 0},
     growing: 0,
     runState: STATE_RUNNING
 };
//multiplicamos x,y //
 function randomXY() {
   return {
     x: parseInt(Math.random() * BOARD_WIDTH),
     y: parseInt(Math.random() * BOARD_HEIGHT)
   };

 }//desplazamiento de la serpiente//
 function tick() {
   const head = state.snake[0]; //cabeza de la serpiente del mismo tamaño de la presa//
   const dx = state.direction.x;
   const dy = state.direction.y;
   const highestIndex = state.snake.length - 1;
   let tail = {};
   let interval = TICK;

   Object.assign (tail, 
    state.snake[state.snake.length - 1]);

   let didScore = (
     head.x === state.prey.x 
     && head.y === state.prey.y  
   );

   if (state.runState === STATE_RUNNING) {
       for (let idx = highestIndex; idx > -1; idx--) {
           const sq = state.snake[idx];

           if (idx === 0) {
               sq.x += dx;
               sq.y += dy;
             } else {
               sq.x = state.snake[idx - 1].x;
               sq.y = state.snake[idx - 1].y; //crecimiento de la serpiente//
            }
        }
    } else if (state.runState === STATE_LOSING) {
      interval = 10;

      if (state.snake.length > 0) {
        state.snake.splice(0, 1);
      }

      if (state.snake.length === 0) {
        state.runState = STATE_RUNNING;//reinicio del juego //
        state.snake.push(randomXY());
        state.prey = randomXY(); 
      }
    }

    if (detectCollision()) {
      state.runState = STATE_LOSING;
      state.growing = 0;
    }

    if (didScore) { //colision con la presa y re-aparicion de presa//
      state.growing += GROW_SCALE; 
      state.prey = randomXY();
    }

    if (state.growing > 0) {
      state.snake.push(tail);
      state.growing -= 1;
    }

   requestAnimationFrame(draw);
   setTimeout(tick, interval);
 }

 function detectCollision() { //cuando colisiona con las orillas el x de la cabeza debe ser menor a 0//
   const head = state.snake[0];

   if (head.x < 0
     || head.x >= BOARD_WIDTH
     || head.y >= BOARD_HEIGHT
     || head.y < 0
   ) {
     return true; 
   }

   for (var idx = 1; idx < state.snake.length; idx++){
     const sq = state.snake[idx];

     if (sq.x === head.x && sq.y === head.y) {
       return true;
     }
   }

   return false;
 }
//funcion para dibujar los cuadritos//
 function drawPixel(color, x, y) {
     state.context.fillStyle = color;
     state.context.fillRect(  
         x * SQUARE_SIZE,
         y * SQUARE_SIZE,
         SQUARE_SIZE,
         SQUARE_SIZE
       );
    }
//funcion de  dibujo, puntos que abarca la serpiente, tomando los valores de x,y//
 function draw() {
     state.context.clearRect(0, 0, 500, 500);

     for (var idx = 0; idx < state.snake.length; idx++) {
         const {x, y} = state.snake[idx];
         drawPixel('#f2fa0a', x, y);
       }
//cambiar color a la comida//

     const {x, y} = state.prey; //dibujo de presa//
     drawPixel('red', x, y);
    }

 window.onload = function() {
   state.canvas = document.querySelector('canvas');
   state.context = state.canvas.getContext('2d');

   window.onkeydown = function(e) {
    const direction = DIRECTIONS_MAP[e.key];
//funcion de teclas, direccion//
     if (direction) {
       const [x, y] = direction;
       if (-x !== state.direction.x 
         && -y !== state.direction.y)
       {
          state.direction.x = x;
          state.direction.y = y;
        }

    
      }
    }
    

   tick();

 };
