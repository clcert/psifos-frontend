export const getPercentage = (frec, total) => {
  if (total === 0) return "0%";
  let dec = (frec / total) * 100;
  if (Math.floor(dec) !== Math.ceil(dec)) {
    dec = dec.toFixed(2);
  }
  return dec.toString() + "%";
};

export const getResponseWithoutGroup = (response) => {
  const responseArr = response.split(',')
  if (responseArr.length > 1) {
    return responseArr[0]
  }
  return response
}
