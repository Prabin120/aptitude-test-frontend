import { apiEntryPoint, validateTestQuestion } from "@/consts";

interface IQuestion{
    apti: string;
    coding: string
}
const validateQuestion = async(questions: IQuestion)=>{
    try {    
        const response = await fetch(apiEntryPoint + validateTestQuestion,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(questions), // Send form data as JSON
        });
        const res = await response.json()
        return res.valid;
      } catch (err) {
        console.error("Error during login:", err);
        return false;
      }
}

export {validateQuestion}