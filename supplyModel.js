// Require monggoose in the program
const mongoose = require('mongoose');

// Create schema for the database 
const supplySchema = mongoose.Schema({
    name: {type: String},       // name of the supply
    category: {type: String},   // category that contains the supply
    vendor: {type: String},     // vendor that the supply is in
    price: {type: Number},      // supply's price
    stock: {type: Number},      // amount of stock
    rating: {type: [Number]},   // Rating of the supply
    description: {type: String} // supply's description 
});

// Create a model based on vendorSchema
const supplyModel = mongoose.model("supplies", supplySchema);

module.exports = supplyModel; 
