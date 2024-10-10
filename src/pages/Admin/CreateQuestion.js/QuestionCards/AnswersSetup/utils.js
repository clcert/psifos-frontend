export const isInformalAns = (ans) => (
    ans !== "Voto Blanco" &&
    ans !== "Voto Nulo"
)
  
export const generateClosedOptionsString = (closed_options) => {
    let auxString = "";
    closed_options.forEach((answer) => {
        auxString = auxString.concat(answer).concat("\n");
    });
    return auxString;
}