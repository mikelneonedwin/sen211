import { saveStudent } from "./firebase";

window.addEventListener("load", () => {
  lucide.createIcons();

  /** @type {HTMLFormElement} */
  const form = document["auth-form"];
  form.onsubmit = async (e) => {
    e.preventDefault();
    const regNumberPattern = /^\d{2}\/[A-Za-z]{2}\/[A-Za-z]{2}\/\d{3,4}$/;
    const regNo = form["reg"].value;
    if (!regNumberPattern.test(regNo)) {
      return toast("Invalid registration number");
    }
    try {
      disableFields();
      await saveStudent({
        regNo,
        firstName: form["first-name"].value,
        lastName: form["last-name"].value,
        middleName: form["middle-name"].value,
      });
      location.href = "/frontend/";
    } catch (err) {
      toast(err instanceof Error ? err.message : "An unknown error occured");
      enableFields();
    }
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
