const router = require('express').Router();
const Order = require('../model/Order');
const verify = require('./verifyToken');
const ObjectId = require('mongodb').ObjectID;
const {orderValidation,orderUpdateValidation} = require('../validation');

router.post('/order',verify, async (req,res) => {
    //validate data
   const {error} = orderValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)

   //Create new Product and save to db
   const order = new Order({
    products: req.body.products,
   });

   try{
       const savedOrder = await order.save();
       res.status(201).send({order: order.id});
   }catch(err){
       res.status(500).send(err);
   }
});

router.put('/order/:id/status',verify, async (req,res) => {
    //validate product
    if(!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid ID!");
    const order = await Order.findOne({_id:ObjectId(req.params.id)});
    if(!order) return res.status(404).send("Cannot find order!");
    
    //validate data
   const {error} = orderUpdateValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)

   var query = {'_id': ObjectId(req.params.id)};
   Order.findOneAndUpdate(query,{status:req.body.status},{useFindAndModify: false},function(err, doc) {
        if (err) return res.status(500).send({error: err});
        return res.status(200).send('Succesfully saved.');
   });
   
});

router.get('/allOrders', verify, (req,res) => {
    Order.find({}, function(err, orders) {
        var orderMap = {};
    
        orders.forEach(function(order) {
            orderMap[order._id] = order;
        });
    
        if(orderMap.size >= 1){
            res.status(200).send(orderMap);  
        }else{
            res.status(204).send(orderMap);  
        }
          
      });
});


module.exports = router;