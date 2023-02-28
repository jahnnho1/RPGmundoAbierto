//import Persona from './persona.js';

window.addEventListener("load", iniciarJuego);
const $ = (selector) => document.getElementById(selector);
let jugadorId = null;
let enemigoId = null;
let ataqueJugador;
let ataqueEnemigo;
let resultadoCombate;
let vidaJugador = 5;
let vidaEnemigo = 5;
let estadoEjecuccionJuego = true;
let mascotas = [];
let mascotasEnemigas = [];
let opcionDeMascota;
let btnMascota1;
let btnMascota2;
let btnMascota3;
let mascotaJugadorSeleccionada;
let mascotaEnemigoSeleccionada;
let turnosMaximos = 5;
let historialAtaqueJugador = [];
let historialAtaqueEnemigo = [];
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./assets/mokemap.png";

const seleccionarAtaque = $("seleccionar-ataque");
const botonReiniciar = $("boton-reiniciar");
const botonMascota = $("boton-mascota");

const seleccionarMascota = $("seleccionar-mascota");
const spanMascotaJugador = $("mascota-jugador");
const titulojugador = $("titulo-jugador");

const spanMascotaEnemigo = $("mascota-enemigo");
const tituloEnemigo = $("titulo-enemigo");

const spanVidaEnemigo = $("vidas-enemigo");
const spanVidaJugador = $("vidas-jugador");

const sectionMensajes = $("mensajes");
const seccionElegirAtaque = $("elige-ataque");
const resultadoBatalla = $("resultadoBatalla");

const verMapa = $("ver-mapa");
const mapa = $("mapa");
let lienzo = mapa.getContext("2d");

let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 350;
mapa.width =
  anchoDelMapa > anchoMaximoDelMapa ? anchoMaximoDelMapa - 20 : anchoDelMapa;
alturaQueBuscamos = (mapa.width * 600) / 800;
mapa.height = alturaQueBuscamos;

const sectionTarjetas = $("tarjetas");

class Mascota {
  constructor(nombre, foto, vida, fotoMapa, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.foto = foto;
    this.vida = vida;
    this.ataques = [];
    this.ancho = 40;
    this.alto = 40;
    this.x = aleatorio(0, mapa.width - this.ancho);
    this.y = aleatorio(0, mapa.height - this.alto);
    this.mapaFoto = new Image();
    this.mapaFoto.src = fotoMapa;
    this.velocidadX = 0;
    this.velocidadY = 0;
  }

  pintarMascota() {
    lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
  }
}

let hipodoge = new Mascota(
  "hipodoge",
  "assets/mokepons_mokepon_hipodoge_attack.png",
  3,
  "./assets/hipodoge.png"
);
let capipepo = new Mascota(
  "capipepo",
  "assets/mokepons_mokepon_capipepo_attack.png",
  3,
  "./assets/capipepo.png"
);
let ratigueya = new Mascota(
  "ratigueya",
  "assets/mokepons_mokepon_ratigueya_attack.png",
  3,
  "./assets/ratigueya.png"
);

hipodoge.ataques.push(
  { nombre: "💧", id: "boton-agua" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🌱", id: "boton-tierra" }
);
capipepo.ataques.push(
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "🌱", id: "boton-tierra" }
);
ratigueya.ataques.push(
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "💧", id: "boton-agua" }
);
mascotas.push(hipodoge, capipepo, ratigueya);

function iniciarJuego() {
  seleccionarAtaque.hidden = true;
  botonReiniciar.addEventListener("click", reiniciarJuego);
  unirseAlJuego();
  resultadoBatalla.style.display = "none";
  verMapa.style.display = "none";
  mascotas.forEach((objMascota) => {
    opcionDeMascota = ` <input type="radio" name="mascota" id="${objMascota.nombre}" />
                          <label class="tarjeta-de-mokepon" for="${objMascota.nombre}">
                            <p>${objMascota.nombre}</p>
                            <img src="${objMascota.foto}" alt="${objMascota.nombre}"/>
                          </label> `;
    sectionTarjetas.innerHTML += opcionDeMascota;
  });
  btnMascota1 = $("hipodoge");
  btnMascota2 = $("capipepo");
  btnMascota3 = $("ratigueya");
  botonMascota.addEventListener("click", seleccionarMascotaJugador);
  botonReiniciar.style.display = "none";
}

