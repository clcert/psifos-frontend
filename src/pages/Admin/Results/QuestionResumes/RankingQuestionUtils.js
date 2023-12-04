const palettePerNumOfCandidates = {
    2: ["#0E4B90", "#00C2FF"],
    3: ["#0E4B90", "#0787C8", "#00C2FF"],
    4: ["#0E4B90", "#0973B5", "#059ADA", "#00C2FF"],
    5: ["#0E4B90", "#0B69AC", "#0787C8", "#04A4E3", "#00C2FF"],
    6: ["#0E4B90", "#0B63A6", "#087BBC", "#0692D3", "#03AAE9", "#00C2FF"],
    7: ["#0E4B90", "#0C5FA3", "#0973B5", "#0787C8", "#059ADA", "#02AEED", "#00C2FF"],
    8: ["#0E4B90", "#0C5CA0", "#0A6DB0", "#087EC0", "#068FCF", "#04A0DF", "#02B1EF", "#00C2FF"],
}

const getPalette = (numOfCandidates) => {
    return palettePerNumOfCandidates[numOfCandidates]
}

export const getNodeName = (candidate, roundId) => {
    return `${candidate}-round${roundId}`
}

export const getStopNodeName = (roundId) => {
    return getNodeName("stop", roundId)
}

export const getCandidateFromName = (name) => {
    return name.split('-')[0]
}

const getNodeObject = (nodeName, color) => {
    return { 
        name: nodeName,
        itemStyle: {
            color: color,
        }
    }
}

export const getNodeObjectList = (nodeNameList, numOfCandidates) => {
    const palette = getPalette(numOfCandidates)
    return nodeNameList.reduce((acc, name) => {
        const candidate = getCandidateFromName(name)
        return [
            ...acc,
            getNodeObject(name, palette[parseInt(candidate, 10)])
        ]
    }, [])
}

export const isElected = (status) => {
    return status === "Elected"
}

export const isRejected = (status) => {
    return status === "Rejected"
}

export const isHopeful = (status) => {
    return status === "Hopeful"
}

export const isOutOfRace = (status) => {
    return isElected(status) || isRejected(status)
}

export const createEdgeData = (source, target, value) => {
    return { source, target, value }
}