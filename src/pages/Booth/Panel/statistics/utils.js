import { sumIntoArray } from "../../../../utils"

export const ROLL_GROUP = "Padrón"

export const getDataPerGroup = (votersByWeightPerGroup) => votersByWeightPerGroup.reduce((acc, data) => {
    const votersInGroup = sumIntoArray(Object.values(data.weights))
    const weightsInGroup = data.weights
  
    acc[ROLL_GROUP].voters += votersInGroup
    acc[ROLL_GROUP].weights["1.0"] += weightsInGroup["1.0"] || 0
    acc[ROLL_GROUP].weights["4.0"] += weightsInGroup["4.0"] || 0
    acc[ROLL_GROUP].weights["8.0"] += weightsInGroup["8.0"] || 0
  
    return {
        ...acc,
        [data.group]: {
            voters: votersInGroup,
            weights: weightsInGroup,
        },
    }
  }, {
    [ROLL_GROUP]: {
        voters: 0,
        weights: {
            "1.0": 0,
            "4.0": 0,
            "8.0": 0,
        },
    }
  })
