export interface ICoinTransaction {
    _id: string;
    username: string;
    amount: number;
    status: string;
    type: "withdrawal" | "earning";
    description: string;
    createdAt: Date;
}

export interface IHistory {
    transactions: ICoinTransaction[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ICoin {
    username: string;
    balance: number;
    lifetimeEarnings: number;
    totalWithdraw: number;
}

// interface IRewardDashboard {
//     coins: ICoin;
//     transactions: ICoinTransaction[];
// }