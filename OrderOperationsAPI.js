const express = require('express');
const app = express();
const port = 3000;


const OrderDetails = require('C:/Users/ashuk/Downloads/responseordercreate.json')
const requestBody = {
    "Query": {
        "Filters": {
            "OrderID": {
                "value": "5POJXC",
                "Owner": "LX",
                "Channel": "NDC"
            }
        }
    }
}


app.get('/api/orderRetrieveDetails', (req, res) => {   
    res.json(getOrderRetrieve( requestBody));
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


function getOrderRetrieve( requestBody) {
   
    const OrderId = requestBody?.Query?.Filters?.OrderID?.value || ""
    const Owner = requestBody?.Query?.Filters?.OrderID?.Owner || ""

    try {
      if (!OrderId || !Owner) {
        throw new Error("OrderId and Owner are required.");
      }  
      const requestPayload = {
        Query: {
          Filters: {
            OrderID: {
              value: OrderId,
              Owner : Owner,
              Channel: "NDC",
            },
          },
        },
      };    
  
      return { requestPayload };
    } catch (error) {
      console.error("Error while creating the request payload:", error);
      throw error;
    }
  }
