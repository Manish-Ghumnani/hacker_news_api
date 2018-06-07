const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

//the endpoint for getting the topstories
const topstories_endpoint = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';

//using 'async' to indicate that there is a 'promise' to be resolved somewhere in the function
//'await' in front of fetch indicates that all other execution should stop until the Promise resloves
const fetchNews = async (req,res,next) => {
    try{
        //the keyword to be queried
        var keyword = req.query.keyword;

        var news_results = [];
        
        //get all the topstories using fetch for to support async/await
        const topstories = await fetch(topstories_endpoint).then(res => res.json()).catch(err => console.log('error'))
        const search_id = 'https://hacker-news.firebaseio.com/v0/item/'
    
        //Using Promise.all to get users in parallel instead of one at a time
        const topstoriesFiltered = await Promise.all(topstories.map(async (topstory) => {
            try{

                //get each story's content through it's id
                var story_endpoint = search_id + topstory + '.json?print=pretty';
                const news_id = await fetch(story_endpoint).then(res => res.json()).catch(err => console.log('error', err.message));
            
                //find relevant titles which contain the keyword
                if(news_id.title.toLowerCase().includes(keyword)){
                    return Object.assign({}, topstory,
                        {title: news_id.title, time: news_id.time, type: news_id.type, score: news_id.score, url: news_id.url});
                }
            
            }
            catch(error){
                console.log(error);
                res.status(200).json({error: 'No results'});
            }                
            
        }))
        .catch(err => console.log('error occured', err.message));
        
        //set the data parameter to the results and filter out null values
        req.data = topstoriesFiltered.filter((news) => news);
    }
    catch(error){
        console.log(error);
        res.status(200).json({error: 'No results'});
    }
    
    //send the req and res object to the next middleware or the route callback
    next();
}
    
   
//the API endpoint to filter the topstories
router.get('/searchnews', fetchNews, (req, res, next) => {
    res.status(200).json(req.data);
});

module.exports = router;