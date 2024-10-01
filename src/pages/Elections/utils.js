export const getFormalOptions = (
    array, includesInformal
) => includesInformal ? array.slice(0, -2) : array;