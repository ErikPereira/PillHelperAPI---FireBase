const admin = require('firebase-admin');

module.exports = {

    novoAlarme: function(request, response){
        const novoAlarme = request.body.novoAlarme;
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
        const velhoAlarme =  request.body.velhoAlarme;
        const novoAlarme = request.body.novoAlarme;
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
                if(alarme.nome_remedio === velhoAlarme.nome_remedio && alarme.hora === velhoAlarme.hora && alarme.minuto === velhoAlarme.minuto){
                   for(var descricao in alarme){
                       alarme[descricao] = novoAlarme[descricao];
                   }
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