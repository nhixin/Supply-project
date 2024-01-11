// Function to add new item to the list of supplies 
function submit() {
    // Get the value of all of the data
    let iName = document.getElementById("addName").value.trim();
    let iVendor = document.getElementById("addVendor").value.trim();
    let iCtg = document.getElementById("addCtg").value.trim();
    let iPrice = document.getElementById("addPrice").value.trim();
    let iStock = document.getElementById("addStock").value.trim();
    let iDesc = document.getElementById("addDesc").value.trim();

    /* // Create a query link
    let query = `/items?name=${iName}&category=${iCtg}&vendor=${iVendor}&price=${iPrice}&stock=${iStock}&description=${iDesc}`; */

    let newItem = {
        name: iName,
        category: iCtg,
        vendor: iVendor,
        price: iPrice,
        stock: iStock,
        rating: [-1, -1],
        description: iDesc
    };

    // XMLHttpRequest 
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState==4 && this.status==200) {
            // Check if there is any response data from the server 
            const data = JSON.parse(this.responseText);

            // Alert that new vendor is added
            alert("The new item is added");

            // Empty the textbox 
            document.getElementById("addName").value = "";
            document.getElementById("addVendor").value = "";
            document.getElementById("addCtg").value = "";
            document.getElementById("addPrice").value = "";
            document.getElementById("addStock").value = "";
            document.getElementById("addDesc").value = "";

            // Redirect to the item window
            window.location.href = `/items/${data._id}`;
        }
    }

    // Send POST request to /items
    req.open("POST", "/items");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(newItem));
}