const express = require("express");
const Mascota = require("./model/mascota");
const Jugador = require("./model/jugador");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
const jugadores = [];

app.use(express.static("public"));

app.get("/unirse", (req, res) => {
  const id = `${Math.random()}`;
  const jugador = new Jugador(id);
  jugadores.push(jugador);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(id);
});

app.post("/mascota/:jugadorId", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const nombre = req.body.mascota.nombre || "";
  const mascota = new Mascota(nombre);
  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarMascota(mascota);
  }
  res.end();
});

app.post("/mascota/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;
  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualizarPosicion(x, y);
  }

  const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id);

  res.send({ enemigos });
});

app.post("/mascota/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const ataques = req.body.ataques || "";

  const jugadorIndex = jugadores.findIndex(
    (jugador) => jugadorId === jugador.id
  );
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarAtaques(ataques);
  }
  console.log(jugadores[jugadorIndex].ataques);
  res.end();
});

app.get("/mascota/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId);
  console.log(jugador.ataques);
  res.send({
    ataques: jugador.ataques || [],
  });
});

app.listen(port, () => {
  console.log("Servidor Iniciado");
});
