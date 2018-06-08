import express from 'express';
const bodyParser = require('body-parser');

//init app
const app = express();

//set port no
const PORT = 3000;

//body parser midleware for json processing
app.use(bodyParser.json());

//home route
app.get('/', (req, res) => {
    res.send({ error: true, message: 'Invalid Endpoint!' });
});


//the API endpoint
const news = require('./routes/newsRoutes');
app.use('/newsapi', news);

//start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;