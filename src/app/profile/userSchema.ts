interface IUser{
    name: string
    email: string
    mobile: string
    institute?: string
    avatarUrl?: string
}

interface TestAttempt {
    id: number
    score: number
    rank: number
    date: string
  }

export type { IUser, TestAttempt }