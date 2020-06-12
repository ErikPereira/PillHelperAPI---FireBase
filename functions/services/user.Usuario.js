const admin = require('firebase-admin');
const db = admin.firestore().collection("Usuario");

module.exports = {

    getUsuarios: function(request, response){
        const id = request.body.id;
        let encontrou = false;
        db.get()
        .then(function(docs){
            let Usuarios = [];

            docs.forEach(function(doc){
                if(id === doc.id){
                    encontrou = true;
                    Usuarios.push({
                        id: doc.id, 
                        alarmes: doc.data().alarmes,
                        caixas: doc.data().caixas,
                        login: doc.data().login
                    });
                }
            })
            if(encontrou){
                response.status(200).json({
                    response: true,
                    msg: Usuarios[0]
                });
            }
            else{
                response.status(404).json({
                    response: false,
                    msg: "Usuario não encontrado!"
                });
            }
        })
    },
    postUsuario: function(request, response){
        const newUsuario = {
            alarmes: request.body.alarmes,
            caixas: request.body.caixas,
            login: request.body.login
        };
        db.get()
        .then(function(docs){

            let Usuarios = [];

            docs.forEach(function(doc){
                encontrou = true;
                Usuarios.push({
                    id: doc.id, 
                    alarmes: doc.data().alarmes,
                    caixas: doc.data().caixas,
                    login: doc.data().login
                });
            })

            Usuarios.forEach(function(usuario){
                if(usuario.login.email === newUsuario.login.email){
                    response.status(404).json({
                        response: false,
                        msg: "Email já cadastrado"
                    });
                    return;
                }
                if(usuario.login.celular === newUsuario.login.celular){
                    response.status(404).json({
                        response: false,
                        msg: "Celular já cadastrado"
                    });
                    return;
                }
            });

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
        })
    },

    todosUsuarios: function(request, response){
        db.get()
        .then(function(docs){
            let Usuarios = [];

            docs.forEach(function(doc){
               
                encontrou = true;
                Usuarios.push({
                    id: doc.id, 
                    alarmes: doc.data().alarmes,
                    caixas: doc.data().caixas,
                    login: doc.data().login
                });
                
            })
      
            response.status(200).json(Usuarios); 
        })
    }
};