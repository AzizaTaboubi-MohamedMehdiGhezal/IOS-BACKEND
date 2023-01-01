import express from 'express';
import mongoose from 'mongoose'; //Importer Mongoose
import user from './Routes/user.js';
import produit from './Routes/produit.js';
import passport from "passport";
import pkg from 'body-parser';
const { json } = pkg;


const app = express();
app.use('/images' ,express.static('uploads'))
const port = process.env.PORT || 9092;
const databasename = 'MiniProjet';





app.use(passport.initialize());

app.use(json());

/*app.listen(port, async () => {
  await connect();
  console.log(`Server listening on ${port}`);
});*/

//cela affichera les requetes MongoDb ds le terminal
mongoose.set('debug', true);
//utilisation des promesses ES6 pour mongoose, donc aucune callback n'est nécessaire
mongoose.Promise = global.Promise;


//se connecter a mongodb

mongoose
   .connect(`mongodb://localhost:27017/${databasename}`)
   .then(() => {
    //une fois connectee, afficher un msg de reussite sur la console
    console.log(`Connected to ${databasename}`);
   })
   .catch(err => {
    //si qlq chose ne va pas, afficher l'err sur la console
    console.log(err);
   });


   app.use(express.json());
   app.use('/user', user);
   app.use('/produit', produit);
   
   app.listen(port, ()=> {
    console.log(`server running at http://localhost:${port}`);
   });
