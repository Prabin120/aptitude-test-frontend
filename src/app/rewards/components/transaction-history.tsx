"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Coins, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ICoinTransaction } from "../schema"


export default function TransactionHistory({ transactions }: { transactions: ICoinTransaction[] }) {
  const [filter, setFilter] = useState("all")

  // Sample transaction data
//   const transactions = [
//     {
//       id: "TX123456",
//       date: "2024-04-28",
//       type: "withdrawal",
//       amount: 200,
//       status: "completed",
//       method: "Bank Transfer",
//       description: "Withdrawal to bank account ending in 4321",
//     },
//     {
//       id: "TX123455",
//       date: "2024-04-20",
//       type: "earning",
//       amount: 30,
//       status: "completed",
//       method: "Contribution",
//       description: "Contribution approved: Advanced Sorting Algorithm",
//     },
//     {
//       id: "TX123454",
//       date: "2024-04-15",
//       type: "withdrawal",
//       amount: 500,
//       status: "completed",
//       method: "Digital Wallet",
//       description: "Withdrawal to wallet account",
//     },
//     {
//       id: "TX123453",
//       date: "2024-04-10",
//       type: "earning",
//       amount: 30,
//       status: "completed",
//       method: "Contribution",
//       description: "Contribution approved: Binary Search Tree Implementation",
//     },
//     {
//       id: "TX123452",
//       date: "2024-04-05",
//       type: "earning",
//       amount: 30,
//       status: "completed",
//       method: "Contribution",
//       description: "Contribution approved: Dynamic Programming Challenge",
//     },
//     {
//       id: "TX123451",
//       date: "2024-04-01",
//       type: "withdrawal",
//       amount: 500,
//       status: "completed",
//       method: "Credit Card",
//       description: "Withdrawal to card ending in 8765",
//     },
//   ]

  // Filter transactions based on selected filter and search term
//   const filteredTransactions = transactions.filter((transaction) => {
//     const matchesFilter = filter === "all" || transaction.type === filter
//     const matchesSearch =
//       transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       transaction._id.toLowerCase().includes(searchTerm.toLowerCase())
//     return matchesFilter && matchesSearch
//   })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <CardDescription>View all your earnings and withdrawals</CardDescription>
          </div>
          {/* <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button> */}
          <div className="w-40">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="earning">Earnings</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                className="pl-8 bg-gray-800 border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}
            <div className="flex gap-2">
              
              {/* <div className="w-40">
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Last 30 days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>

          <div className="rounded-md border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-800/50">
                <TableRow className="hover:bg-gray-800/70 border-gray-800">
                  <TableHead className="text-gray-400">Transaction ID</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Description</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id} className="hover:bg-gray-800/30 border-gray-800">
                      <TableCell className="font-mono text-xs">{transaction._id}</TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === "earning" ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-purple-500 mr-1" />
                          )}
                          <div className="flex items-center">
                            <Coins className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className={transaction.type === "earning" ? "text-green-500" : "text-purple-500"}>
                              {transaction.type === "earning" ? "+" : "-"}
                              {transaction.amount}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              transaction.status === "completed"
                                ? "border-green-800 text-green-500 bg-green-900/20"
                                : transaction.status === "pending"
                                  ? "border-yellow-800 text-yellow-500 bg-yellow-900/20"
                                  : "border-red-800 text-red-500 bg-red-900/20"
                            }
                          `}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <div>
              Showing {transactions.length} of {transactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
