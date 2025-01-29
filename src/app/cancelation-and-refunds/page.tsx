import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/ui/footer"
import { useAppSelector } from "@/redux/store"
import { useRouter } from "next/router"

export default function CancelationAndRefunds() {
    const user = useAppSelector((state) => state.user)
    const router = useRouter()

    return (
        <div className="container py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Cancelation and Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        If you want to cancel your test or get a refund, please contact us at{" "}
                        <a href="mailto:support@aptitudezone.com">
                            support@aptitudezone.com
                        </a>
                        .
                    </p>
                    <p>
                        Please note that you must cancel your test at least 24 hours before the test
                        date to receive a full refund. If you cancel your test less than 24 hours before
                        the test date, you will not receive a refund.
                    </p>
                    <p>
                        If you purchased a test and want a refund, please contact us within 7 days of
                        your purchase. We will issue a full refund within 3-5 business days.
                    </p>
                    <p>
                        If you have any questions about our cancelation and refund policy, please
                        contact us at{" "}
                        <a href="mailto:support@aptitudezone.com">
                            support@aptitudezone.com
                        </a>
                        .
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={() => router.push("/tests")}>Go Back</Button>
                </CardFooter>
            </Card>
            <br className="my-12" />
            <Card>
                <CardHeader>
                    <CardTitle>Support</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        If you have any questions or need help, please contact us at{" "}
                        <a href="mailto:support@aptitudezone.com">
                            support@aptitudezone.com
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
            <Footer/>
        </div>
    )
}
