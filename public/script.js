// hello Sunny!

// search bar and button
const searchBar = document.getElementById('searchBar');
const searchButton = document.getElementById('searchButton');
// joke creation suite
const jokeBar = document.getElementById('jokeBar');
const responseBar = document.getElementById('responseBar');
const categoryBar = document.getElementById('categoryBar');
const jokeButton = document.getElementById('jokeSubmit');
// joke category span
const jokeCategory = document.getElementById('categories');
// joke list span
const jokeList = document.getElementById('jokes');

// search suggesitons
let suggestionBox = document.createElement('div');
suggestionBox.id = 'suggestionBox';
searchBar.parentNode.insertBefore(suggestionBox, searchBar.nextSibling);
let allowedItems = ['funnyJoke', 'lameJoke', 'Any', 'Misc', 'Programming', 'Pun', 'Spooky', 'Christmas'];


const port = 3000;

main();

// Add an event listener to the search button
searchButton.addEventListener('click', performSearch);
// Add an event listener for the 'keypress' event to the search bar
searchBar.addEventListener('keypress', performSearch);
// Add an event listener to the joke button
jokeButton.addEventListener('click', submitJoke);
// Add an event listener to the search bar for input suggestions
searchBar.addEventListener('input', updateSuggestions);

function updateSuggestions() {
    let input = this.value;
    // Clear previous suggestions
    suggestionBox.innerHTML = '';
    if (!allowedItems.includes(input)) {
        // Display all allowed items
        allowedItems.forEach(item => {
            let div = document.createElement('div');
            div.textContent = item;
            div.addEventListener('click', function() {
                searchBar.value = this.textContent;
                suggestionBox.innerHTML = '';
            });
            suggestionBox.appendChild(div);
        });
    }
}



function main() {
    initializeCategories();
}

// Function to perform the search
function performSearch(event) {
    // Check if the key pressed was Enter
    if (event.type === 'keypress' && event.key !== 'Enter') {
        return;
    }
    // Get the current value of the search bar
    const searchTerm = searchBar.value;

    displayJokes(searchTerm);
}

function submitJoke() {
    // Get the current value of the joke bar
    const joke = jokeBar.value;
    const response = responseBar.value;
    const category = categoryBar.value;
    // Function to make a POST request to the server to add a joke
    postJokeReq(joke, response, category).then(data => {
        // display the jokes for the category
        displayJokes(category);
    });
}

function postJokeReq(joke, response, category) {
    // make a POST request to the server to add a joke
    const url = `http://localhost:${port}/jokebook/joke/new`;

    const data = { category, joke, response };

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Error:', error);
    });
}

function initializeCategories() {
    // clear the current joke category list
    jokeCategory.innerHTML = '';
    const url = `http://localhost:${port}/jokebook/categories`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // for each element in data, create a button with its name and an event listener
            data.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category;
                button.addEventListener('click', () => {
                    displayJokes(category);
                });
                jokeCategory.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayJokes(category) {
    if (category !== 'funnyJoke' && category !== 'lameJoke') {
        searchForeignJokes(category);
    } else {
        // get an array of jokes from the server
        getJokes(category).then(jokeTempArray => {
            // clear the current joke list
            jokeList.innerHTML = '';
            // for each joke in the array, create a list item and add it to the joke list
            jokeTempArray.forEach(joke => {
                const listItem = document.createElement('li');
                listItem.textContent = `${joke.joke} - ${joke.response}`;
                jokeList.appendChild(listItem);
            });
            
        });
    }
}

function getJokes(category) {
    // make a GET request to the server to get the jokes based on category
    const url = `http://localhost:${port}/jokebook/joke/${category}`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
}

function searchForeignJokes(category) {
    // make sure that category is in allowedItems, skipping the first two elements
    if (!allowedItems.slice(2).includes(category)) {
        return;
    }
    let limit = 3;
    let safeString = '?safe-mode';
    let baseUrl = 'https://v2.jokeapi.dev/joke/';
    let url = baseUrl + category + safeString + '&type=twopart&amount=' + limit;
    // make a fetch request to the URL
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.jokes.forEach(joke => {
                let setup = joke.setup;
                let delivery = joke.delivery;
                postForeignJoke(category, setup, delivery);
            });
        })
        .then(() => {
            initializeCategories();
        })
        .then(() => {
            displayForeignJokes(category);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function postForeignJoke(category, joke, response) {
    // make a POST request to the server to add a joke
    let data = {category: category, joke: joke, response: response};
    fetch('/jokebook/joke/special', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function displayForeignJokes(category) {
    // if category is not in allowedItems, skip the function
    if (!allowedItems.includes(category)) {
        return;
    }
    // get an array of jokes from the server
    getForeignJokes(category).then(jokeTempArray => {
        // clear the current joke list
        jokeList.innerHTML = '';
        // for each joke in the array, create a list item and add it to the joke list
        jokeTempArray.forEach(joke => {
            const listItem = document.createElement('li');
            listItem.textContent = `${joke.joke} - ${joke.response}`;
            jokeList.appendChild(listItem);
        });
    });
}

function getForeignJokes(category) {
    // make a GET request to the server to get the foreign jokes based on category
    // fetch jokebook/joke/special/:category
    const url = `http://localhost:${port}/jokebook/joke/special/${category}`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
}