//Validation
const Joi = require('@hapi/joi');

//Register validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
};

const productValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        category: Joi.string().min(2).required(),
        price: Joi.string().min(1).required()
    })
    return schema.validate(data);
};

const productUpdateValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(2),
        category: Joi.string().min(2),
        price: Joi.string().min(1)
    })
    return schema.validate(data);
};

const orderValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(2),
        products: Joi.array().items(Joi.string()).min(1).required(),
        status: Joi.string().min(1).valid('Pending', 'Processing','Delivered','Cancelled')
    })
    return schema.validate(data);
};

const orderUpdateValidation = data => {
    const schema = Joi.object({
        status: Joi.string().min(1).valid('Pending', 'Processing','Delivered','Cancelled').required()
    })
    return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
module.exports.productUpdateValidation = productUpdateValidation;
module.exports.orderValidation = orderValidation;
module.exports.orderUpdateValidation = orderUpdateValidation;
