const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const geoIP = require('geoip-lite');
const publicIp = require('public-ip');
const {registerValidation,loginValidation} = require('../validation');

router.post('/registration', async (req,res) => {
    //validate data
   const {error} = registerValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)

    //check if user is already in db
    const emailExists = await User.findOne({email:req.body.email});
    if(emailExists) return res.status(400).send("Email already in use!");

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

   //Create new User and save to db
   const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword 
   });

   try{
       const savedUser = await user.save();
       res.status(201).send({user: savedUser.id});
   }catch(err){
       res.status(500).send(err);
   }
});

router.post('/login', async (req,res) =>{
    //Validate data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)
   
    //Check if user exists in db
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Email or password is wrong!");
    
    //Validate password
    const validPass = await bcrypt.compare(req.body.password,user.password)
    if(!validPass) return res.status(400).send('Email or password is wrong!');

    //Create and assign token
    const ip = await publicIp.v4()
    const geo = geoIP.lookup(ip);
    const token = jwt.sign({_id:user._id, countryCode: geo.country},process.env.TOKEN_SECRET,{ expiresIn: '1h' });
    res.header('auth-token',token).status(201).send(token);
});


module.exports = router;