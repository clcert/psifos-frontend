import {
  preferentialRankingTallyNames,
  firstMajorityTallyNames,
} from "../../constants";

export const getPercentage = (frec, total) => {
  if (total === 0) return "0%";
  let dec = (frec / total) * 100;
  /* if (Math.floor(dec) !== Math.ceil(dec)) {
    dec = dec.toFixed(2);
  } */
  return dec.toFixed(2).toString() + "%";
};

export const getResponseWithoutGroup = (response) => {
  const responseArr = response.split(',')
  if (responseArr.length > 1) {
    return responseArr[0]
  }
  return response
}

export const applyAccent = (word) => {
  let i=0
  let newWord = ''
  while (i<word.length){
    if (word[i]==='´' && i+1<word.length) {
      newWord = newWord + (
        (word[i+1]==='a' && 'á')
        || (word[i+1]==='e' && 'é')
        || (word[i+1]==='i' && 'í')
        || (word[i+1]==='o' && 'ó')
        || (word[i+1]==='u' && 'ú')
        || (word[i] + word[i+1])
      )
      i += 2
    }
    else {
      newWord = newWord + word[i]
      i+=1
    }
  }
  return newWord
}

export const isARankingTally = (tallyType) => {
  return preferentialRankingTallyNames.includes(tallyType)
}

export const isAClosedTally = (tallyType) => {
  return firstMajorityTallyNames.includes(tallyType)
}
