// A function to add stock for bulk page 
function addStock() {
    // Get 3 data from bulk.pug text box: vendor, category, stock 
    const chosenVendor = document.getElementById("bVendor").value.trim();
    const chosenCategory = document.getElementById("bCtg").value.trim();
    const chosenStockAmount = document.getElementById("bStock").value.trim();

    // Combine all data together 
    const allData = {chosenVendor, chosenCategory, chosenStockAmount};

    // Confirm that the stock is a positive integer
    let text = "Please confirm that your input for the stock is a positive integer";
    if (confirm(text) == true) {
        // Stock value passes the validation 
        if (Number.isInteger(Number(chosenStockAmount)) && Number(chosenStockAmount) >= 0) {
            // XMLHttpRequest --> request data from server 
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState==4 && this.status==200) {
                    // Alert to the user that the stock is updated successfully
                    alert("Stock updated successfully.");

                    // Redirect to the item page 
                    window.location.href = "/items";
                }
            }

            // Send a PUT request to /addstock 
            req.open("PUT", "/addstock");
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(allData));
        } 
        // The stock is not a postive integer 
        else { 
            alert("The stock value is not a positive integer!");
        }
    // The user confirms that the stock values is not a positive integer 
    } else {
        alert("Please enter a positive integer for the stock value!");
    } 
}


// A function to update the sale value 
function saleData() {
    // Get the sale data, vendor and category 
    const saleData = document.getElementById("bSale").value.trim();
    const vendorData = document.getElementById("bVendor").value.trim();
    const categoryData = document.getElementById("bCtg").value.trim();

    // Combine all data together
    const allData = {saleData, vendorData, categoryData};

    // Confirm the requirement for sale
    if (Number.isInteger(Number(saleData)) && Number(saleData) >= 0 && Number(saleData) <= 100) {
        // XMLHttpRequest --> request data from server 
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                // Alert to the user that the stock is updated successfully
                alert("Sales added successfully.");

                // Redirect to the item page 
                window.location.href = "/items";
            }
        }

        // Send a PUT request to /sale 
        req.open("PUT", "/sale");
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(allData));
    } else {
        alert("Please make sure that the sales percentage value is a positive integer >= 0 and <= 100");
    }
}