// registrace_firebase.js
import { createUserInFirestore } from './fs_dat_registrace.js';

// Get form and inputs
const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const displayNameInput = document.getElementById('displayName');

// Form submission handler
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Get form values
  const email = emailInput.value;
  const password = passwordInput.value;
  const displayName = displayNameInput.value;

  try {
    // Register user using email and password
    await createUserInFirestore(email, password, displayName);

    // Clear the form after successful registration
    registerForm.reset();

    // Optionally, redirect the user to a login page or dashboard
    alert("Registration successful!");
    // window.location.href = "login.html"; // Uncomment this to redirect after registration
  } catch (error) {
    alert("Error: " + error.message);
  }
});
