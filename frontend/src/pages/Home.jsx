import React,{useEffect,useRef,useState} from 'react'
import {useContext} from 'react'
import {userDataContext} from '../context/UserContext'
import {useNavigate} from 'react-router-dom'
import {CgMenuRight} from "react-icons/cg";
import {RxCross1} from "react-icons/rx";
import axios from 'axios'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'

function Home() {

    const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext)
    const navigate = useNavigate()
    const [listening,setListening] = useState(false)
    const [userText,setUserText] = useState("")
    const [aiText,setAiText] = useState("")
    const isSpeakingRef = useRef(false)
    const isRecognizingRef = useRef(false)
    const [cross,setCross] = useState(false)
    const recognitionRef = useRef(null)
    const synth = window.speechSynthesis

    const handleLoGoUT = async (req,res) => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`,
                {withCredentials: true}
            )
            setUserData(null)
            navigate("/signup")
        } catch(error) {
            setUserData(null)
            console.log(error)
        }
    }

    const startRecognition = () => {
        if(!isSpeakingRef.current && !isRecognizingRef.current) {
            try {
                recognitionRef.current?.start()
            } catch(error) {
                if(error.name !== "InvalidStateError") {
                    console.error("Start error: ",error)
                }
            }
        }
    }

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'hi-IN'
        const voices = window.speechSynthesis.getVoices()
        const hindiVoice = voices.find(v => v.lang === 'hi-IN')
        if(hindiVoice) {
            utterance.voice = hindiVoice
        }

        isSpeakingRef.current = true
        utterance.onend = () => {
            setAiText("")
            isSpeakingRef.current = false
            setTimeout(() => {
                startRecognition()
            },800)
        }
        synth.cancel()
        synth.speak(utterance)
    }

    const handleCommand = (data) => {
        const {type,userInput,response} = data
        speak(response);

        if(type == 'google_search') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.google.com/search?q=${query}`,'_blank');
        }

        if(type == 'youtube_search' || type == 'youtube_play') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
        }

        if(type == 'calculator_open') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.google.com/search?q=calculator`,'_blank');
        }

        if(type == 'instagram_open') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.instagram.com/`,'_blank');
        }

        if(type == 'facebook_open') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.facebook.com/`,'_blank');
        }

        if(type == 'weather_show') {
            const query = encodeURIComponent(userInput)
            window.open(`https://www.google.com/search?q=weather`,'_blank');
        }
    }

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognitionRef.current = recognition

        let isMounted = true;

        const startTimeout = setTimeout(() => {
            if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
                try {
                    recognition.start()
                } catch(e) {
                    if(e.name !== "InvalidStateError") {
                        console.error(e)
                    }
                }
            }
        },1000)


        recognition.onstart = () => {
            isRecognizingRef.current = true
            setListening(true)
        };

        recognition.onend = () => {
            isRecognizingRef.current = false
            setListening(false)

            if(isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if(isMounted) {
                        try {
                            recognition.start()
                        } catch(e) {
                            if(e.name !== "InvalidStateError") {
                                console.error(e)
                            }
                        }
                    }
                },1000)
            }
        };

        recognition.onerror = (event) => {
            console.warn("Recognition error: ",event.error)
            isRecognizingRef.current = false
            setListening(false)
            if(event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
                setTimeout(() => {
                    if(isMounted) {
                        try {
                            recognition.start()
                        } catch(e) {
                            if(e.name !== "InvalidStateError") {
                                console.error(e)
                            }
                        }
                    }
                },1000);
            }
        };

        recognition.onresult = async (e) => {
            const transcript = e.results[e.results.length - 1][0].transcript.trim()
            console.log("heard: " + transcript)
            if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
                setAiText("")
                setUserText(transcript)
                recognition.stop()
                isRecognizingRef.current = false
                setListening(false)
                const data = await getGeminiResponse(transcript)
                handleCommand(data)
                setAiText(data.response)
                setUserText("")
            }
        };

        const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what I can help you with?`);
        greeting.lang = 'hi-IN'

        window.speechSynthesis.speak(greeting)


        return () => {
            isMounted = false;
            clearTimeout(startTimeout);
            recognition.stop();
            setListening(false);
            isRecognizingRef.current = false;
        };
    },[]);

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#04045d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
            <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] h-[25px] w-[25px] cursor-pointer' onClick={() => setCross(true)} />
            <div className={`absolute h-full w-full top-0 bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col lg:hidden gap-[20px] items-start transition-transform ${cross ? "translate-x-0" : "translate-x-full"}`}>
                <RxCross1 className=' text-white absolute top-[20px] right-[20px] h-[25px] w-[25px] cursor-pointer' onClick={() => setCross(false)} />
                <button className='min-w-[90px] h-[40px] bg-white rounded-full text-black font-semibold text-center text-[16px] cursor-pointer' onClick={handleLoGoUT}>Log Out</button>

                <button className='min-w-[100px] h-[45px] bg-white rounded-full text-black font-semibold text-[16px] cursor-pointer px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Your Assistant</button>
                <div className='w-full h-[2px] bg-gray-400'></div>
                <h1 className='text-white text-[18px] font-semibold'>History</h1>
                <div className=' scroll w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col '>
                    {userData.history?.map((his) => (
                        <span className='text-gray-200 text-[18px]'>{his}</span>
                    ))}
                </div>
            </div>
            <button className='lg:min-w-[120px] min-w-[90px] h-[40px] mt-[30px] bg-white rounded-full text-black hidden lg:block font-semibold text-center lg:text-[18px] text-[16px] absolute lg:top-[20px] top-[5px] right-[20px] cursor-pointer' onClick={handleLoGoUT}>Log Out</button>

            <button className='lg:min-w-[120px] min-w-[100px] h-[50px] mt-[30px] bg-white rounded-full text-black font-semibold hidden lg:block lg:text-[18px] text-[16px] absolute lg:top-[90px] top-[60px] right-[20px]  cursor-pointer px-[20px] py-[10px]' onClick={() => navigate("/customize")}>Customize Your Assistant</button>

            <div className='lg:w-[300px] w-[160px] lg:h-[390px] h-[260px] flex justify-center items-center overflow-hidden rounded-4xl shadow-4xl'>
                <img src={userData?.assistantImg} alt='' className='h-full object-cover' />
            </div>
            <h1 className='text-blue-200 text-[25px]'>Hi! I'm {userData?.assistantName}</h1>
            {!aiText && <img src={userImg} alt='' className="w-[200px]" />}
            {aiText && <img src={aiImg} alt='' className="w-[200px]" />}
            <h1 className="text-white text-[18px] font-semibold text-wrap">{userText ? userText : aiText ? aiText : null}</h1>
        </div>
    )
}

export default Home