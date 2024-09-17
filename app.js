const express = require('express');
const app = express();
const port = 8080;
const axios = require('axios');  //A promise-based Library to make http requests.
const mongoose = require('mongoose');
const Data = require("./models/platform.js");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect("mongodb://localhost:27017/quadBTech");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get('/fetch-data', async (req, res) => {
    try {
        const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
        
        // Convert the object values to an array
        const data = Object.values(response.data);
        
        if (Array.isArray(data)) {
            // Get the top 10 results
            const top10Results = data.slice(0, 10);

            // Save data to MongoDB
            await Data.deleteMany({}); // Optional: clear the collection before saving new data
            const insetedData = await Data.insertMany(top10Results);

            res.json(insetedData);
        } else {
            res.status(500).send('Unexpected data format');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get("/", async (req, res) => {
    const apiData = await Data.find({});
    res.render("index.ejs", {apiData})
})


app.listen(port, () => {
    console.log("Server is started");
});