function loginUser() {
    console.log("log in");
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const logInButton = document.getElementById('log-in');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/login', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({ username, password }));

    xhttp.onload = () => {
        if (xhttp.status === 200) {
            alert('Login successful!');
            window.location.href = '/';
        } else {
            alert('Error: ' + xhttp.responseText);
        }
    };

}

function registerUser() {
    console.log("register");
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const registerButton = document.getElementById('register');


    const username = usernameInput.value;
    const password = passwordInput.value;

    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/register', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({ username, password }));

    xhttp.onload = () => {
        if (xhttp.status === 200) {
            alert('Registration successful!');
            window.location.href = `/login`;
        } else {
            alert('Error: ' + xhttp.responseText);
        }
    };

}

function queryCollections() {
    const form = document.querySelector('form');

    // Get the values of the artist, style, and name input fields
    const artist = form.querySelector('#artist').value;
    const style = form.querySelector('#style').value;
    const name = form.querySelector('#name').value;

    if (!(Boolean(artist) || Boolean(style) || Boolean(name))) {
        const url = `/collections`;
    } else {
        const url = `/collections?artist=${artist}&style=${style}&name=${name}`;
    }

    // Set the HTTP method and URL
    request.open('GET', url);

    request.onload = () => {
        if (request.status === 200) {
            // Refresh the page with the query URL
            window.location = url;
        } else {
            // Handle any errors that may occur
        }
    };

    // Send the request to the server
    request.send();
}

function queryArtists() {
    const form = document.querySelector('form');

    const name = form.querySelector('#name').value;

    if (!Boolean(name)) {
        const url = `/artists`;
    } else {
        const url = `/artists?name=${name}`;
    }

    // Set the HTTP method and URL
    request.open('GET', url);

    request.onload = () => {
        if (request.status === 200) {
            // Refresh the page with the query URL
            window.location = url;
        } else {
            // Handle any errors that may occur
        }
    };

    // Send the request to the server
    request.send();
}

function submitArtwork() {
    console.log("LOL")
    // Get the values of the input fields by grabbing their element id
    const name = document.getElementById('name').value;
    const style = document.getElementById('style').value;
    const medium = document.getElementById('medium').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const link = document.getElementById('link').value;

    // Create a new XMLHttpRequest object
    const xhttp = new XMLHttpRequest();

    xhttp.open('POST', '/upload', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({ name, style, medium, category, description, link }));

    xhttp.onload = () => {
        if (xhttp.status === 200) {
            alert('Submission successful!');
            window.location.href = `/collections/${name}`;
        } else {
            alert('Error: ' + xhttp.responseText);
        }
    };
}