// Create an array of rating to keep track with the average rating 
let ratingArr = [];

// Function to change basics information of the vendor
function updateItem(itemID) {
    // Get the values of all element
    let itemName = document.getElementById("chgName").value.trim();
    let itemVendor = document.getElementById("chgVendor").value.trim();
    let itemCtg = document.getElementById("chgCtg").value.trim();
    let itemPrice = document.getElementById("chgPrice").value.trim();
    let itemStock = document.getElementById("chgStock").value.trim();
    let itemDesc = document.getElementById("chgDesc").value.trim();
    let itemRating = document.getElementById("addRating").value.trim(); 

    // Get the ID of the product
    let query = `/items/${itemID}?name=${itemName}&category=${itemCtg}&vendor=${itemVendor}&price=${itemPrice}&stock=${itemStock}&description=${itemDesc}&rating=${itemRating}`;

    // Ensure that itemRating is a number from 0-5
    if (itemRating !== "") {
        if (/^(?:[0-5](?:\.\d{1,3})?|5)$/.test(itemRating)) {
            // Add item rating into the array
            ratingArr.push(Number(itemRating));     
        } else {
            alert("Please ensure that rating is a number in the range of 0 to 5 (and wihtin 3 decimals)!");
        }
    }

    // Request for the data
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200) {
            // Parse the incoming response 
            let data = JSON.parse(this.responseText); 

            // Empty the textbox first
            document.getElementById("chgName").value = "";
            document.getElementById("chgVendor").value = "";
            document.getElementById("chgCtg").value = "";
            document.getElementById("chgPrice").value = "";
            document.getElementById("chgStock").value = "";
            document.getElementById("chgDesc").value = "";
            document.getElementById("addRating").value = "";

            // Update the item with new data
            document.getElementById("name").innerHTML = `Details of the item ${data.name}`;
            document.getElementById("ctg").innerHTML = `<strong>Category</strong>: ${data.category}`;
            document.getElementById("vendor").innerHTML = `<strong>Vendor</strong>: ${data.vendor}`;
            document.getElementById("price").innerHTML = `<strong>Price</strong>: $${data.price}`;
            document.getElementById("stock").innerHTML = `<strong>Stock</strong>: ${data.stock}`;
            document.getElementById("descr").innerHTML = `<strong>Description</strong>: ${data.description}`;
            document.getElementById("avrRate").innerHTML = `<strong>Average Rating</strong>: ${ratingAverage(ratingArr)}`;
        }
    }

    // Send PUT request to /items/:itemID
    req.open("PUT", query);
    req.send();
}


// Function to find the average rating of an item 
function ratingAverage(array) {
    // Empty array
    if (array.length === 0) {
        return 0;
    }

    // Find the total sum
    let total = 0;
    for (let i = 0; i < array.length; i++) {
        total += array[i];
    }

    // Return the average rating after dividing the number of rating
    return total/array.length;  
}


// Function to chosen delete item
function deleteItem(itemID) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState==4 && this.status==200) {
            // Alert that the item is deleted
            alert("This item has been deleted!");

            // Redirect to the items page
            window.location.href = "/items";
            
            // Log a message to verify that the redirection is attempted
            console.log("Attempting to redirect...");
        }
    }

    req.open('DELETE', `/items/${itemID}`);
    req.send();
}
