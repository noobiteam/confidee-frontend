export function formatDate(date: Date): string {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    const hours = date.getHours()
    const minutes = date.getMinutes()

    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    const hoursStr = hours < 10 ? '0' + hours : hours

    return `${day} ${month} ${year}, ${hoursStr}:${minutesStr}`
}
