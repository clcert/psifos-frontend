import { gradientPalettes } from "./colors";

export const isOpenLoginElection = (loginType) => loginType === "Open"

export const isSemiPublicLoginElection = (loginType) => loginType === "Semi Public"

export const isSettingUpElection = (status) => status === "Setting up"

export const isStartedElection = (status) => status === "Started"

export const isMixNetQuestion = (q) => q === "MIXNET";

export const isClosedQuestion = (q) => q === "CLOSED";

export const isSTVQuestion = (q) => q === "STVNC";

export const usesMixNetTally = (q) => isMixNetQuestion(q) || isSTVQuestion(q);

export const getBlankAnswerId = (closedOpt) => closedOpt.length;

export const getNullAnswerId = (closedOpt) => closedOpt.length + 1;

export const matchingStrings = (string1, string2) => {
    return string1.includes(string2) ||
    string2.includes(string1)
}

export const getGradientPalette = (numberOfColors) => {
    const availableNumberOfColors = Object.keys(gradientPalettes)
    if (availableNumberOfColors.includes(String(numberOfColors))){
        return gradientPalettes[numberOfColors]
    }
    return undefined
}

export const roundNumber = (originalNum, round) => {
    const splitedNum = originalNum.toString().split('.')
    if (splitedNum.length>1 && splitedNum[1]>round){
        return originalNum.toFixed(round)
    }
    return originalNum
}

export const sumIntoArray = (arr) => arr.reduce((acc, num) => {
    return num + acc
  }, 0)

export const filterObj = (obj, filterFunction) => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([key, value]) => filterFunction(key, value)
      )
    )
  }