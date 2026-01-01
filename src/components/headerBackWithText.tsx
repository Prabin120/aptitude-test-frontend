import { ArrowLeft } from "lucide-react"
import Link from "next/link"


export const HeaderBackWithText = ({ text, href }: { text: string | undefined, href: string }) => {
    return (
        <div className="sticky top-0 bg-neutral-950 z-50 flex justify-between items-center my-5">
            <div className="flex items-center space-x-5">
                <Link className="flex items-center space-x-1 text-primary hover:text-primary/80" href={href}>
                    <ArrowLeft className="h-5 w-5" /> <span className="">Back</span>
                </Link>
                <h1 className="text-2xl font-bold">{text}</h1>
            </div>
        </div>
    )
}