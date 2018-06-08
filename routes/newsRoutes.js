const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const mcache = require('memory-cache');
const app = require('../app'); // Our app

//the endpoint for getting the topstories
const topstories_endpoint = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';

//using 'async' to indicate that there is a 'promise' to be resolved somewhere in the function
//'await' in front of fetch indicates that all other execution should stop until the Promise resloves
const fetchNews = async (req,res,next) => {
    try{
        //the keyword to be queried
        var keyword = req.query.query;
        if(!keyword){
            var KeywordisNull = new Error('Keyword not found')
            throw KeywordisNull;
            //res.status(400).json({ error: 'Keyword not found!' })
        }
        //get all the topstories using fetch for to support async/await
        const topstories = await fetch(topstories_endpoint)
                                .then(res => res.json())
                                .catch((err) => { throw err; });

        const search_id = 'https://hacker-news.firebaseio.com/v0/item/'
    
        //Using Promise.all to get users in parallel instead of one at a time
        const topstoriesFiltered = await Promise.all(topstories.map(async (topstory) => {
            
                //get each story's content through it's id
                var story_endpoint = search_id + topstory + '.json?print=pretty';
                const news_id = await fetch(story_endpoint)
                                .then(res => res.json())
                                .catch((err) => { throw err; });

                //find relevant titles which contain the keyword
                if(news_id.title.toLowerCase().includes(keyword)){
                    return Object.assign({}, topstory,
                        {title: news_id.title, time: news_id.time, type: news_id.type, score: news_id.score, url: news_id.url});
                }            
        }))
        .catch((err) => {
            console.log(err.message)
            throw err;
        });
        
        //set the data parameter to the results and filter out null values
        req.data = topstoriesFiltered.filter((news) => news);
    }
    catch(err){
        next(err);        
    }
    
    //send the req and res object to the next middleware or the route callback
    next();
}
    
//server-side cache for faster response (somewhat faster!)
var cache = (duration) => {
    return(req, res, next) => {
      let key = '__express__' + req.originalUrl || req.url
      let cachedBody = mcache.get(key)
      if(cachedBody) {
        res.send(cachedBody)
        return
      }
      else {
        res.sendResponse = res.send
        res.send = (body) => {
          mcache.put(key, body, duration * 1000);
          res.sendResponse(body);
        }
        next();
      }
    }
  }


//the API endpoint to filter the topstories
router.get('/searchnews', fetchNews, cache(10), (req, res, next) => {
    if(req.data === undefined || req.data.length == 0){
        res.status(200).json({error: false, message: 'No results for this keyword'})
    }
    else{
        res.status(200).json(req.data);
    }
    
});

//handle all errors
router.use( (err,req,res,next) => {
    console.log(err.name, err.message);
    switch(err.name){
        case 'KeywordisNull':
            res.status(400).json({error: true, message: err.message})
        default: 
            res.status(404).json({error: true, message: err.message})
    }
})
    

// //app
// router.get('/', (req, res) => {
//     res.json({error: true, message: 'This is the app endpoint'})
// });


//invalid routes
router.use((req, res, next) => {
    if(!res.headersSent){
        res.status(404).json({ error: true, message: 'Invalid route!'})
    }
    
}) 

module.exports = router;