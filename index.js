function checkLogin(targetRoute) {
  const userId = localStorage.getItem("user-id");
  if (!userId) {
    window.location.href = "./auth/login.html";
  } else {
    window.location.href = targetRoute;
  }
}
