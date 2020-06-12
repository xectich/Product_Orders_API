# NodeJS JWT Products/Orders Demo API

### Overview
This API is done as aprt of a Tech test for SB-tech. It uses MongoDB with public access to the database to allow users to add, edit, delete and search for a product. They can get the price including VAT. (uses https://euvatrates.com/rates.json)
Also they can add an order (that contains products) and change the status.
The app uses a validation for the request paramaters and JWT for authroisation (tokens expire in 1 hour). It also encrypts the password using a hash and a salt.

When the user logs in it uses the public-ip and geoip-lite libraries to detirmine the countryCode and add it to the JWT. That (JWT) later gets decoded to fetch it.

For simplicity I have not added testing at this point, could be added later.



## Running Locally

Setup
```
npm install
```
Run
```
npm start
```

Execute Calls
```
Use Postman to execute codes.
https://www.postman.com/
```

### Calling API

User Registration (POST)
```
localhost:3000/user/registration

Body Params:
{
    "name":"name",
    "email":"email",
    "password":"password"
}
```

User Login (POST)
```
localhost:3000/user/login

Body Params:
{
    "email":"email",
    "password":"password"
}

Returns the auth token, make note of it.
```

Add a Product (POST)
```
localhost:3000/products/product

Body Params:
{
    "name":"name",
    "category":"category",
    "price":"price"
}

Header Params:
auth-token: <insert the auth-token>

Returns the product ID, taken note for future calls
```

Update a Product (PUT)
```
localhost:3000/products/product/:id

Body Params:
{
    "name":"name", (optional)
    "category":"category",(optional)
    "price":"price" (optional)
}

Header Params:
auth-token: <insert the auth-token>
```

Delete a Product (DELETE)
```
localhost:3000/products/product/:id

Header Params:
auth-token: <insert the auth-token>
```

Get All Product (GET)
```
localhost:3000/products/allProducts
```

Get Price Of Product (GET)
```
localhost:3000/products/:id/price
```

Add an Order (POST)
```
localhost:3000/orders/order

Body Params:
{
    "products":"["<prod. ID>", "<prod. ID>"]"
}

Header Params:
auth-token: <insert the auth-token>

Returns the order ID, taken note for future calls
```

Update an Order (PUT)
```
localhost:3000/orders/order/:id

Body Params:
{
    "status":"status", (optional)
}

Allowed Statuses: ['Pending', 'Processing','Delivered','Cancelled']

Header Params:
auth-token: <insert the auth-token>
```

Get All Product (GET)
```
localhost:3000/orders/allOrders

Header Params:
auth-token: <insert the auth-token>
```


## Dependencies
```
@hapi/joi
axios
bcryptjs
dotenv
express
geoip-lite
jsonwebtoken
jwt-decode
mongoose
public-ip
nodemon
```