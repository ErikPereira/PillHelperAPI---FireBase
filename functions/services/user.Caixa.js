const admin = require('firebase-admin');

module.exports = {

    novaCaixa: function(request, response){
        const novaCaixa = {
            nomeCaixa: request.body.nomeCaixa,
            id: request.body.idCaixa
        };
        const id = request.body.idUsuario;
        const dbCaixa = admin.firestore().collection("Usuario").doc(id);
        let data = {};

        dbCaixa.get()
        .then(function(doc){
            data = {
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            }

            data.caixas.push(novaCaixa);
            dbCaixa.update(data)
            .then(function(){
                response.status(200).json({
                    response: true,
                    msg: "Caixa Adicionada com sucesso!",
                });
            })
            .catch(function(err){
                response.status(304).json({
                    response: false,
                    msg: "Caixa não adicionado!" + err,
                });
            })  
        })
    },

    atualizaCaixa: function(request, response){
        const velhaCaixa = {
            nomeCaixa: request.body.velhaCaixa.nomeCaixa,
            id: request.body.velhaCaixa.id,
        }
        const novaCaixa = {
            nomeCaixa: request.body.novaCaixa.nomeCaixa,
            id: request.body.novaCaixa.id, 
        };
        const id = request.body.idUsuario;
        const dbCaixa = admin.firestore().collection("Usuario").doc(id);
        let data = {};
        
        dbCaixa.get()
        .then(function(doc){
            let modificou = false;
            data = {
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            }
            data.caixas.forEach((caixa) => {
                if(caixa.id === velhaCaixa.id){
                    caixa.id = novaCaixa.id;
                    caixa.nomeCaixa = novaCaixa.nomeCaixa;
                    modificou = true
                }
            });
            if(!modificou){
                response.status(404).json({
                    response: false,
                    msg: "Caixa não encontrada!",
                });
                return;
            }
            dbCaixa.update(data)
            .then(function(){
                response.status(200).json({
                    response: true,
                    msg: "Caixa modificada com sucesso!",
                });
            })
            .catch(function(err){
                response.status(304).json({
                    response: false,
                    msg: "Caixa não modificada!" + err,
                });
            })  
        })
    }
};