export interface TestCard {
    slug: string
    title: string
    startDateTime: Date
    endDateTime: Date
    duration: number
    description: string
    type: "exam" | "practice"
    amount:number
    _id: string
    registered?: boolean
    attempted?: boolean
}