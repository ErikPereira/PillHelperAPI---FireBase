const admin = require('firebase-admin');
admin.initializeApp();
const functions = require('firebase-functions');
const app = require('express')();

const userUsuarios = require('./services/user.Usuario');
const userLogin = require('./services/user.Login');
const userCaixa = require('./services/user.Caixa');
const userAlarme = require('./services/user.Alarme');
//const db = admin.firestore().collection("Usuario");

/**Usuario: get Usuarios 
 * @return <Array> Usuarios - lista com todos os usuarios cadastrados
 */ 

app.post("/Usuario/cadastrado", userUsuarios.getUsuarios);

/**Usuario/todos
 * @return <Array> Usuarios - lista com todos os usuarios cadastrados
 */ 

app.get("/Usuario/todos", userUsuarios.todosUsuarios);

/**Usuario: criar novo Usuario
 * @param request.body - json exemplo:
 * {
 *     "alarmes": 
 *      [
 *          {
 *              "hora": "03:55",
 *              "nomeRemedio": "Vida"
 *          }
 *      ],
 *      "caixas": 
 *      [
 *          {
 *              "id": 7
 *          }
 *      ],
 *      "login": {
 *          "celular": 11985611024,
 *          "senha": "3145",
 *          "email": "email_muito_elevado_aleatorio@hotmail.com"
 *      }
 *  }
 * @return <boolean> response
 * @return <String> msg - Informações
 */
app.post("/Usuario", userUsuarios.postUsuario);

/** Usuario/login: verifica se o usuario e senha já são cadastrados
 * @param request.body - json exemplo: {email: "", celular: "", senha: ""}
 * @return <boolean> response
 * @return <String> msg - Informações
 */

app.post("/Usuario/login", userLogin.postLogin);

app.post("/Usuario/alarme", userAlarme.novoAlarme);

app.post("/Usuario/alarme/atualizar", userAlarme.atualizaAlarme);

app.post("/Usuario/alarme/excluir", userAlarme.excluirAlarme);

app.post("/Usuario/caixa", userCaixa.novaCaixa);

app.post("/Usuario/caixa/atualizar", userCaixa.atualizaCaixa);

app.get("/Caixa/todos", userCaixa.todasCaixas);

exports.api = functions.https.onRequest(app); 

