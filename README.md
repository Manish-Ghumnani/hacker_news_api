# Hacker News API filter

## An API endpoint to filter HackerNews topstories via keywords

## Pre-requisites

Technology Stack
```
node js (server)
express js (api)
mocha & chai (unit testing)
node-fetch (fetch api in node)
memory-cache (in-memory cache)
babel (to use es2015 and above syntax)
```

### Installing, Running and testing the app
1. Install node
2. Open terminal and go to the project directory
3. Run 'npm install'
4. Run 'npm start' to start the server
5. Test via URL: http://localhost:3000/newsapi/searchnews/?query=keyword on Postman or some other REST client
6. Run 'npm test' to run tests

## Screenshots

### 1. Invalid Route
![alt text](/screens/invalid_route.png "Title")

### 2. Keyword is NULL
![alt text](/screens/keyword_null.png "Title")

### 3. No results for keyword
![alt text](/screens/no_results.png "Title")

### 4. Results found!
![alt text](/screens/results_found.png "Title")
