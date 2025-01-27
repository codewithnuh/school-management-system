export function generateUniqueId() {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    const uniqueId = (timestamp % 1000000) + randomNum
    return uniqueId % 1000000
}
