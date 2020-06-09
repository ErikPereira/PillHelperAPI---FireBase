const admin = require('firebase-admin');
const db = admin.firestore().collection("Usuario");

module.exports = {

    postLogin: function(request, response){
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
    }
};