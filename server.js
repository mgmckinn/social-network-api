const express =require('express');
const mongoose =require('mongoose');
var moment =require('moment');
moment().format();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/social-network`, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true);
app.listen(PORT, () => console.log(`Connected to Mongo on localhost: ${PORT}`));