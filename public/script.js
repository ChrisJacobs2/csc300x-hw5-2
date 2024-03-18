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


/**
 * Updates the suggestions displayed to the user based on the current input.
 * If the input is not included in the allowed items, all allowed items are displayed as suggestions.
 * Clicking on a suggestion will fill the search bar with the suggestion and clear the suggestion box.
 * 
 * @function
 * @global
 * @listens input#value
 * @fires click
 */
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

/**
 * Performs a search when the Enter key is pressed in the search bar.
 * The search term is the current value of the search bar.
 * After getting the search term, it calls the `displayJokes` function to display the jokes related to the search term.
 *
 * @function
 * @param {Event} event - The event object, contains information about the keypress event.
 * @listens keypress:Enter
 * @fires displayJokes
 */
function performSearch(event) {
    // Check if the key pressed was Enter
    if (event.type === 'keypress' && event.key !== 'Enter') {
        return;
    }
    // Get the current value of the search bar
    const searchTerm = searchBar.value;

    displayJokes(searchTerm);
}

/**
 * Submits a new joke to the server.
 * The joke, response, and category are taken from their respective input fields.
 * After the joke is submitted, the jokes for the category are displayed.
 *
 * @function
 * @global
 * @listens click:Submit
 * @fires postJokeReq
 * @fires displayJokes
 */
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

/**
 * Makes a POST request to the server to add a new joke.
 * The joke, response, and category are sent in the body of the request.
 * If the request is successful, the response from the server is returned.
 * If there is an error, it is logged to the console.
 *
 * @function
 * @param {string} joke - The joke to be added.
 * @param {string} response - The response to the joke.
 * @param {string} category - The category of the joke.
 * @returns {Promise<Object>} The response from the server.
 * @throws {Error} If there is an error with the request.
 */
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

/**
 * Initializes the joke categories by fetching them from the server.
 * Clears the current joke category list and then makes a GET request to the server to get the categories.
 * For each category, a button is created with the category name and an event listener that calls `displayJokes` when clicked.
 * If there is an error with the request, it is logged to the console.
 *
 * @function
 * @global
 * @fires displayJokes
 */
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

/**
 * Displays jokes based on the selected category.
 * If the category is 'funnyJoke' or 'lameJoke', it fetches jokes from the server and displays them.
 * Otherwise, it calls `searchForeignJokes` to fetch and display jokes from an external API.
 * Each joke is displayed as a list item in the joke list.
 *
 * @function
 * @param {string} category - The category of jokes to display.
 * @fires getJokes
 * @fires searchForeignJokes
 */
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

/**
 * Fetches jokes from the server based on the specified category.
 * Makes a GET request to the server and returns the response as a JSON object.
 * If there is an error with the request, it is logged to the console.
 *
 * @function
 * @param {string} category - The category of jokes to fetch.
 * @returns {Promise<Object>} The response from the server, a JSON object containing the jokes.
 * @throws {Error} If there is an error with the request.
 */
function getJokes(category) {
    // make a GET request to the server to get the jokes based on category
    const url = `http://localhost:${port}/jokebook/joke/${category}`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
 * Searches for jokes from a foreign API based on the specified category.
 * The category must be in the allowedItems array, skipping the first two elements.
 * Makes a GET request to the foreign API and for each joke, it posts the joke to the server using the `postForeignJoke` function.
 * After all jokes are posted, it initializes the categories and displays the foreign jokes.
 * If there is an error with the request, it is logged to the console.
 *
 * @function
 * @param {string} category - The category of jokes to search.
 * @fires postForeignJoke
 * @fires initializeCategories
 * @fires displayForeignJokes
 * @throws {Error} If there is an error with the request.
 */
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

/**
 * Posts a foreign joke to the server.
 * The joke, response, and category are sent in the body of the POST request.
 * If the request is successful, the response from the server is logged to the console.
 * If there is an error with the request, it is logged to the console.
 *
 * @function
 * @param {string} category - The category of the joke.
 * @param {string} joke - The joke to be posted.
 * @param {string} response - The response to the joke.
 * @throws {Error} If there is an error with the request.
 */
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

/**
 * Displays foreign jokes based on the selected category.
 * If the category is not in the allowedItems array, the function is skipped.
 * Fetches an array of jokes from the server using the `getForeignJokes` function.
 * Each joke is displayed as a list item in the joke list.
 *
 * @function
 * @param {string} category - The category of jokes to display.
 * @fires getForeignJokes
 */
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

/**
 * Fetches foreign jokes from the server based on the specified category.
 * Makes a GET request to the server and returns the response as a JSON object.
 * If there is an error with the request, it is logged to the console.
 *
 * @function
 * @param {string} category - The category of jokes to fetch.
 * @returns {Promise<Object>} The response from the server, a JSON object containing the jokes.
 * @throws {Error} If there is an error with the request.
 */
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