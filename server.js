const express = require('express');
const app = require('./app');
const port = process.env.PORT || 2910;
app.listen(port, () => {
    console.log(`server is running on port : ${port}`)
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static('./client/build'))
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, './', 'client', 'build', 'index.html'));
    });
}