export const deltaTimeOptions = {
    "30": "30 minutos",
    "60": "1 hora",
    "120": "2 horas",
    "240": "4 horas",
    "1440": "1 día",
}

// follows to delta time options configuration
export const parseDateTimeStr = (timeStr, deltaTime) => {
    const dateAndHour = timeStr.split(" ");
    const dateParts = dateAndHour[0].split("-");
    const timeParts = dateAndHour[1].split(":");
    // days
    if (deltaTime === 1440) {
      return `${dateParts[2]}/${dateParts[1]}`
    }
    // hours
    else if (
      deltaTime === 240
      || deltaTime === 120
      || deltaTime === 60
    ) {
      return `${dateParts[2]}/${dateParts[1]} ${timeParts[0]}:${timeParts[1]}`
    }
    // minutes
    return `${dateParts[2]}/${dateParts[1]} ${timeParts[0]}:${timeParts[1]}`
  }