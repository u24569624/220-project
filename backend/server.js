const express = require('express');
//CREATE APP
const app = express();
//RESPOND WITH 'HELLO WORLD' FOR ALL REQUESTS FOR THE ROOT URL '/'
app.get('/', (req, res) => {
res.send('Hello World!');
});
//PORT TO LISTEN TO
app.listen(1337, () => {
console.log("Listening on localhost:1337");
});