![Screenshot 2025-04-24 160629](https://github.com/user-attachments/assets/e6fe169b-0dcf-4be3-b392-49f87091823b)

1. Project Structure
•	index.html: The main HTML file that loads React, ReactDOM, and Babel for JSX support
•	styles.css: CSS styles for the form and its components
•	app.js: Contains the React components for the dynamic form builder
2. Components
•	App: The main component that defines a sample form schema and handles form submission
•	DynamicForm: The reusable component that takes a schema and renders a dynamic form
3. Features Implemented
Field Support
The DynamicForm component supports all required field types:
•	Text input (type: "text")
•	Email input (type: "email")
•	Number input (type: "number")
•	Checkbox (type: "checkbox")
•	Radio buttons (type: "radio", with options)
Validation Support
The component implements comprehensive validation:
•	Required fields (required: true)
•	Min/max length for text fields (minLength, maxLength)
•	Min/max value for numbers (min, max)
•	Email format validation for email fields
•	Shows clear error messages for invalid inputs
Default Values
•	The form initializes with default values based on the field type
•	For checkboxes, the default is false
•	For text, email, number, and radio fields, the default is an empty string
Form Submission
•	Validates all inputs on submit
•	Shows error messages for invalid or missing inputs
•	Calls the onSubmit callback with the form data when valid

# How to Test
You can test the application by opening the index.html file in a web browser. The form will be rendered with the example schema defined in the App component. You can:
1.	Fill out the form fields
2.	Test validation by submitting with invalid or missing data
3.	Test localStorage persistence by refreshing the page after entering data