function unirseAlJuego() {
  fetch("http://localhost:8080/unirse").then(function (res) {
    if (res.ok) {
      res.text().then(function (respuesta) {
        jugadorId = respuesta;
      });
    }
  });
}

function seleccionarMascotaJugador() {
  mascotas.forEach((objMascota) => {
    if (btnMascota1.checked && btnMascota1.id == objMascota.nombre) {
      mascotaJugadorSeleccionada = objMascota;
    } else if (btnMascota2.checked && btnMascota2.id == objMascota.nombre) {
      mascotaJugadorSeleccionada = objMascota;
    } else if (btnMascota3.checked && btnMascota3.id == objMascota.nombre) {
      mascotaJugadorSeleccionada = objMascota;
    }
  });
  if (mascotaJugadorSeleccionada) {
    seleccionarMascotaFuncion(mascotaJugadorSeleccionada);
    spanMascotaJugador.innerHTML = mascotaJugadorSeleccionada.nombre;
    titulojugador.innerHTML = mascotaJugadorSeleccionada.nombre;
    agregarImg(mascotaJugadorSeleccionada.foto, "Jugador");
  } else {
    alert("Selecciona una mascota");
    return;
  }
  verMapa.style.display = "flex";
  seleccionarMascota.style.display = "none";
  iniciarMapa();
  let DivAtaques = $("seleccion-ataque");
  mascotaJugadorSeleccionada.ataques.forEach((ataques) => {
    boton = ` <button id="${ataques.id}" class="boton-de-ataque" onclick="realizarAtaque('${ataques.id}', this)"> ${ataques.nombre}  </button>`;
    DivAtaques.innerHTML += boton;
  });
}

function seleccionarMascotaFuncion(mascotaJugadorSeleccionada) {
  fetch(`http://localhost:8080/mascota/${jugadorId}`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ mascota: mascotaJugadorSeleccionada }),
  });
}

function seleccionarMascotaEnemigo(enemigo) {
  mascotas.forEach((mascotaObj) => {
    if (mascotaObj.nombre == enemigo.nombre) {
      mascotaEnemigoSeleccionada = mascotaObj;
    }
  });
  spanMascotaEnemigo.innerHTML = mascotaEnemigoSeleccionada.nombre;
  tituloEnemigo.innerHTML = mascotaEnemigoSeleccionada.nombre;
  agregarImg(mascotaEnemigoSeleccionada.foto, "Enemigo");
}

function realizarAtaque(tipoAtaque, btnSeleccionado) {
  if (tipoAtaque == "boton-agua") {
    ataqueJugador = "Agua";
  } else if (tipoAtaque == "boton-fuego") {
    ataqueJugador = "Fuego";
  } else if (tipoAtaque == "boton-tierra") {
    ataqueJugador = "Tierra";
  }
  historialAtaqueJugador.push(ataqueJugador);
  btnSeleccionado.remove();
  enviarAtaques();
  combate();
  if (
    historialAtaqueEnemigo.length >= 5 &&
    historialAtaqueJugador.length >= 5
  ) {
    resolucionBatalla();
  }
}

function enviarAtaques() {
  fetch(`/mascota/${jugadorId}/ataques`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ataques: historialAtaqueJugador }),
  });

  intervalo = setInterval(obtenerAtaques, 50);
  obtenerAtaques();
}

function obtenerAtaques() {
  fetch(`/mascota/${enemigoId}/ataques`).then(function (res) {
    if (res.ok) {
      res.json().then(function ({ ataques }) {
        if (ataques.length === 5) {
          historialAtaqueEnemigo = ataques;
          if (historialAtaqueEnemigo.length == historialAtaqueJugador.length) {
          }
        }
      });
    }
  });
}

