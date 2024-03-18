// Hello Sunny!

// das express und multer
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port = 3000;

// das variables :^O
let categories = ['funnyJoke', 'lameJoke'];
let funnyJoke = [
    {
        'joke': 'Why did the student eat his homework?',
        'response': 'Because the teacher told him it was a piece of cake!'
    },
    {
        'joke': 'What kind of tree fits in your hand?',
        'response': 'A palm tree'
    },
    {
        'joke': 'What is worse than raining cats and dogs?',
        'response': 'Hailing taxis'
    }
];
let lameJoke = [
    {
        'joke': 'Which bear is the most condescending?',
        'response': 'Pan-DUH'
    },
    {
        'joke': 'What would the Terminator be called in his retirement?',
        'response': 'The Exterminator'
    }
];

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// get categories
app.get('/jokebook/categories', (req, res) => {
    res.json(categories);
});
// get jokes by category
app.get('/jokebook/joke/:category', (req, res) => {
    let category = req.params.category;
    let limit = req.query.limit;

    let jokes;

    if (category === 'funnyJoke') {
        jokes = funnyJoke;
    } else if (category === 'lameJoke') {
        jokes = lameJoke;
    } else {
        return res.status(404).json({error: `No category listed for ${category}`});
    }

    if (limit) {
        limit = parseInt(limit);
        jokes = jokes.slice(0, limit);
    }

    res.json(jokes);
});
// add a joke
app.post('/jokebook/joke/new', (req, res) => {
    let category = req.body.category;
    let joke = req.body.joke;
    let response = req.body.response;


    if (!category || !joke || !response || (category !== 'funnyJoke' && category !== 'lameJoke')) {
        return res.status(400).json({error: 'Invalid or insufficient user input'});
    }

    let newJoke = {joke: joke, response: response};

    if (category === 'funnyJoke') {
        funnyJoke.push(newJoke);
        res.json(funnyJoke);
        console.log('funny joke added');
    } else {    // the category is lameJoke
        lameJoke.push(newJoke);
        res.json(lameJoke);
        console.log('lame joke added');
    }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});




// bonus section
let anyJoke = [];         //0
let miscJoke = [];        //1  
let programmingJoke = []; //2
let punJoke = [];         //3
let spookyJoke = [];      //4
let christmasJoke = [];   //5
let jokebook = {
    'Any': anyJoke,
    'Misc': miscJoke,
    'Programming': programmingJoke,
    'Pun': punJoke,
    'Spooky': spookyJoke,
    'Christmas': christmasJoke
};
let allowedItems = ['Any', 'Misc', 'Programming', 'Pun', 'Spooky', 'Christmas'];
// post a special joke from the user
app.post('/jokebook/joke/special', (req, res) => {
    let category = req.body.category;
    let joke = req.body.joke;
    let response = req.body.response;

    if (!category || !joke || !response) {
        return res.status(400).json({error: 'Invalid or insufficient user input'});
    }

    if (!allowedItems.includes(category)) {
        return res.status(444).json({error: 'Illegal category input'});
    }

    // create temp joke JSON object
    let newJoke = {joke: joke, response: response};
    // add it to the jokebook
    jokebook[category].push(newJoke); 
    // check categories for the new category; if it's not there, add it
    if (!categories.includes(category)) {
        categories.push(category);
    }

    res.json(jokebook[category]);
});

// get a foreign joke
app.get('/jokebook/joke/special/:category', (req, res) => {
    let category = req.params.category;

    // if category is not in allowedItems, error
    if (!allowedItems.includes(category)) {
        return res.status(445).json({error: 'Illegal category input'});
    }

    jokes = jokebook[category];
    res.json(jokes);
    
});