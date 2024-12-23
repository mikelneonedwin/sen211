import { googleSignUp } from "./lib/firebase.js"; // Ensure the correct path and file extension

document.getElementById("googleSignUpButton").addEventListener("click", () => {
  console.log("hey");
  googleSignUp().catch((error) => console.error(error));
});
