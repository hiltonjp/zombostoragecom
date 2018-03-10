const express = require('express');
const parser = require('body-parser');
const regex = require('randexp');
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(express.static('front'));

let Zmap = new Map();
let indeceZ = new Map();
let users = new Map();
let zombo = new regex(/zombo(?:\.?com)?/i);


// return the number of zombos stored on zombostoragecom
app.get('/zombo/zombos/stats', (req,res) => {
  console.log("ip: " + req.ip);
  testIP(req);
  var yourZombos = indeceZ.get(req.ip);
  var yourStorage = 0;
  var totalZombos = 0;
  var totalStorage = 0;

  console.log("number of zombo users:" + Zmap.size);
  for (var val of indeceZ.values()) {
    totalZombos += val;
  }

  for (var zombos of Zmap.values()) {
    zombos.forEach(zom => {totalStorage += zom.size});
  }
  console.log("total storage: " + totalStorage);

  getZombo(req).forEach(zom => { yourStorage += zom.size; });
  console.log("your storage: " + yourStorage);

  console.log("yours: " + yourZombos + ", total: " + totalZombos);
  res.send({
    yourZ: yourZombos,
    totalZ: totalZombos,
    yourS: yourStorage,
    totalS: totalStorage
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

app.get('/zombo/newZletter', (req,res) => {
  console.log("TOTAL USERS: " + users.size);
  res.send({
    totalUsers: users.size
  });
});

app.post('/zombo/newZletter', (req,res) => {
  console.log("ADDING USER: " + req.body.username);
  users.set(req.body.username, req.body);
  res.send(req.body);
});

app.put('/zombo/zombos/mine/:id', (req,res) => {
  console.log("\n\nCOPY ITEM");
  let id = parseInt(req.params.id);
  let zombos = getZombo(req);
  let copyIndex = zombos.map(item => { return item.id; }).indexOf(id);
  zombobj = zombos.filter(zom => { return zom.id === id})[0];
  zombobj2 = Object.assign({},zombobj);

  let indeZ = indeceZ.get(req.ip);
  zombobj2.id = indeZ;
  indeceZ.set(req.ip, indeZ+1);
  zombos.splice(copyIndex,0,zombobj2);
  res.send(zombobj2);
});

app.delete('/zombo/zombos/mine/:id', (req,res) => {
  console.log("\n\nDELETE ITEM");
  let id = parseInt(req.params.id);
  let removeIndex = getZombo(req).map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  let indeZ = indeceZ.get(req.ip);
  indeceZ.set(req.ip, indeZ-1);
  getZombo(req).splice(removeIndex, 1);
  res.sendStatus(200);
});


let port = 25565;
app.listen(port, () => { console.log("Server listening on port " + port);});

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
  let myzombo = zombo.gen().split('');
  let zombobj = {};


  let n = 0;
  zombobj.z= myzombo[n++];
  zombobj.o1 = myzombo[n++];
  zombobj.m1 = myzombo[n++];
  zombobj.b = myzombo[n++];
  zombobj.o2 = myzombo[n++];
  if (myzombo.length > 5) {
    if (myzombo[n] === '.') {
      zombobj.dot = myzombo[n++];
    } else {
      zombobj.dot = "";
    }
    zombobj.c = myzombo[n++];
    zombobj.o3 = myzombo[n++];
    zombobj.m2 = myzombo[n++];
  } else {
    zombobj.dot = "";
    zombobj.c = "";
    zombobj.o3 = "";
    zombobj.m2 = "";
  }

  zombobj.size = Math.floor(Math.random()*5000);
  let indeZ = indeceZ.get(req.ip);
  zombobj.id = indeZ;

  zomboList.unshift(zombobj);
  indeceZ.set(req.ip, indeZ+1);
  return zombobj;
}
