//-----------------------------------------------------------------------------------------
// Require fs 
const fs = require('fs'); 

// Create an object to hold vendors 
let vendorsData = {};

// Combine all data from 3 .json files in vendors directory into vendorsData object
// Read all JSON files and parse into JSON
let grandStore = JSON.parse(fs.readFileSync("givenVendors/grand.json"));
let indigoStore = JSON.parse(fs.readFileSync("givenVendors/indigo.json"));
let staplesStore = JSON.parse(fs.readFileSync("givenVendors/staples.json")); 

// Add all given vendors into the vendorsData object
vendorsData[staplesStore["id"]] = staplesStore;
vendorsData[indigoStore["id"]] = indigoStore;
vendorsData[grandStore["id"]] = grandStore;

//----------------------------------------------------------------------------------------- 
// Require monggoose in the program
const mongoose = require('mongoose');
const supplyModel = require('./supplyModel');

// Mongoose deployment's connection string
const connectionStr = "mongodb://127.0.0.1:27017/a4";

// An array of data to insert
const dataToInsert = [];

// Create a run async function 
async function run() {
    try {
        // Connect to the database
        await mongoose.connect(connectionStr);
        console.log("Successfully connect to the database!");

        // Drop database
        await mongoose.connection.dropDatabase();
        console.log("Drop the old database... Start recreation!");

        // Loop through the json object to insert the values to database
        for (const key in vendorsData) {
            let genInfo = vendorsData[key];
            for (const category in genInfo.supplies) {
                let supplyData = genInfo.supplies[category];
                for (const supplyValue in supplyData) {
                    let detail = supplyData[supplyValue];
                    
                    let newData = {
                        name: detail["name"],
                        category: category,
                        vendor: genInfo.name,
                        price: detail["price"],
                        stock: detail["stock"],
                        rating: [-1, -1],
                        description: detail["description"]
                    }

                    // Add the new data to the array for many insertions
                    dataToInsert.push(newData);
                }
            }
        }
        
        // Insert the supplies into the "supplies" collection
        const result = await supplyModel.insertMany(dataToInsert);

        // Send to console once done 
        console.log("Successfully inserted supplies into the collection.");

    } finally {
        // Close the Mongoose connection
        await mongoose.connection.close();
    }
}

// Run the function and handle any errors
run().catch(console.dir);