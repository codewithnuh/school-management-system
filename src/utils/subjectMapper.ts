// utils/subjectMapper.ts
export const subjectToIdMap = new Map<string, number>([
    ['Maths', 1],
    ['Physics', 2],
    ['Chemistry', 3],
    ['English', 4],
    ['Urdu', 5],
    ['Computer Science', 6],
    ['Pakistan Study', 7],
])

export function getSubjectId(subjectName: string): number {
    const subjectId = subjectToIdMap.get(subjectName)
    if (!subjectId) throw new Error(`Subject not found: ${subjectName}`)
    return subjectId
}
