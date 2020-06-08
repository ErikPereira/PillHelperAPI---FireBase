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
 * @param <JSON> request.body - exemplo:
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

app.post("/Usuario/login", function(request, response){
    let credenciais = {
        email: request.body.email,
        celular: request.body.celular,
        senha: request.body.senha
    };
    let userCorrect = "";
    let userInvalid = true;
    // let Usuario = [];

    if(credenciais.email !== null && credenciais.email !== undefined){
        userCorrect = "email";
    }
    
    else if(credenciais.celular !== null && credenciais.celular !== undefined){
        userCorrect = "celular";
    }

    else{
        response.json({
            response: false,
            msg: "Não foi enviado email ou celular"
        });
        return;
    }

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

    
    
    /*
    Usuarios.forEach( function(Usuario) {
            if(Usuario.login[userCorrect] === credenciais[userCorrect]){
                userInvalid = false;

                if(Usuario.login.senha === credenciais.senha){
                    response.status(200).jsonpjson({
                        response: true,
                        msg: "Usuario encontrado"
                    });
                }
                else   
                    response.status(404).json({
                        response: false,
                        msg: "Senha Invalida"
                    });
            }

        });

        if(userInvalid)
            response.status(404).json({
                response: false,
                msg: "Usuario Invalido"
            });*/
});


exports.api = functions.https.onRequest(app); 

