const admin = require('firebase-admin');

module.exports = {

    novoAlarme: function(request, response){
        const novoAlarme = {
            nomeRemedio: request.body.nomeRemedio,
            hora: request.body.hora,
        };
        const id = request.body.id;
        const dbAlarme = admin.firestore().collection("Usuario").doc(id);
        let data = {};

        dbAlarme.get()
        .then(function(doc){
            data = {
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            }

            data.alarmes.push(novoAlarme);
            dbAlarme.update(data)
            .then(function(){
                response.status(200).json({
                    response: true,
                    msg: "Alarme Adicionado com sucesso!",
                });
            })
            .catch(function(err){
                response.status(304).json({
                    response: false,
                    msg: "Alarme não adicionado!" + err,
                });
            })  
        })
    },

    atualizaAlarme: function(request, response){
        const velhoAlarme = {
            nomeRemedio: request.body.velhoAlarme.nomeRemedio,
            hora: request.body.velhoAlarme.hora, 
        }
        const novoAlarme = {
            nomeRemedio: request.body.novoAlarme.nomeRemedio,
            hora: request.body.novoAlarme.hora, 
        };
        const id = request.body.id;
        const dbAlarme = admin.firestore().collection("Usuario").doc(id);
        let data = {};
        
        dbAlarme.get()
        .then(function(doc){
            let modificou = false;
            data = {
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            }
            data.alarmes.forEach((alarme) => {
                if(alarme.nomeRemedio === velhoAlarme.nomeRemedio && alarme.hora === velhoAlarme.hora){
                    alarme.nomeRemedio = novoAlarme.nomeRemedio;
                    alarme.hora = novoAlarme.hora;
                    modificou = true
                }
            });
            if(!modificou){
                response.status(404).json({
                    response: false,
                    msg: "Alarme não encontrado!",
                });
                return;
            }
            dbAlarme.update(data)
            .then(function(){
                response.status(200).json({
                    response: true,
                    msg: "Alarme modificado com sucesso!",
                });
            })
            .catch(function(err){
                response.status(304).json({
                    response: false,
                    msg: "Alarme não modificado!" + err,
                });
            })  
        })
    }
};