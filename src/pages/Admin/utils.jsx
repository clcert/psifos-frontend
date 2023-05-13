export const getPercentage = (frec, total) => {
    let dec = frec/total*100
    if (Math.floor(dec) !== Math.ceil(dec)) {
        dec = dec.toFixed(2)
    }
    return dec.toString() + '%'
}