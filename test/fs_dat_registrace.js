// IMPORT Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhifLMHm4fQojO_tOxb5RedJ9d7BNcz4s",
  authDomain: "darky-b41bf.firebaseapp.com",
  projectId: "darky-b41bf",
  storageBucket: "darky-b41bf.firebasestorage.app",
  messagingSenderId: "513485540196",
  appId: "1:513485540196:web:08210b1691f30025d54871",
  measurementId: "G-27C5BJ6DHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Function to register a new user
export async function createUserInFirestore(email, password, displayName) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: displayName,
        createdAt: new Date(),
      });
  
      return user;  // Return the user object (if needed)
    } catch (error) {
      console.error("Error during registration:", error);
      throw new Error(error.message);  // Throw the error to be handled by the calling function
    }
  }

//prihlaseni
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Firebase authentication - sign in with email and password
        await signInWithEmailAndPassword(auth, email, password);
        
        // Redirect the user to the dashboard (or another page) after successful login
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Change to the appropriate URL
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        // Display error message
        alert(`Login failed: ${errorMessage}`);
    }
});
