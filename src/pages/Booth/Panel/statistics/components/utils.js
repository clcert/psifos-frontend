// PEOPLE STATS RELATED
import { ROLL_GROUP } from "../utils"

export const getVotersByGroup = (dataPerGroup) => Object.entries(dataPerGroup).reduce(
    (acc, [group, groupData]) => {
      if (group !== ROLL_GROUP){
        return {
          ...acc, [group]: groupData.voters
        }
      }
    }, {}
  )

export const getGroupNamesObj = (groupsNames) => groupsNames.reduce(
    (acc, groupName, id) => {
      return {
        ...acc, [id+1]: groupName
      }
    }, {}
  )

export const getGendersObject = (votersByGender) => {
    return votersByGender && {
        'Hombre': votersByGender['men'],
        'Mujer': votersByGender['women'],
        'Otro': votersByGender['other'],
    }
  }

function decimalToFraction(decimal) {
  const tolerance = 1.0E-6;
  let numerator = 1;
  let denominator = 1;
  let fraction = 1;

  while (Math.abs(fraction - decimal) > tolerance) {
      if (fraction < decimal) {
          numerator++;
      } else {
          denominator++;
          numerator = Math.round(decimal * denominator);
      }
      fraction = numerator / denominator;
  }
  
  return numerator !== denominator ? `${numerator}/${denominator}` : '1'
}

export const getWeightsObject = (
  votersByWeight, mustNormalize, maxWeight,
) => {
    return Object.keys(votersByWeight).reduce(
      (acc, weight) => {
        const intWeight = parseInt(weight, 10)
        const key = mustNormalize ? decimalToFraction(intWeight/maxWeight) : intWeight
        return {
          ...acc,
          [key]: votersByWeight[weight] || 0
        }
    }, {})
  }
