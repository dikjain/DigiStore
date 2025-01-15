E-Commerce Application

This repository contains the implementation of a feature-rich e-commerce application built using Next.js, React, and various modern libraries. Below are the details and functionalities of the included files.

File 1: userListing

Description:

This file is responsible for displaying the product listing for a user. It includes fetching product data, rendering loaders, and managing the display when no products are found.

Key Features:

Dynamic Fetching:

Products are dynamically fetched on certain conditions using useEffect.

Handles refresh state for re-fetching the product list.

Responsive Design:

Products are displayed in a responsive grid layout.

Custom animations for loaders.

Product Management:

Conditional rendering based on product availability.

Integration with ProductCard component.

Add Product:

Includes a link to add new products.

Libraries Used:

axios for API calls.

Link for navigation.

Custom components like Button and ProductCard.

File 2: CheckOut

Description:

Manages the checkout process, including displaying items in the cart, handling cart updates, and integrating PayPal for payments.

Key Features:

Cart Management:

Products are grouped and displayed with their respective quantities.

Add or remove items dynamically using handleDelete and addItemToCart.

Payment Integration:

PayPal Buttons for payment processing.

Displays payment success or error messages.

Dynamic Loading:

Shows loaders when cart data is being processed.

Libraries Used:

axios for API interactions.

PayPalButtons for payment integration.

sonner for toast notifications.

Custom components like Button, Badge, and Image.

File 3: AddProduct

Description:

A form to add a new product to the store. It handles image and file uploads, category selection, and form validation.

Key Features:

Form Management:

Includes inputs for title, price, category, description, and product details.

File and image upload functionality with ImageUpload component.

Dynamic Validation:

Limits description to 250 characters.

Validates form fields before submission.

Category Selection:

Dropdown for predefined categories.

API Integration:

Sends form data to the backend API.

Handles responses and errors with toast notifications.

Libraries Used:

axios for API interactions.

lucide-react for icons.

sonner for toast notifications.

@clerk/nextjs for user authentication.

Custom components like Select, Input, and Button.

Technologies Used:

Frontend: Next.js, React, TailwindCSS.

Backend: API interactions via axios.

State Management: Context API.

Authentication: @clerk/nextjs.

Payment Gateway: PayPal.

Notifications: sonner.

How to Run:

Clone the repository:

git clone <repository-url>

Install dependencies:

npm install

Start the development server:

npm run dev

Access the application at http://localhost:3000.

Future Enhancements:

Add product search and filtering capabilities.

Implement detailed order history for users.

Expand payment options.

Contribution:

Contributions are welcome! Feel free to submit a pull request or raise an issue for any suggestions or bugs.

License:

This project is licensed under the MIT License. See the LICENSE file for more details.
