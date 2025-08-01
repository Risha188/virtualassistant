import axios from "axios"

const geminiResponse = async (command,assistantName,userName) => {
    try {
        const apiUrl = process.env.GEMINI_API_URL
        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
        You are not google. You will now behave like a voice-enabled assistant.
        Your task is to understand the user's natural language input and respond with a JSON object like this:
        
        {
          "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
          "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",

          "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search ker ne ko bola hai to userInput me only bo search baala text jaye,

          "response": "<a short spoken response to read out loud to the user>"
        }
          
        Instructions:
        - "type": determine the intent of the user.
        - "userinput": original sentence the user spoke.
        - "response": a short voice-friendly reply, e.g,"Sure, playing it now", "Here's what I found","Today is teusday", etc

        Type meanings:
        - "general": if it's a factual or informal question,aur agar koi aisa question puchta hai jiska answer tumhe pata hai usko bhi general ki category me rakho bas short answer dena
        - "google_search": if user wants to search something on google.
        - "youtube_search": if user wants to search something on youtube.
        - "youtube_play": if user wants to directly play a video or song on youtube.
        - "calculator_open": if user wants to open a calculator.
        - "instagram_open": if user wants to open instagram.
        - "facebook_open": if user wants to open facebook.
        - "weather_show": if user wants to know weather.
        - "get_time": if user asks for current time.
        - "get_date": if user asks for today's date.
        - "get_day": if user asks what day it is.
        - "get_month": if user asks for the current month.

        Important:
        - Use ${userName} ager koi puche tume kisne banaya
        - Only respond with the JSON object, nothing else.


        now your userInput- ${command}
        `;

        const result = await axios.post(apiUrl,{
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        })
        return result.data.candidates[0].content.parts[0].text
    } catch(error) {
        console.log(error)
    }
}

export default geminiResponse