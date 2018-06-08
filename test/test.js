//'use strict';

const chai = require('chai');  
const expect = require('chai').expect;


chai.use(require('chai-http'));
 
const app = require('../app.js'); // Our app
 

//describe the API endpoint 
describe('NEWS API endpoint /newsapi', function()  {  
  this.timeout(20000);   //timeout for the response

  before( () => {
    console.log("Running mocha tests!");
  });
 
  after( () => {
    console.log("Finished running tests!");
  });

    // GET - Invalid path
    it('should return Not Found!', () => {
    return chai.request(app)
      .get('/INVALID_PATH')
      .then( (res) => {
        expect(res).to.have.status(404);
        throw new Error('Invalid Path!');
      })
      .catch( (err) => {
        console.log(err.message);
      });
  });
 
  //if keyword is null or undefined
  it('should return Keyword not found', () => {
      return chai.request(app)
      .get('/newsapi/searchnews')
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(true);
      })
  });

  //checking proper json response for a 'common' keyword which returns results
  it('should return a 200 response and the results in proper json format', async () => {
    const res = await chai.request(app)
                .get('/newsapi/searchnews')
                .query({ query: 'the' })
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.an('object');
        expect(res.body[0]).to.have.property("title");
        expect(res.body[0].title).to.not.equal(null);
        expect(res.body[0]).to.have.property("time");
        expect(res.body[0].time).to.not.equal(null);
        expect(res.body[0]).to.have.property("type");
        expect(res.body[0].type).to.not.equal(null);
        expect(res.body[0]).to.have.property("score");
        expect(res.body[0].score).to.not.equal(null);
        expect(res.body[0]).to.have.property("url");
        expect(res.body[0].url).to.not.equal(null);
});    
 
});