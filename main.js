//Importing needed modules
const express = require('express');
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
//Connecting app with MongoDB using mongoose
mongoose.connect("mongodb+srv://midas115:Dardania99@cluster0.yxcxfyc.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


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

//''  Get request with respond with Homepage.ejs 
app.get('', function (req, res) {
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
app.post("/product", function (req, res) {
    console.log(req.body.product_id);

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
            res.render("product");
        }
    });


});



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


app.post('/updateRecords/:id', (req, res, next) => {
    console.log(req.params.id);
    console.log(req.body);
    const id = req.params.id;
    const updates = req.body;
    Product.findByIdAndUpdate(req.params.id, updates, (err, doc) => {


        if (err) {
            console.log("Something went wrong with your data");
            console.log(err);
            next(err);

        } else {
            console.log(req.body.product_name);
            res.redirect('../list');
        }



    });

});

//listen() function is used to listen to conenctions on the specified host and port
app.listen(3000, function () {
    console.log("App is running on Port 3000");
});

