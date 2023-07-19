export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/psifos/admin/login";
}

export function translateStep(step) {
  if (step === "Setting up") {
    return "En configuración";
  } else if (step === "Started") {
    return "Iniciada";
  } else if (step === "Ended") {
    return "Finalizada";
  } else if (step === "Tally computed") {
    return "Tally computado";
  } else if (step === "Decryptions uploaded") {
    return "Desencriptaciones subidas";
  } else if (step === "Decryptions combined") {
    return "Desencriptaciones combinadas";
  } else if (step === "Results released") {
    return "Resultados liberados";
  }
}

/**
 *
 * Returns a normalized string with NFD
 *
 * @param {string} phrase phrase to normalize
 * @returns string normalized
 */
export function normalizedLowerCase(phrase) {
  const phraseLowerCase = phrase.toLowerCase();
  const phraseNormalized = phraseLowerCase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return phraseNormalized;
}

export const singularOrPlural = (singular, plural, count) => {
  if (count === 1) { return singular }
  if (Boolean(plural)) { return plural }
  return `${singular}s`
}
