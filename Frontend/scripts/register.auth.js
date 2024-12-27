import { googleAuth, signUp } from "./firebase.js";

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
  const registerForm = document["register-form"];
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    if (
      registerForm.password.value !== registerForm["confirm-password"].value
    ) {
      return toast("Passwords don't match");
    }
    disableFields();
    try {
      await signUp(registerForm.email.value, registerForm.password.value);
      location.href = "/frontend/auth.html";
    } catch (err) {
      enableFields();
      toast(err instanceof Error ? err.message : "An unknown error occured!");
    }
  };

  // reveal password
  document.querySelectorAll("[data-lucide=eye]").forEach((element) => {
    element.onclick = (e) => {
      e.currentTarget.parentElement.querySelector("input").type = "text";
      e.currentTarget.classList.add("!hidden");
      e.currentTarget.nextElementSibling.classList.remove("!hidden");
    };
  });

  // hide password
  document.querySelectorAll("[data-lucide=eye-off]").forEach((element) => {
    element.onclick = (e) => {
      e.currentTarget.parentElement.querySelector("input").type = "password";
      e.currentTarget.classList.add("!hidden");
      e.currentTarget.previousElementSibling.classList.remove("!hidden");
    };
  });
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
