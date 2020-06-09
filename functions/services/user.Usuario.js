const admin = require('firebase-admin');
const db = admin.firestore().collection("Usuario");

module.exports = {

    getUsuarios: function(request, response){

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
    },
    postUsuario: function(request, response){
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
    }
};