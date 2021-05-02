const admin = require('firebase-admin');
const db = admin.firestore().collection("Usuario");

async function selectAllUsers(){
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

module.exports = {
    selectAllUsers,
  };
  