function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "/admin/login";
}

export default logout;
