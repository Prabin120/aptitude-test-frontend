const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL

export const getQuestionDescription = async(slug: string) => {
    const response = await fetch(URL+slug+".html")
    const res = await response.text();
    return res
}
    