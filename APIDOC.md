# *jokebook* API Documentation
## Endpoint 1 - Get Joke Categories
**Request Format:**
/jokebook/categories
**Request Type:**
GET
**Returned Data Format**:
JSON 
**Description:**
This endpoint returns a list of all joke categories.
**Example Request:**
GET /jokebook/categories
**Example Response:**
```json
[
    "funnyJoke",
    "lameJoke"
]
```
**Error Handling:**
None

## Endpoint 2 - Get Jokes by Category
**Request Format:**
/jokebook/joke/:category?limit=number
**Request Type:**
GET
**Returned Data Format**:
JSON 
**Description:**
This endpoint returns a list of jokes from the specified category. The optional limit query parameter limits the number of jokes to return.
**Example Request:**
GET /jokebook/joke/funnyJoke?limit=2
**Example Response:**
```json
[
    {
        "joke": "Why did the student eat his homework?",
        "response": "Because the teacher told him it was a piece of cake!"
    },
    {
        "joke": "What kind of tree fits in your hand?",
        "response": "A palm tree"
    }
]
```
**Error Handling:**
If the specified category does not exist, the server responds with a 404 status code and an error message.

## Endpoint 3 - Add a New Joke
**Request Format:**
/jokebook/joke/new
**Request Type:**
POST
**Returned Data Format**:
JSON 
**Description:**
This endpoint adds a new joke to the specified category. The joke and its response are provided in the body of the request. 
**Example Request:**
POST /jokebook/joke/new with body:
```json
{
    "category": "funnyJoke",
    "joke": "Why don't scientists trust atoms?",
    "response": "Because they make up everything!"
}
```
**Example Response:**
```json
[
    {
        "joke": "Why did the student eat his homework?",
        "response": "Because the teacher told him it was a piece of cake!"
    },
    {
        "joke": "What kind of tree fits in your hand?",
        "response": "A palm tree"
    },
    {
        "joke": "new joke.",
        "response": "new response."
    }
]
```
**Error Handling:**
If the category, joke, or response is not provided, or if the category is not 'funnyJoke' or 'lameJoke', the server responds with a 400 status code and an error message.