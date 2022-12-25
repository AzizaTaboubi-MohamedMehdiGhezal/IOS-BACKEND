import { token } from 'morgan';
import Product from '../Models/productModel.js'
import jwt from 'jsonwebtoken'
import UserModel from '../Models/UserModel.js';

//add
export async function addNewProduct(req, res) {
  try {
    const {
     // userID,
      nom,
      image,
      prix,
      etat,
      marque,
      boutique,
      annee,
      description,
      type,
      city,
      promo
    } = req.body
    console.log("body= ");
    console.log(req.body);
    if (!(nom && prix && etat && marque && type && city)) {
      res.status(400).json({ message: 'All Fields are required' })
    }
    //3amaltha b token ken theb trajaaha rajaa hawka en commentaire
    token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const userID = token.user._id
    const user = await UserModel.findById(userID)
    const product = await Product.create({
      //userID,
      nom,
      image: "localhost:9092/img/"+nom+".png",
      prix,
      etat,
      promo,
      marque,
      boutique,
      annee,
      description,
      type,
      city,
      owner : userID
    })
    res.send(product)
    user.products.push(product._id)
    user.save()
    //res.status(200).json({product : product})
  } catch (err) {
    console.log(err)
  }
}


//Update Product
export async function UpdateProduct(req, res) {
  const {nom,image,prix,etat,marque,boutique,annee,description,type,city } = req.body
  console.log(description)
  console.log("id = ",req.body._id)
 try {
    
    let product = await Product.findOneAndUpdate(
      { _id: req.body._id},
      {
        $set: {
          nom: nom,
          image: image,
          prix: prix,
          etat: etat,
          marque: marque,
          boutique: boutique,
          annee: annee,
          description: description,
          type: type,
          city: city
        }
      }
    )
     console.log(product);
    await res.status(200).send("Product updated")
  } catch (e) {
    return res.status(400).json({ "error": e })
  }
}

//Afficher tous les produits
export async function getAll  (req, res) {
    res.send({ Products: await Product.find() })
  }
  
//Recuperer produit par id
export async function getByUserID  (req, res)  {
  let userID = req.params.userID
  if(userID)
    res.send({
       Products: await Product.find({userID: userID}).exec()
       })
      else
      res.send("erreur")
  }

  //Recuperer produits par type
export async function recupererParType  (req, res)  {
  var produits =await Product.find().populate('type')
  try{
    res.send(produits)
  } catch(err) {
    console.log(err);
  }

}


 //Recuperer produits par nom
 export async function recupererParNom  (req, res)  {
  var produits =await Product.find().populate('nom')
  try{
    res.send(produits)
  } catch(err) {
    console.log(err);
  }

}



//Afficher produits par user

export async function getAllProducts (req, res) {
  var token = req.body.token
  let Token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  var Products =await Product.find()
  
  if (Token) {
    try {
        let Token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let userId = Token.user._id
        var userP
        if (true){
          userP = Products.filter( Product => {
            let isValid = true
              console.log(Product);
              isValid = isValid && Product.owner == userId
            return isValid
          })     
          res.status(200).send(userCars)
        } else {
          console.log("erreur");
        }        
    } catch (e) {
      return res.status(400).json({"error1" : e})
    }
  } else {
    return res.status(400).json({"error2" : "erreur2"})
  }}

//RECHERCHE SORT AND MORE

export async function rechercherProduit (req, res) {
  try {
      const search = req.query.search || ""; 
      let sort = req.query.sort || "nom";
      let type = req.query.type || "All";
      type = "All"
      ?(type=[req.body.type])
      :(type =req.query.typee.split(","));
      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

     // let sortBy = {};
      if (sort[1]){
        sortBy[sort[0]] = sort[1];
      }else {
        sortBy[sort[0]]="asc";
      }
      const produits = await Product.find({ nom: { $regex: search, $options: "i" } })
			.where("type")
			.in([...type])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Product.countDocuments({
			type: { $in: [...type] },
			nom: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			type,
			produits,
		};

		res.status(200).json(response);

    
  } catch (error) {
    console.log(error);
    
  }
}


//Delete a product
export  async function deletee (req, res) {
  console.log(req.body)
    let product = await Product.findById(req.body._id)
    if (product) {
      await product.remove()
      return res.send({ message: "Product" + product._id + " has been deleted" })
    } else {
      return res.status(404).send({ message: "Product does not exist" })
    }
  }


  //Delete all products
  export async function deleteAll (req, res) {
    await Product.remove({})
    res.send({ message: "All products have been deleted" })
  }