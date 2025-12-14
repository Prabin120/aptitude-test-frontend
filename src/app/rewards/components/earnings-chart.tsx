"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EarningsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data for the chart
    const data = [30, 60, 90, 30, 60, 120, 90, 30, 60, 30, 90, 60]
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const maxValue = Math.max(...data) * 1.2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length; i++) {
      const x = padding + (chartWidth / data.length) * i
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
    }

    ctx.stroke()

    // Draw axes labels
    ctx.fillStyle = "#999"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // X-axis labels
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (chartWidth / data.length) * (i + 0.5)
      ctx.fillText(labels[i], x, canvas.height - padding / 2)
    }

    // Y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * (4 - i)
      ctx.fillText(((maxValue / 4) * i).toFixed(0), padding - 10, y + 4)
    }

    // Draw data line
    ctx.beginPath()
    ctx.strokeStyle = "hsl(48, 81%, 56%)" // Primary Yellow
    ctx.lineWidth = 3

    // Create gradient for area under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    gradient.addColorStop(0, "hsla(48, 81%, 56%, 0.3)")
    gradient.addColorStop(1, "hsla(48, 81%, 56%, 0)")

    // Draw line
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / data.length) * (i + 0.5)
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + (chartWidth / data.length) * (data.length - 0.5), padding + chartHeight)
    ctx.lineTo(padding + (chartWidth / data.length) * 0.5, padding + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data points
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / data.length) * (i + 0.5)
      const y = padding + chartHeight - (data[i] / maxValue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "hsl(48, 81%, 56%)" // Primary Yellow
      ctx.fill()
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Earnings Overview</CardTitle>
            <CardDescription>Track your earnings over time</CardDescription>
          </div>
          <Select defaultValue="year">
            <SelectTrigger className="w-36 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="pt-4">
              <div className="w-full h-64 relative">
                <canvas ref={canvasRef} className="w-full h-full"></canvas>
              </div>
            </TabsContent>
            <TabsContent value="stats" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Total Earnings</div>
                  <div className="text-2xl font-bold mt-1">1,450 coins</div>
                  <div className="text-xs text-green-500 mt-1">+120 from last month</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Average per Month</div>
                  <div className="text-2xl font-bold mt-1">120 coins</div>
                  <div className="text-xs text-green-500 mt-1">+20 from last month</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Best Month</div>
                  <div className="text-2xl font-bold mt-1">210 coins</div>
                  <div className="text-xs text-gray-400 mt-1">June 2024</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Contributions</div>
                  <div className="text-2xl font-bold mt-1">48 total</div>
                  <div className="text-xs text-green-500 mt-1">4 this month</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
