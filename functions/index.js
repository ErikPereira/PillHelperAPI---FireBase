const admin = require('firebase-admin');
admin.initializeApp();
const functions = require('firebase-functions');
const app = require('express')();
const baseController = require('./controller/base-controller');
const userUsuarios = require('./services/user.Usuario');
const userLogin = require('./services/user.Login');
const userCaixa = require('./services/user.Caixa');
const userAlarme = require('./services/user.Alarme');

const routes = baseController.routes();

app.post("/Usuario/cadastrado", userUsuarios.getUsuarios);

app.get("/Usuario/todos", userUsuarios.todosUsuarios);

app.post("/Usuario", userUsuarios.postUsuario);

app.post("/Usuario/login", userLogin.postLogin);

app.post("/Usuario/alarme", userAlarme.novoAlarme);

app.post("/Usuario/alarme/atualizar", userAlarme.atualizaAlarme);

app.post("/Usuario/alarme/excluir", userAlarme.excluirAlarme);

app.post("/Usuario/caixa", userCaixa.novaCaixa);

app.post("/Usuario/caixa/atualizar", userCaixa.atualizaCaixa);

app.get(routes.teste, baseController.teste());

app.get("/Caixa/todos", userCaixa.todasCaixas);

app.post("/Caixa/getAlarmes", userCaixa.getAlarmes);

app.post("/Caixa/excluiCaixa", userCaixa.excluirCaixa);

exports.api = functions.https.onRequest(app); 

