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

export const getWeightsObject = (votersByWeight) => {
    return votersByWeight && {
      '1': votersByWeight['8.0'] || 0,
      '1/2': votersByWeight['4.0'] || 0,
      '1/8': votersByWeight['1.0'] || 0,
    }
  }
