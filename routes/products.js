const router = require('express').Router();
const verify = require('./verifyToken');
var jwtDecode = require('jwt-decode');
const vatService = require('./vatService');
const Product = require('../model/Product');
const ObjectId = require('mongodb').ObjectID;
const {productValidation,productUpdateValidation} = require('../validation');


router.post('/product',verify, async (req,res) => {
    //validate data
   const {error} = productValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)

   //Create new Product and save to db
   const product = new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price 
   });

   try{
       const savedProduct = await product.save();
       res.status(201).send({product: savedProduct.id});
   }catch(err){
       res.status(500).send(err);
   }
});

router.put('/product/:id',verify, async (req,res) => {
    //validate product
    if(!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid ID!");
    const product = await Product.findOne({_id:ObjectId(req.params.id)});
    if(!product) return res.status(404).send("Cannot find product!");
    
    //validate data
   const {error} = productUpdateValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)

   var query = {'_id': ObjectId(req.params.id)};
   Product.findOneAndUpdate(query,req.body,{useFindAndModify: false},function(err, doc) {
        if (err) return res.status(500).send({error: err});
        return res.status(200).send('Succesfully saved.');
   });
   
});

router.delete('/product/:id',verify, async (req,res) => {
    //validate product
    if(!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid ID!");
    const product = await Product.findOne({_id:ObjectId(req.params.id)});
    if(!product) return res.status(404).send("Cannot find product!");

   var query = {'_id': ObjectId(req.params.id)};
   Product.findOneAndDelete(query,{useFindAndModify: false},function(err, doc) {
        if (err) return res.status(500).send({error: err});
        return res.status(204).send('Succesfully deleted.');
   });
   
});


router.get('/allProducts', async (req,res) => {
    Product.find({}, function(err, products) {
        var productMap = {};
    
        products.forEach(function(product) {
            productMap[product._id] = product;
        });
        
        if(productMap.size >= 1){
            res.status(200).send(productMap);  
        }else{
            res.status(204).send(productMap);  
        }
        
      });
});

router.get('/product/:id/price', verify, async (req,res) => {
   var query = {'_id': ObjectId(req.params.id)};
   const token = req.header('auth-token');
   var decodedToken = jwtDecode(token);
   const countryCode = decodedToken.countryCode;
   Product.findOne(query,async function(err, doc) {
        if (err) return res.status(500).send({error: err});
        const vatPrice = await vatService.getPriceWithVat(doc.price,countryCode);
        console.log(vatPrice);
        res.status(200).send(JSON.stringify({price: price,priceWithVat:vatPrice}));  
    });
      
});

module.exports = router;