// @ts-ignore
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
}
    // @ts-ignore
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
// @ts-ignore
import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
// @ts-ignore
import cookies from "https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm";

function handleError(error) {

    let text;

    if (error instanceof Error) {
        text = error.message;
    }
    else if (typeof error === "string") {
        text = error;
    }

    else return "Unknown error occured!";

    const message = text
        .replace(/(^firebase:\s(error\s)?|\(auth\/)|\)\.$/ig, "")
        .replace(/-/g, " ");
    const errorMessage = message[0].toUpperCase() + message.slice(1);
    throw new Error(errorMessage);
}

const firebaseConfig = {
    apiKey: "AIzaSyBCvaIdfHGFJC2nkLh1HGKAXAxcKnL8ePI",
    authDomain: "sen211-project.firebaseapp.com",
    projectId: "sen211-project",
    storageBucket: "sen211-project.firebasestorage.app",
    messagingSenderId: "1026780756728",
    appId: "1:1026780756728:web:36e48c435d11cab157990d",
    measurementId: "G-TV17E0KFXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user) cookies.set("user-id", user.uid);
})


/**
 * Create a new account for the user, using their email and password
 * @param {string} email User's email
 * @param {string} password User's Password
 */
export async function signUp(email, password) {
    await createUserWithEmailAndPassword(auth, email, password)
        .catch(handleError)
        .then((result) => {
            cookies.set("user-id", result.user.uid);
            // return result.user;
        })
    return;
}


/**
 * Login to an existing user account, using their email and password
 * @param {string} email User's email
 * @param {string} password User's Password
*/
export async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
        .catch(handleError)
        .then((result) => {
            cookies.set("user-id", result.user.uid);
            // return result.user;
        })
    return;
}

/**
 * Redirect user to sign in with their Google account
*/
export async function googleSignUp() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider)
        .catch(handleError);
    cookies.set("user-id", result.user.uid)
    return;
}

/**
 * Save the user's result to the database
 * @typedef {object} Result
 * @property {number} questionsAttempted
 * @property {number} correctAnswers
 * @property {string} course
 * / 

/**
 * @param {Result} result 
 */
export async function uploadResult(result) {
    const ref = collection(db, "results");
    await addDoc(ref, {
        ...result,
        time: serverTimestamp(),
        uid: cookies.get("user-id")
    })
        .catch(handleError);
    return;
}

/**
 * Get a list of the current user's results from the database
 * @returns {Promise<Result[]>}
*/
export async function getUserResults() {
    try {
        const id = cookies.get("user-id");
        const ref = collection(db, "results");
        const q = query(ref, where("uid", "==", id));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
        handleError(error);
    }
}