$(document).ready(function () {
    // Load data from localStorage on page load
    loadProducts();

    // Form validation
    $('#productForm').on('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        // Check all form fields
        $(this).find('input, textarea').each(function () {
            if (!this.checkValidity()) {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (isValid) {
            // If form is valid, add product
            addProduct();
        }
    });

    // Clear validation on input change
    $('#productForm').on('input change', 'input, textarea', function () {
        if (this.checkValidity()) {
            $(this).removeClass('is-invalid');
        }
    });

    // Add product
    function addProduct() {
        let products = getProducts();
        const product = {
            id: generateProductId(products),
            name: $('#productName').val(),
            category: $('#productCategory').val(),
            price: $('#productPrice').val(),
            description: $('#productDescription').val()
        };

        products.push(product);
        saveProducts(products);
        appendProductToTable(product);
        $('#productForm')[0].reset();
    }

    // Generate unique product ID
    function generateProductId(products) {
        if (products.length === 0) return 1;
        const ids = products.map(product => product.id);
        return Math.max(...ids) + 1;
    }

    // Get products from localStorage
    function getProducts() {
        let products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    }

    // Save products to localStorage
    function saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Load products and display in table
    function loadProducts() {
        let products = getProducts();
        $('#productTableBody').empty();
        products.forEach(product => {
            appendProductToTable(product);
        });
    }

    // Append product to table
    function appendProductToTable(product) {
        $('#productTableBody').append(`
            <tr data-id="${product.id}">
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price} <span style="color: brown;">EGP</span></td>
                <td>${product.description}</td>
                <td>
                    <button class="btn btn-sm btn-warning update-button">Update</button>
                    <button class="btn btn-sm btn-danger delete-button">Delete</button>
                </td>
            </tr>
        `);
    }

    // Delete product with confirmation
    $('#productTableBody').on('click', '.delete-button', function () {
        let row = $(this).closest('tr');
        let id = row.data('id');

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let products = getProducts();
                products = products.filter(product => product.id !== id);
                saveProducts(products);
                row.remove();
                Swal.fire(
                    'Deleted!',
                    'Your product has been deleted.',
                    'success'
                );
            }
        });
    });

    // Update product
    $('#productTableBody').on('click', '.update-button', function () {
        let row = $(this).closest('tr');
        let id = row.data('id');
        let products = getProducts();
        let product = products.find(product => product.id === id);

        $('#productName').val(product.name);
        $('#productCategory').val(product.category);
        $('#productPrice').val(product.price);
        $('#productDescription').val(product.description);

        $('#productForm').off('submit').on('submit', function (event) {
            event.preventDefault();

            product.name = $('#productName').val();
            product.category = $('#productCategory').val();
            product.price = $('#productPrice').val();
            product.description = $('#productDescription').val();

            saveProducts(products);
            loadProducts();

            $(this).off('submit').on('submit', function (event) {
                event.preventDefault();
                addProduct();
            });

            $('#productForm')[0].reset();
        });
    });

    // Real-time search functionality
    $('#searchInput').on('input', function () {
        let searchQuery = $(this).val().toLowerCase();
        $('#productTableBody tr').each(function () {
            let row = $(this);
            let productName = row.find('td').eq(1).text().toLowerCase();
            row.toggle(productName.includes(searchQuery));
        });
    });
});