function combate() {
  clearInterval(intervalo);
  turnosMaximos--;
  if (
    historialAtaqueEnemigo.length == historialAtaqueJugador.length &&
    historialAtaqueJugador.length === 5 &&
    historialAtaqueEnemigo.length === 5
  ) {
    for (let index = 0; index < historialAtaqueEnemigo.length; index++) {
      ataqueEnemigo = historialAtaqueEnemigo[index];
      ataqueJugador = historialAtaqueJugador[index];
      console.log(`${ataqueEnemigo} ${ataqueJugador} `);
      if (ataqueJugador == ataqueEnemigo) {
        resultadoCombate = "Empate";
      } else {
        switch (ataqueJugador) {
          case "Fuego":
            if (ataqueEnemigo == "Agua") {
              resultadoCombate = "Victoria mascota enemiga";
              vidaJugador--;
            } else {
              resultadoCombate = "Victoria mascota aliada";
              vidaEnemigo--;
            }
            break;
          case "Agua":
            if (ataqueEnemigo == "Tierra") {
              resultadoCombate = "Victoria mascota enemiga";
              vidaJugador--;
            } else {
              resultadoCombate = "Victoria mascota aliada";
              vidaEnemigo--;
            }
            break;
          case "Tierra":
            if (ataqueEnemigo == "Fuego") {
              resultadoCombate = "Victoria mascota enemiga";
              vidaJugador--;
            } else {
              resultadoCombate = "Victoria mascota aliada";
              vidaEnemigo--;
            }
            break;
        }
      }
    }
  }
  recalcularVidas();
}

function recalcularVidas() {
  spanVidaEnemigo.innerHTML = historialAtaqueEnemigo.length;
  spanVidaJugador.innerHTML = historialAtaqueJugador.length;
}

function revisarVidas() {
  if (vidaEnemigo <= 0) {
    estadoEjecuccionJuego = false;
  } else if (vidaJugador <= 0) {
    estadoEjecuccionJuego = false;
  }
  return estadoEjecuccionJuego;
}

function crearMensaje() {
  let parrafo = document.createElement("p");
  parrafo.innerHTML = `tu mascota ataco con ${ataqueJugador}, la mascota del enemigo ataco con ${ataqueEnemigo} resultado del combate es ${resultadoCombate}`;
  sectionMensajes.appendChild(parrafo);
}

function resolucionBatalla() {
  let parrafo = document.createElement("p");
  let victorioso;
  if (vidaEnemigo == vidaJugador) {
    victorioso = "EMPATE";
  } else if (vidaEnemigo > vidaJugador) {
    victorioso = "DERROTA";
  } else {
    victorioso = "VICTORIA";
  }
  parrafo.innerHTML = `La batalla a finalizado el resultado final es ${victorioso}`;
  sectionMensajes.appendChild(parrafo);
  estadoEjecuccionJuego = false;
  botonReiniciar.style.display = "";
  seccionElegirAtaque.style.display = "none";
  var x = document.getElementsByClassName("subtitulo");
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  resultadoBatalla.style.display = "";
  let parrafoVictoria = document.createElement("p");
  parrafoVictoria.innerHTML = `${victorioso}`;
  resultadoBatalla.appendChild(parrafoVictoria);
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function reiniciarJuego() {
  location.reload();
}

function pintarCanvas() {
  mascotaJugadorSeleccionada.x =
    mascotaJugadorSeleccionada.x + mascotaJugadorSeleccionada.velocidadX;
  mascotaJugadorSeleccionada.y =
    mascotaJugadorSeleccionada.y + mascotaJugadorSeleccionada.velocidadY;
  lienzo.clearRect(0, 0, mapa.width, mapa.height);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);
  mascotaJugadorSeleccionada.pintarMascota();
  enviarPosicion(mascotaJugadorSeleccionada.x, mascotaJugadorSeleccionada.y);
  mascotasEnemigas.forEach(function (objMascota) {
    if (objMascota != undefined) {
      objMascota.pintarMascota();
      revisarColision(objMascota);
    }
  });

  /*
  if(mascotaJugadorSeleccionada.velocidadX !== 0 || mascotaJugadorSeleccionada.velocidadY !== 0){
    revisarColision(hipodogeEnemigo);
    revisarColision(ratigueyaEnemigo);
    revisarColision(capipepoEnemigo);
  }

  */
}

