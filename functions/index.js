const admin = require('firebase-admin');
admin.initializeApp();
const functions = require('firebase-functions');
const app = require('express')();
const userUsuarios = require('./services/user.Usuario');
const userLogin = require('./services/user.login')
const db = admin.firestore().collection("Usuario");

/**Usuario: get Usuarios 
 * @return <Array> Usuarios - lista com todos os usuarios cadastrados
 */ 

app.get("/Usuario", userUsuarios.getUsuarios);

/**Usuario: criar novo Usuario
 * @param request.body - json exemplo:
 *  {
        "alarmes": {
            "hora": "03:55",
            "nomeRemedio": "Vida"
        },
        "caixas": {
            "id": 7
        },
        "login": {
            "celular": 11997800198,
            "senha": "3145",
            "email": "email_muito_elevado_aleatorio@hotmail.com"
        }
    }
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

//app.put("Usuario/alarme", function())
exports.api = functions.https.onRequest(app); 

