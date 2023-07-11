function logout() {
  localStorage.removeItem("token");
  window.location.href = "/psifos/admin/login";
}

/**
 *
 * Returns a normalized string with NFD
 *
 * @param {string} phrase phrase to normalize
 * @returns string normalized
 */
function normalizedLowerCase(phrase) {
  const phraseLowerCase = phrase.toLowerCase();
  const phraseNormalized = phraseLowerCase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return phraseNormalized;
}

export { logout, normalizedLowerCase };