function enviarPosicion(x, y) {
  fetch(`http://localhost:8080/mascota/${jugadorId}/posicion`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ x, y }),
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function (enemigos) {
        mascotasEnemigas = enemigos.enemigos.map(function (enemigo) {
          let mascotaEnemigo = null;
          if (enemigo.mascota != undefined) {
            const mascotaNombre = enemigo.mascota.nombre || "";
            if (mascotaNombre === "hipodoge") {
              mascotaEnemigo = new Mascota(
                "hipodoge",
                "assets/mokepons_mokepon_hipodoge_attack.png",
                3,
                "./assets/hipodoge.png",
                enemigo.id
              );
            } else if (mascotaNombre === "capipepo") {
              mascotaEnemigo = new Mascota(
                "capipepo",
                "assets/mokepons_mokepon_capipepo_attack.png",
                3,
                "./assets/capipepo.png",
                enemigo.id
              );
            } else if (mascotaNombre === "ratigueya") {
              mascotaEnemigo = new Mascota(
                "ratigueya",
                "assets/mokepons_mokepon_ratigueya_attack.png",
                3,
                "./assets/ratigueya.png",
                enemigo.id
              );
            }
            mascotaEnemigo.x = enemigo.x || 0;
            mascotaEnemigo.y = enemigo.y || 0;
            return mascotaEnemigo; //mascotaEnemigo.pintarMascota();
          }
        });
      });
    }
  });
}

const arrowRight = $("ArrowRight");
const arrowLeft = $("ArrowLeft");
const arrowUp = $("ArrowUp");
const arrowDown = $("ArrowDown");

function moverPersonaje(direccion) {
  switch (direccion) {
    case "ArrowRight":
      if (mascotaJugadorSeleccionada.x + 20 < mapa.width) {
        mascotaJugadorSeleccionada.velocidadX = 5;
        arrowRight.style.background = "#a70909";
      } else {
        mascotaJugadorSeleccionada.velocidadX = -5;
      }
      break;
    case "ArrowLeft":
      mascotaJugadorSeleccionada.velocidadX = -5;
      arrowLeft.style.background = "#a70909";
      break;
    case "ArrowUp":
      mascotaJugadorSeleccionada.velocidadY =
        mascotaJugadorSeleccionada.velocidadY - 5;
      arrowUp.style.background = "#a70909";
      break;
    case "ArrowDown":
      mascotaJugadorSeleccionada.velocidadY =
        mascotaJugadorSeleccionada.velocidadY + 5;
      arrowDown.style.background = "#a70909";
      break;
  }
}

function detenerPersonaje() {
  mascotaJugadorSeleccionada.velocidadX = 0;
  mascotaJugadorSeleccionada.velocidadY = 0;
}

function iniciarMapa() {
  intervalo = setInterval(pintarCanvas, 50);
  document.addEventListener(
    "keydown",
    (event) => {
      if (mascotaJugadorSeleccionada != null) {
        //event.target.style.background = '#a70909';
        moverPersonaje(event.key);
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    (event) => {
      if (mascotaJugadorSeleccionada != null) {
        detenerPersonaje();
        arrowRight.style.background = "transparent";
        arrowLeft.style.background = "transparent";
        arrowUp.style.background = "transparent";
        arrowDown.style.background = "transparent";
      }
    },
    false
  );
}

function agregarImg(foto, player) {
  const contenedor = document.getElementById(`imgContainer${player}`);
  contenedor.insertAdjacentHTML(
    "beforeend",
    `<img src=${foto} alt=img${player}> ` // Backticks para img variable
  );
}

function revisarColision(enemigo) {
  const arribaEnemigo = enemigo.y;
  const abajoEnemigo = enemigo.y + enemigo.alto;
  const derechaEnemigo = enemigo.x + enemigo.ancho;
  const izquierdaEnemigo = enemigo.x;
  const arribaMascota = mascotaJugadorSeleccionada.y;
  const abajoMascota =
    mascotaJugadorSeleccionada.y + mascotaJugadorSeleccionada.alto;
  const derechaMascota =
    mascotaJugadorSeleccionada.x + mascotaJugadorSeleccionada.ancho;
  const izquierdaMascota = mascotaJugadorSeleccionada.x;
  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return;
  }
  detenerPersonaje();
  clearInterval(intervalo);
  seleccionarMascotaEnemigo(enemigo);
  enemigoId = enemigo.id;
  seleccionarAtaque.style.display = "flex";
  verMapa.style.display = "none";
}
