const admin = require('firebase-admin');


async function deletCaixa(request, response){
    const idCaixa =  request.body.idCaixa;
        const idUsuario = request.body.id;
        const dbUsuario = admin.firestore().collection("Usuario").doc(idUsuario);
        const dbCaixa = admin.firestore().collection("Caixa").doc(idCaixa);
        let caixaCadastrada = {};
        let usuarioCadastrado = {};

        await dbCaixa.get()
            .then(function(doc){
                caixaCadastrada = {
                    idUsuario: doc.data().idUsuario,
                    nomeCaixa: doc.data().nomeCaixa,
                }; 
            })
            .catch(function(err){
                response.status(404).json({
                    response: false,
                    msg: "caixa "+ idCaixa +" Não encontrada"
                });
                return response;
            })

        await dbUsuario.get()
        .then(function(doc){
            usuarioCadastrado = {
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            }
        })
        .catch(function(err){
            response.status(404).json({
                response: false,
                msg: "Usuario "+ idUsuario +" Não encontrada: "
            });
            return response;
        })
        
        
        let novasCaixas = [];
        let encontrouCaixa = false;

        for(const i in usuarioCadastrado.caixas){
            const caixa = usuarioCadastrado.caixas[i];
            if(caixa.idCaixa !== idCaixa){
                novasCaixas.push(caixa)
            }
            else encontrouCaixa = true;
        }

        if(!encontrouCaixa){
            response.status(404).json({
                response: false,
                msg: "Caixa " + idCaixa + " não esta cadastrado no usuario de ID " + idUsuario,
            });
            return response;
        }
        usuarioCadastrado ={
            alarmes: usuarioCadastrado.alarmes,
            caixas: novasCaixas,
            login: usuarioCadastrado.login,
        };

        caixaCadastrada.idUsuario = "";

        await dbCaixa.update(caixaCadastrada)
        .catch(function(err){
            response.status(404).json({
                response: false,
                msg: "erro ao salvar informacoes da Caixa!" + err,
            });
            return response;
        }) 

        await dbUsuario.update(usuarioCadastrado)
        .catch(function(err){
            response.status(404).json({
                response: false,
                msg: "erro ao salvar informacoes do Usuario!" + err,
            });
            return response;
        })
        response.status(200).json({
            response: true,
            msg: "Caixa removida com sucesso!",
        });

        return response;
}

