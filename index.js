const express = require('express');

const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;
const axios = require('axios');



app.use((req, res, next) => {
    const dateTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    console.log(`${req.method} ${req.url} at ${dateTime}`);
    next();
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
    console.log('hit get /')
    const dateTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    return res.send(`api is up as of ${dateTime}`);
});

app.get("/api/yelp/brewery/:name", async (req, res) => {
    console.log('hit get /api/yelp!')
    console.log('req.params: ', req.params);
    console.log('req.query: ', req.query);

    try {
        const { name: breweryName } = req.params;
        const { state } = req.query;
        console.log('breweryName: ', breweryName);
        console.log('state: ', state);

        if (!breweryName || !state) {
            throw new Error('missing breweryName and/or state')
        }

        // const url = "https://api.yelp.com/v3/businesses/search?location=NYC";

        let url = "https://api.yelp.com/v3/businesses/search?term=" + breweryName + "&location=" + state;

        const getYelpData = () => {
            return axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${process.env.YELP_API_KEY}`
                }
            })
        }

        const businesses = await getYelpData();
        console.log('WEVE GOT BUSINESS DATA');
        // console.log(businesses.data);
        return res.send(businesses.data);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }

});

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});