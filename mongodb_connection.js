const express = require('express');
const ejs = require('ejs')

const mongoose = require('mongoose')
const bodyParser = require('body-parser');

mongoose.connect("mongodb+srv://midas115:Dardania99@cluster0.yxcxfyc.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const productSchema = {
    productId: String,
    productName: String,
    productAmountBought: Number,
    productAmountSold: Number,
    productAmountRemaining: Number
}


const Product = mongoose.model('Product', productSchema);

const app = express();

app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));


app.get('/product', function (req, res) {
    res.render('product');
});



app.post("/product", function (req, res) {
    console.log(req.body.product_name);

    const product = new Product({
        productId: req.body.product_id,
        productName: req.body.product_name,
        productAmountBought: req.body.product_bought,
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

app.listen(3000, function () {
    console.log("App is running on Port 3000");
});