module.exports = {
    todasCaixas: function(request, response){
        const dbCaixa = admin.firestore().collection("Caixa");

        dbCaixa.get()
        .then(function(docs){
            let Caixas = [];

            docs.forEach(function(doc){
                encontrou = true;
                Caixas.push({
                    idUsuario: doc.data().idUsuario,
                    nomeCaixa: doc.data().nome,
                    id: doc.id
                });
            })
            response.status(200).json(Caixas); 
        })
    },

    novaCaixa: async function(request, response){
        const idCaixa =  request.body.idCaixa;
        const idUsuario = request.body.id;
        const dbUsuario = admin.firestore().collection("Usuario").doc(idUsuario);
        const dbCaixa = admin.firestore().collection("Caixa").doc(idCaixa);
        const mudarUsuario = request.body.mudarUsuario;
        let caixaCadastrada = {};

        await dbCaixa.get()
            .then(function(doc){
                caixaCadastrada = {
                    idUsuario: doc.data().idUsuario,
                    nomeCaixa: doc.data().nomeCaixa,
                }; 
            })
            .catch(function(err){
                response.status(404).json({
                    response: false,
                    msg: "caixa "+ idCaixa +" Não encontrada"
                });
            })
            
        if(caixaCadastrada.idUsuario !== "" && mudarUsuario === "false"){
            response.status(404).json({
                response: false,
                msg: "caixa "+ idCaixa + " já foi cadastrada"
            });
            return;
        }

        if(caixaCadastrada.idUsuario !== "" && mudarUsuario === "true" && caixaCadastrada.idUsuario !== idUsuario){
            const corpo = {
                body:{
                    id: caixaCadastrada.idUsuario,
                    idCaixa
                }    
            };
            await deletCaixa(corpo, response);
        }

        let usuarioCadastrado = {};
        
        await dbUsuario.get()
        .then(function(doc){
            usuarioCadastrado = {
                alarmes: doc.data().alarmes,
                caixas: doc.data().caixas,
                login: doc.data().login
            }
        })
        .catch(function(err){
            response.status(404).json({
                response: false,
                msg: "Usuario "+ idUsuario +" Não encontrada: "
            });
        })
        
        
        let jaExiste = false;
        const novasCaixas = [];

        for(const i in usuarioCadastrado.caixas){
            const caixa = usuarioCadastrado.caixas[i];
            if(caixa.idCaixa === idCaixa){
                jaExiste = true;
                caixa.nomeCaixa =  request.body.nomeCaixa;
            }
            novasCaixas.push(caixa);
        }
        if(!jaExiste){
            novasCaixas.push({
                idCaixa,
                nomeCaixa: request.body.nomeCaixa
            });  
        }

        usuarioCadastrado ={
            alarmes: usuarioCadastrado.alarmes,
            caixas: novasCaixas,
            login: usuarioCadastrado.login,
        };

        caixaCadastrada = {
            idUsuario: idUsuario,
            nomeCaixa: request.body.nomeCaixa
        }

        await dbCaixa.update(caixaCadastrada)
        .catch(function(err){
            response.status(404).json({
                response: false,
                msg: "erro ao salvar informacoes da Caixa!" + err,
            });
        }) 

        await dbUsuario.update(usuarioCadastrado)
        .catch(function(err){
            response.status(404).json({
                response: false,
                msg: "erro ao salvar informacoes do Usuario!" + err,
            });
        })
        response.status(200).json({
            response: true,
            msg: "Caixa adicionada com sucesso!",
        });
    },

    atualizaCaixa: async function(request, response){
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
                if(caixa.idCaixa=== velhaCaixa.id){
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
                response.status(404).json({
                    response: false,
                    msg: "Caixa não modificada!" + err,
                });
            })  
        })
    },

    getAlarmes: async function(request, response){
        const idCaixa =  request.body.idCaixa;
        const dbUsuario = admin.firestore().collection("Usuario");
        const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
        let Alarmes = [];
        let retorno = {
            alarmes: [],
        };

        await dbUsuario.get()
        .then(function(docs){
            let usuario = {};
            docs.forEach(function(doc){
                usuario = {
                    id: doc.id, 
                    alarmes: doc.data().alarmes,
                    caixas: doc.data().caixas,
                    login: doc.data().login
                };

                for(const i in usuario.caixas){
                    const caixa = usuario.caixas[i];
                    if(caixa.idCaixa === idCaixa){
                        Alarmes = Object.assign({}, usuario.alarmes);   
                       break;
                    }
                }
            })
        }) 
        for(const i in Alarmes){
            const alarme = Alarmes[i];
            if(alarme.alarm_type === "1"){ // fixo
                for(var j = 0; j < 7; j++){
                    if(alarme[diasSemana[j]] === "1"){
                        const hora = parseInt(alarme.hora)  < 10 ? `0${alarme.hora}`   : alarme.hora;
                        const min = parseInt(alarme.minuto) < 10 ? `0${alarme.minuto}` : alarme.minuto;
                        const posCaixa = parseInt(alarme.posCaixa) < 10 ? `0${alarme.posCaixa}` : alarme.posCaixa;
                        retorno.alarmes.push(`WH${j} ${hora}:${min} L${posCaixa} S${alarme.sonoro}`);
                    }
                }
            }
            else{ // intervalado
                const vezes_dia = alarme.vezes_dia;
                let hora, min;

                for(var j = 0; j < vezes_dia; j++){
                    hora = ( parseInt(alarme.hora) + (j *parseInt(alarme.periodo_hora)) ) % 24; 
                    min = parseInt(alarme.minuto) + (j * parseInt(alarme.periodo_min));
                    if(min >= 60){
                        hora = (hora + 1) % 24;
                        min %= 60;
                    }
                    hora = hora < 10 ? `0${hora}` : hora;
                    min = min < 10 ? `0${min}` : min;
                    const posCaixa = parseInt(alarme.posCaixa) < 10 ? `0${alarme.posCaixa}` : alarme.posCaixa;
                    retorno.alarmes.push(`DH${hora}:${min} L${posCaixa} S${alarme.sonoro}`);
                }
            }
        }

        response.status(200).json({
            response: true,
            msg: retorno
        });  

    },

    excluirCaixa: async function(request, response){
        response = await deletCaixa(request, response);
    }
};