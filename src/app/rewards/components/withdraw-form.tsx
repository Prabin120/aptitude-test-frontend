"use client"

import { useState } from "react"
import { AlertCircle, Check, CreditCard, Landmark, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WithdrawForm() {
  const [amount, setAmount] = useState("100")
  const [method, setMethod] = useState("bank")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleWithdraw = () => {
    // Reset states
    setError("")
    setSuccess(false)

    // Validate amount
    const numAmount = Number.parseInt(amount)
    if (isNaN(numAmount) || numAmount < 100) {
      setError("Minimum withdrawal amount is 100 coins")
      return
    }

    if (numAmount > 210) {
      setError("Insufficient balance")
      return
    }

    // Show success message
    setSuccess(true)
  }

  return (
    <Card className=" h-full">
      <CardHeader>
        <CardTitle className="text-xl">Withdraw Coins</CardTitle>
        <CardDescription>Minimum withdrawal: 100 coins</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-900/20 border-green-900 text-green-400">
            <Check className="h-4 w-4" />
            <AlertDescription>Withdrawal request submitted successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (in coins)</Label>
          <Input
            id="amount"
            type="number"
            min="100"
            max="210"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
          <p className="text-xs text-gray-400">Available balance: 210 coins</p>
        </div>

        <div className="space-y-2">
          <Label>Withdrawal Method</Label>
          <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center cursor-pointer">
                <Landmark className="h-4 w-4 mr-2 text-blue-400" />
                Bank Transfer
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center cursor-pointer">
                <CreditCard className="h-4 w-4 mr-2 text-purple-400" />
                Credit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800/50">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                <Wallet className="h-4 w-4 mr-2 text-green-400" />
                Digital Wallet
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button" variant={"secondary"} onClick={handleWithdraw} className="w-full ">
          It will be available soon
        </Button>
      </CardFooter>
    </Card>
  )
}
