import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[90vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Thank You!</CardTitle>
            <CardDescription className="text-center">
              Your test has been successfully submitted.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500" />
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href={"/"}>
            <Button >
              Go to Home
            </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}