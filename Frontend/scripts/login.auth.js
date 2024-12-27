import { googleAuth, login } from "./firebase.js";

window.addEventListener("load", () => {
  lucide.createIcons();

  /** @type {HTMLButtonElement} */
  const googleBtn = document.querySelector("#google-auth");
  googleBtn.onclick = async () => {
    disableFields();
    try {
      await googleAuth();
      location.href = "/frontend/auth.html";
    } catch (err) {
      toast(err instanceof Error ? err.message : "An unknown error occured!");
      enableFields();
    }
  };

  /** @type {HTMLFormElement} */
  const loginForm = document["login-form"];
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    disableFields();
    try {
      await login(loginForm.email.value, loginForm.password.value);
      location.href = "/frontend/auth.html";
    } catch (err) {
      enableFields();
      toast(err instanceof Error ? err.message : "An unknown error occured!");
    }
  };

  // reveal password
  document.querySelector("[data-lucide=eye]").onclick = (e) => {
    loginForm.password.type = "text";
    e.currentTarget.classList.add("!hidden");
    e.currentTarget.nextElementSibling.classList.remove("!hidden");
  };

  // hide password
  document.querySelector("[data-lucide=eye-off]").onclick = (e) => {
    loginForm.password.type = "password";
    e.currentTarget.classList.add("!hidden");
    e.currentTarget.previousElementSibling.classList.remove("!hidden");
  };
});

function disableFields() {
  document.querySelectorAll("fieldset, button").forEach((element) => {
    element.disabled = true;
  });
}

function enableFields() {
  document.querySelectorAll("fieldset, button").forEach((element) => {
    element.disabled = false;
  });
}

/** @type {string} */
function toast(msg) {
  return vanillaToast.show(msg, {
    duration: 2500,
    fadeDuration: 500,
    className: "auth",
  });
}
