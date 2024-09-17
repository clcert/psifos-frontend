export function answersRestrictionText(
  min_answers, max_answers, init="seleccionar"
) {
    let textAux = init + " ";
    if (min_answers === max_answers) {
      if (min_answers === "1") {
        textAux = textAux + min_answers + " opción";
      } else {
        textAux = textAux + min_answers + " opciones";
      }
    } else {
      textAux =
        textAux +
        "entre " +
        min_answers +
        " y " +
        max_answers +
        " opciones";
    }
    return textAux;
}
