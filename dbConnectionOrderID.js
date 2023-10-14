const { MongoClient } = require('mongodb');

async function fetchData() {
    const uri = 'mongodb://frontFlight:c82pwfdZTHBAQeMP5h6K@13.51.86.148:27788/ff_dev_db';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const givenOrderID = ["12345", "6NM7JP" , "HZPDYZ"]
    try {
        await client.connect();
        const db = client.db();
        const collection = db.collection('order');

        const result = await collection.find().map(doc => {
            try {
                const orderDetails = doc.Response.orderdetails;
                const orderID = orderDetails.orderid.value;

                if (orderID === givenOrderID[2]) {
                    return orderDetails;
                }

                else {
                    return "Error";
                }
            }

            catch (error) {
                console.error('Error processing document:', error);
                return "Error";
            }
        }).toArray();
        
        console.log('Fetched order IDs:', result);


    }

    catch (err) {
        console.error('Error:', err);
    }
    finally {
        client.close();
    }
}

fetchData();


