// Main App Component
const App = () => {
  // Example schema for the form
  const formSchema = {
    fields: [
      {
        name: "username",
        type: "text",
        required: true,
        minLength: 3,
        label: "Username"
      },
      {
        name: "email",
        type: "email",
        required: true,
        label: "Email Address"
      },
      {
        name: "age",
        type: "number",
        min: 18,
        max: 60,
        label: "Age"
      },
      {
        name: "gender",
        type: "radio",
        options: ["Male", "Female", "Other"],
        label: "Gender"
      },
      {
        name: "terms",
        type: "checkbox",
      }
    ]
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted with data:", formData);
    alert("Form submitted successfully!\n\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="container">
      <h1>Dynamic Form Builder</h1>
      <DynamicForm 
        schema={formSchema} 
        onSubmit={handleFormSubmit}
        useLocalStorage={true}
      />
    </div>
  );
};

// DynamicForm Component
const DynamicForm = ({ schema, onSubmit, useLocalStorage = false }) => {
  const STORAGE_KEY = "dynamic_form_data";
  
  // Initialize form state from localStorage or empty object
  const getInitialState = () => {
    if (useLocalStorage) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error("Error parsing saved form data:", e);
        }
      }
    }
    
    // Create default state from schema
    return schema.fields.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.name] = false;
      } else if (field.type === "radio" && field.options && field.options.length > 0) {
        acc[field.name] = "";
      } else {
        acc[field.name] = "";
      }
      return acc;
    }, {});
  };

  const [formData, setFormData] = React.useState(getInitialState);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  // Save to localStorage when form data changes
  React.useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, useLocalStorage]);

  const validateField = (field, value) => {
    if (field.required && (value === "" || value === null || value === undefined)) {
      return `${field.label || field.name} is required`;
    }

    if (field.type === "text" || field.type === "email") {
      if (field.minLength && value.length < field.minLength) {
        return `${field.label || field.name} must be at least ${field.minLength} characters`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `${field.label || field.name} must be less than ${field.maxLength} characters`;
      }
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.type === "number" && value !== "") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return "Please enter a valid number";
      }
      if (field.min !== undefined && numValue < field.min) {
        return `Value must be at least ${field.min}`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `Value must be less than or equal to ${field.max}`;
      }
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    schema.fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      const field = schema.fields.find(f => f.name === name);
      const error = validateField(field, newValue);
      
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const field = schema.fields.find(f => f.name === name);
    const error = validateField(field, formData[name]);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = schema.fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const { name, type, label = name, options } = field;
    const error = errors[name];
    const isInvalid = !!error && touched[name];

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <div className="form-group" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={isInvalid ? "invalid-field" : ""}
              min={type === "number" ? field.min : undefined}
              max={type === "number" ? field.max : undefined}
            />
            {isInvalid && <div className="error-message">{error}</div>}
          </div>
        );
      
      case "checkbox":
        return (
          <div className="form-group" key={name}>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={formData[name] || false}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor={name}>{label}</label>
            </div>
            {isInvalid && <div className="error-message">{error}</div>}
          </div>
        );
      
      case "radio":
        return (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <div className="radio-group">
              {options.map((option) => (
                <div className="radio-option" key={`${name}-${option}`}>
                  <input
                    type="radio"
                    id={`${name}-${option}`}
                    name={name}
                    value={option}
                    checked={formData[name] === option}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label htmlFor={`${name}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            {isInvalid && <div className="error-message">{error}</div>}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {schema.fields.map(renderField)}
      <button type="submit">Submit</button>
    </form>
  );
};

// Render the App
ReactDOM.render(<App />, document.getElementById('root'));