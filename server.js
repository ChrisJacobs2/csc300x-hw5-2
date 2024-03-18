// Hello Sunny!

// das express und multer
const express = require('express');
const multer = require('multer');
const app = express();
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

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.get('/jokebook/categories', (req, res) => {
    res.json(categories);
});
  
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

