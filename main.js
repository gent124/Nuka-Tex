//Importing needed modules
const express = require('express');
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
const { check, validationResult } = require('express-validator');
const PORT = process.env.PORT || 3030;

// your code



var alert = require('alert');
//Connecting app with MongoDB using mongoose
mongoose.connect("mongodb+srv://midas115:Dardania99@cluster0.yxcxfyc.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const adminUser = {
    username: 'nuka',
    password: 'admin'
}

//Creating strcutre of our schema and their types
const productSchema = {
    productId: String,
    productName: String,
    productAmountBought: Number,
    productPricePerMeter: Number,
    productAmountSold: Number,
    productAmountRemaining: Number
}

//Creating collection of a database that ask for (CollectionName, CollectionSchema)
const Product = mongoose.model('Product', productSchema);


//set the view engine to ejs
app.set("view engine", "ejs");




//Middleware for parsing bodies from url and req.body objects will contain values of any type 
app.use(bodyParser.urlencoded({
    extended: true
}));
//The express.static() method specifies the folder from which to serve all static resources.
app.use(express.static(__dirname + '/public'));

//GET request for login page
app.get('/', function (req, res) {
    res.render('loginPage');
});

app.get('/logOut', function (req, res) {

    res.redirect('../');
    // res.render('loginPage');
});


app.post('/loginPage',
    check('username')
        .matches(adminUser.username).withMessage("Wrong Username")
    ,
    check('password')
        .isIn([adminUser.password]).withMessage("Wrong Password")


    , function (req, res) {
        const errors = validationResult(req);
        const alert = errors.array();
        if (!errors.isEmpty()) {
            console.log(alert);
            res.render('loginPage', {
                alert
            })

        } else {
            console.log("logged in succesfully");
            res.render('Homepage');
        }


    });



//''  Get request with respond with Homepage.ejs 
app.get('/homepage', function (req, res) {
    res.render('Homepage');
});

// '/product' GET request with respond with Product.ejs
app.get('/product', function (req, res) {
    res.render('product');
});



// '/list' GET request with respond with list.ejs and create an object of products that we want pass to list.ejs
app.get('/list', function (req, res) {
    Product.find({}, function (err, products) {
        res.render('list', {
            productsList: products
        });
    });
});

//POST request will get the input from the product.ejs and save it into the MongoDB collection
app.post("/product",
    check('product_id')
        .notEmpty().withMessage("ProductId nuk mund te jete e zbrazet"),
    check('product_name', "Emri i produktit nuk mund te jete i zbrazet")
        .notEmpty(),
    check('product_bought', "Pranohen vetem numra!")
        .notEmpty().withMessage("Sasia e blere nuk mund te jete e zbrazet")
        .isNumeric(),
    check('product_price', "Pranohen vetem numra!")
        .notEmpty().withMessage("Cmimi nuk mund te jete e zbrazet")
        .isNumeric(),
    check('product_sold', "Pranohen vetem numra!")
        .notEmpty().withMessage("Sasia e shitur nuk mund te jete e zbrazet")
        .isNumeric(),
    function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array()
            console.log(errors);
            res.render('product', {
                alert
            })
        } else {



            const product = new Product({
                productId: req.body.product_id,
                productName: req.body.product_name,
                productAmountBought: req.body.product_bought,
                productPricePerMeter: req.body.product_price,
                productAmountSold: req.body.product_sold,
                productAmountRemaining: req.body.product_remaining

            });
            product.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    console.log("Added Succesfully");
                    res.render("product");
                }
            });
        }

    });



//GET request to get the record of MongoDB by id given in the URL
app.get('/updateRecords/:id', function (req, res, next) {

    Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, doc) => {
        if (err) {

            console.log("Cannot retrive data because of database problem");
            next(err);
        } else {
            res.render('updateRecords', { Product: doc });
        }
    });

});

//POST request to find record by id and then update it in the database

app.post('/updateRecords/:id', (req, res, next) => {
    const id = req.params.id;
    const product = {
        productId: req.body.product_id,
        productName: req.body.product_name,
        productAmountBought: req.body.product_bought,
        productPricePerMeter: req.body.product_price,
        productAmountSold: req.body.product_sold,
    };

    Product.findByIdAndUpdate(id, product, (err, doc) => {


        if (err) {
            console.log("Something went wrong with your data");
            console.log(err);
            next(err);

        } else {
            console.log('Updated Succesfully');
            res.redirect('../list');
        }



    });

});

//Function to delete a record in the database and then redirect in the list page
app.get('/delete/:id', (req, res, next) => {
    Product.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
            console.log('Something went wrong to delete data');
            next(err);
        } else {
            console.log("Deleted succesfully");
            res.redirect('/list');
        }
    })
});


//listen() function is used to listen to conenctions on the specified host and port
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
