const functions = require('firebase-functions');
const app = require('express')();

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore().collection("Usuario");

/**Usuario: get Usuarios 
 * @return <Array> Usuarios - lista com todos os usuarios cadastrados
 */ 

app.get("/Usuario", function(request, response){

    db.get()
    .then(function(docs){
        let Usuarios = [];

        docs.forEach(function(doc){
            Usuarios.push({
                id: doc.id, 
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            });
        })

        response.json(Usuarios);
    })

});

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
app.post("/Usuario", function(request, response){
    const newUsuario = {
        alarmes: request.body.alarmes,
        caixas: request.body.caixas,
        login: request.body.login
    };

    db.add(newUsuario)
    .then(function(){
        response.status(201).json({
            response: true,
            msg: "Usuario cadastrado com Sucesso!"
        });
    })
    .catch(function(err){
        response.status(404).json({
            response: false,
            msg: err
        });
    })
});

/** Usuario/login: verifica se o usuario e senha já são cadastrados
 * @param request.body - json exemplo: {email: "", celular: "", senha: ""}
 * @return <boolean> response
 * @return <String> msg - Informações
 */

app.post("/Usuario/login", function(request, response){
    db.get()
    .then(function(docs){
        let credenciais = {
            email: request.body.email,
            celular: request.body.celular,
            senha: request.body.senha
        };
        let userCorrect = "";
        let userInvalid = true;
        let Usuarios = [];

        docs.forEach(function(doc){
            Usuarios.push({
                id: doc.id, 
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            });
        })

        if(credenciais.email !== null && credenciais.email !== undefined){
            userCorrect = "email";
        }
        
        else if(credenciais.celular !== null && credenciais.celular !== undefined){
            userCorrect = "celular";
        }
    
        else{
            response.status(404).json({
                response: false,
                msg: "Não foi enviado email ou celular " + credenciais.senha
            });
            return;
        }

        Usuarios.forEach( function(Usuario) {
            if(Usuario.login[userCorrect] === credenciais[userCorrect]){
                userInvalid = false;

                if(Usuario.login.senha === credenciais.senha){
                    response.status(200).json({
                        response: true,
                        msg: "Usuario encontrado"
                    });
                    return;
                }
                else{  
                    response.status(404).json({
                        response: false,
                        msg: "Senha Invalida " + credenciais[userCorrect] +" "+ Usuario.login.senha +" "+ credenciais.senha
                    });
                }
            }

        });

        if(userInvalid)
            response.status(404).json({
                response: false,
                msg: "Usuario Invalido"
            });
    })
});


exports.api = functions.https.onRequest(app); 

