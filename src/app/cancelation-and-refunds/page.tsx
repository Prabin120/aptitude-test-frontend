import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CancelationAndRefunds() {
    return (
        <div className="container py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Cancelation and Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        If you want to cancel your test or get a refund, please contact us at{" "}
                        <a href="mailto:prabinsharma120@gmail.com">
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
                        <a href="mailto:prabinsharma120@gmail.com">
                            prabinsharma120@gmail.com
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
            <br className="my-12" />
            <Card>
                <CardHeader>
                    <CardTitle>Support</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        If you have any questions or need help, please contact us at{" "}
                        <a href="mailto:prabinsharma120@gmail.com">
                        prabinsharma120@gmail.com
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
