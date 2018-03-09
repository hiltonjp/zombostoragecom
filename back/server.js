const express = require('express');
const parser = require('body-parser');
const regex = require('randexp');
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(express.static('../front'));

let Zmap = new Map();
let indeceZ = new Map();
let zombo = new regex(/zombo(?:\.?com)?/i);

// return the number of zombos stored on zombostoragecom
app.get('/zombo/zombos/total', (req,res) => {
  console.log("ip: " + req.ip);
  testIP(req);
  var yourZombos = indeceZ.get(req.ip);
  var totalZombos = 0;
  console.log("number of zombo users:" + Zmap.size);
  for (var val of indeceZ.values()) {
    totalZombos += val;
  }
  console.log("yours: " + yourZombos + ", total: " + totalZombos);
  res.send({
    yours: yourZombos,
    total: totalZombos
  });
});

app.get('/zombo/zombos/mine', (req,res) => {
  testIP(req);
  res.send(getZombo(req));
});


app.post('/zombo/zombos/mine', (req,res) => {
  testIP(req);
  let myZombo = postZombo(req);
  res.send(myZombo);
});

let port = 25565;

app.listen(port, '127.0.0.1', () => { console.log("Server listening on port " + port);});

//----- UTILITY METHODS --------------------------------------------------------------------------//
function testIP(req) {
  if (!Zmap.has(req.ip)) {
    let zombo = [];
    Zmap.set(req.ip, zombo);
    indeceZ.set(req.ip, 0);
  }
}

function getZombo(req) {
  return Zmap.get(req.ip);
}

function postZombo(req) {
  zomboList = Zmap.get(req.ip);
  let myzombo = zombo.gen();
  zomboList.push(myzombo);
  let indeZ = indeceZ.get(req.ip);
  indeceZ.set(req.ip, indeZ + 1);
  return myzombo;
}
