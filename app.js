const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const {MONGOURI} = require('./config/keys');
const cors = require('cors');
app.use(cors());


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Succesfully connected to Database!');
})

mongoose.connection.on('error', (err) => {
    console.log('ERROR connecting: '+err);
})

require('./models/user');
require('./models/post');

app.use(express.json());

app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log('Server running on port: ',PORT);
});