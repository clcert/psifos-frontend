export const deltaTimeOptions = {
    "1": "1 minuto",
    "30": "30 minutos",
    "60": "1 hora",
    "120": "2 horas",
    "240": "4 horas",
    "1440": "1 día",
}

// follows to delta time options configuration
export const parseDateTimeStr = (timeStr, deltaTime) => {
    const dateAndHour = timeStr.split(" ")
    // days
    if (deltaTime === 1440) {
      const dateParts = dateAndHour[0].split("-")
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    }
    // hours
    else if (
      deltaTime === 240
      || deltaTime === 120
      || deltaTime === 60
    ) {
      return `${dateAndHour[1].split(":")[0]} hrs`
    }
    // minutes
    const timeParts = dateAndHour[1].split(":")
    return `${timeParts[0]}:${timeParts[1]} hrs`
  }