let cart = [];

// Function to add item to the cart
function addToCart(name, price) {
    const item = { name, price: parseFloat(price) };
    cart.push(item);
    updateCart(); // Update cart display after adding an item

    // Change the button to indicate that the item has been added to the cart
    const button = document.querySelector(`[data-name="${name}"]`);
    if (button) {
        button.classList.add('btn-added');
        button.innerText = 'Added to Cart';
        setTimeout(() => {
            button.classList.remove('btn-added');
            button.innerText = 'Add to Cart';
        }, 2000); // Reset button text after 2 seconds
    }
}

// Function to remove item from the cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart(); // Update cart display after removing an item
}

// Function to update cart display
function updateCart() {
    let total = 0;
    const cartItems = cart.map(item => {
        total += item.price;
        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.name} - $${item.price.toFixed(2)}
                <button class="btn btn-danger btn-sm ms-2" data-name="${item.name}">Remove</button>
            </li>
        `;
    }).join('');

    document.querySelector('#cartItems').innerHTML = cartItems;
    document.querySelector('#cartTotal').innerText = `Total: $${total.toFixed(2)}`;

    // Add event listeners to "Remove" buttons
    document.querySelectorAll('#cartItems .btn-danger').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            removeFromCart(name);
        });
    });
}

// Function to handle cash out
function cashOut() {
    if (cart.length === 0) {
        document.querySelector('#cartItems').innerHTML = '<li class="list-group-item">Your cart is empty!</li>';
        document.querySelector('#cartTotal').innerText = 'Total: $0.00';
        return;
    }

    // Calculate the total amount
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    // Update the modal message
    document.querySelector('#thankYouMessage').innerText = `Thank you for your purchase! Your total is $${total}.`;

    // Show the modal
    var myModal = new bootstrap.Modal(document.getElementById('thankYouModal'), {
        keyboard: false
    });
    myModal.show();

    // Clear the cart after a short delay to allow the user to see the modal
    setTimeout(() => {
        document.querySelector('#cartItems').innerHTML = '<li class="list-group-item">Your cart is empty!</li>';
        document.querySelector('#cartTotal').innerText = 'Total: $0.00'; // Reset total
        cart = []; // Clear the cart
    }, 2000); // Adjust delay as needed
}

// Event listeners for "Add to Cart" buttons
document.querySelectorAll('.btn-warning').forEach(button => {
    // Add a data attribute to each button to identify the item
    const card = button.closest('.card');
    const name = card.querySelector('.card-title').innerText;
    button.setAttribute('data-name', name);
    
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const name = card.querySelector('.card-title').innerText;
        const price = card.querySelector('.price').innerText.slice(1); // Extract the price without the '$' sign

        addToCart(name, price); // Add item to cart
    });
});

// Event listener for "Cash Out" button
document.querySelector('#cashOutButton').addEventListener('click', cashOut);

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const items = document.querySelectorAll('.card');

    const categoryLinks = document.querySelectorAll('.category-filter');
    const productCards = document.querySelectorAll('.card[data-category]');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedCategory = link.getAttribute('data-category');

            productCards.forEach(card => {
                if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    // Handle search button click
    searchButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission and page refresh
        
        const query = searchInput.value.toLowerCase();
        filterItems(query);
        
        // Clear the search input
        searchInput.value = '';
    });
    
    // Filter items based on query
    function filterItems(query) {
        items.forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const description = item.querySelector('.card-text').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                item.style.display = ''; // Show item
            } else {
                item.style.display = 'none'; // Hide item
            }
        });
    }
});