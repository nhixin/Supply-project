// Reuiqre express
const express = require('express');
const app = express();

// Require path
const path = require('path');     

// Parse incoming requests with JSON 
app.use(express.json());

// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

// Create template engine - pug
app.set('views', './public/views');
app.set('view engine', 'pug');

//Set up the routes
app.get("/", sendIndex);
app.get("/items", sendItems);
app.get("/items/:itemID", itemPage);
app.put("/items/:itemID", updateItem); 
app.delete("/items/:itemID", deleteItem);
app.get("/additem", addSuppItem);
app.post("/items", createItem);
app.get("/bulk", bulkPage);
app.put("/addstock", addStock);
app.put("/sale", updateSale);

// Require mongoose and supply model
const mongoose = require('mongoose');
const suppliesModel = require('./supplyModel');

// Mongoose deployment's connection string
const connectionStr = "mongodb://127.0.0.1:27017/a4";
// Connect to the database
mongoose.connect(connectionStr); 

//==============================================================================
// ALL FUNCTION FOR SERVER.JS

// The homepage
function sendIndex(req, res, next) {
    res.status(200).render("index");
} 


// Function to send a list of items to the server
async function sendItems(req, res, next) {
    try {
        // Get the collections of supply 
        const allSupplies = await suppliesModel.find({});

        // Respond with html page (or json data) if user request text/html (or application/json)
        res.format({
            "text/html": function() {
                res.status(200).render("items", {pugData: allSupplies});
            },
            "application/json": function() {
                res.status(200).json({"All Supplies": allSupplies});
            }
        }); 
    } catch (error) {
        res.status(404).send(error.message);    // send an error 
    }
}


// Function to access each item's page
async function itemPage(req, res, next) {
    // Get the id of the chosen item
    let queryInfo = { "_id": new mongoose.Types.ObjectId(req.params.itemID)};
 
    // Find the chosen item based on the id
    let findResult = await suppliesModel.findOne(queryInfo);

    // Send to result  
    if (findResult) { 
        res.status(200).render("item", {pugData: findResult});
    } else {
        res.status(404).send("Unknown item");
    } 
}  


// Asynchronous function to update a specific item
async function updateItem(req, res, next) {
    try {
        // Find the id of the item
        const ID = req.params.itemID;

        // Find the chosen item
        const chosenItem = await suppliesModel.findById(ID);

        // Update the item properties
        if (req.query.name != "") {
            chosenItem.name = req.query.name;
        }
        if (req.query.category != "") {
            chosenItem.category = req.query.category;
        }
        if (req.query.vendor != "") {
            chosenItem.vendor = req.query.vendor;
        } 
        if (req.query.price != "") {
            chosenItem.price = req.query.price;
        } 
        if (req.query.stock != "") {
            chosenItem.stock = req.query.stock;
        } 
        if (req.query.description != "") {
            chosenItem.description = req.query.description;
        } 
        if (req.query.rating) {
            chosenItem.rating = req.query.rating;
        } 

        // Save the changes to the database
        await chosenItem.save();

        // Respond with the updated item
        res.status(200).json(chosenItem);

    } catch (err) { 
        res.status(500).send("Unknown ID");
    }
}


// Asynchronous function to delete a specific item 
async function deleteItem(req, res, next) {
    try {
        // Find the id of the item
        const theID = req.params.itemID;

        // Delete the item using the ID
        const result = await suppliesModel.findByIdAndDelete(theID);

        if (result) {
            // Redirect to the items page
            res.status(200).send("Successfully delete the item");
        }

    } catch (err) {
        res.status(500).send(err.message);
    }
}


// Asynchronous function to go to the page for adding an item to the supply list
async function addSuppItem(req, res, next) {
    try {
        // Send the data of allSupplies to additem.pug
        res.status(200).render("additem");

    } catch (error) {
        res.status(404).send(error.message);    // send an error 
    }
}
 

// Asynchronous function to post the new item
async function createItem(req, res, next) {
    try {
        // Create a new instance of suppliesModel --> a new item
        let newItem = new suppliesModel({
            name: req.body.name,
            category: req.body.category,
            vendor: req.body.vendor,
            price: req.body.price,
            stock: req.body.stock,
            rating: [-1, -1],
            description: req.body.description
        });
    
        // Insert the supplies into the "supplies" collection
        const result = await newItem.save();

        console.log(result);

        // Send result to client side 
        res.status(200).send(result);

    } catch (err) {
        res.status(500).send(err.message);
    }
}


// Async function to get the bulk page 
async function bulkPage(req, res, next) {
    try {
        // Send the data of allSupplies to additem.pug
        res.status(200).render("bulk");

    } catch (error) {
        res.status(404).send(error.message);    // send an error 
    }
}


// Asynchronous function to add stock in bulk page
async function addStock(req, res, next) {
    try {
        // Initialize value for req.body
        const {chosenVendor, chosenCategory, chosenStockAmount} = req.body;

        // Find all items that match vendor, category and smaller than the stock amount
        const result = await suppliesModel.updateMany({vendor: chosenVendor, category: chosenCategory, stock: {$lt: chosenStockAmount}}, {$inc: {stock: 5}});

        // Send result to the client side 
        res.status(200).send(result);

    } catch (err) {
        res.status(500).send(err.message);
    }
}


// Async function to put sales data 
async function updateSale(req, res, next) {
    try {
        // Initialize value for req.body
        const {saleData, vendorData, categoryData} = req.body;

        // Find all items that match vendor and apply the sale 
        const vendorMatch = await suppliesModel.find({vendor: vendorData});
        const result1 = await Promise.all(vendorMatch.map((element) => {
            const discountedPrice = element.price - (saleData / 100 * element.price);
            return suppliesModel.updateOne({_id: element._id}, {$set: {price: discountedPrice}});
        }));


        // Find all items that match the category and apply the sale
        const categoryMatch = await suppliesModel.find({category: categoryData});
        const result2 = await Promise.all(categoryMatch.map((element) => {
            const discountedPrice = element.price - (saleData / 100 * element.price);
            return suppliesModel.updateOne({_id: element._id}, {$set: {price: discountedPrice}});
        }));

        // Send result to the client side 
        res.status(200).send({result1, result2});

    } catch (err) {
        res.status(500).send(err.message);
    }
}


// Asynchronous function to run the server 
async function run() {
    try { 

	} finally {
        console.log("Server listening at http://localhost:9000");		
        app.listen(9000); 
	} 
}


// call run() and catch error 
run().catch(console.dir);