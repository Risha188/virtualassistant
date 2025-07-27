import React,{useContext,useState} from 'react'
import {userDataContext} from '../context/UserContext'
import {IoArrowBackSharp} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
    const [assistantName,setAssistantName] = useState(userData?.AssistantName || "")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        setLoading(true)
        try {
            let formData = new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage) {
                formData.append("assistantImg",backendImage)
            } else {
                formData.append("imageUrl",selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials: true})
            setLoading(false)
            setUserData(result.data)
            navigate("/")
        } catch(error) {
            setLoading(false)
            console.log(error)
        }
    }
    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-purple-950 to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
            <IoArrowBackSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate("/customize")} />
            <h1 className="text-white lg:text-[30px] text-[28px] mb-[80px] lg:mb-[80px] text-center">Select your <span className="text-blue-300">Assistant Image</span></h1>
            <input type='text' placeholder='eg.shifra' className='w-full lg:max-w-[600px]  max-w-[350px] h-[60px] outline-none border-2 border-white bg-trasparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' required onChange={(e) => setAssistantName(e.target.value)} value={assistantName} />
            {assistantName && <button className='min-w-[300px] h-[60px] mt-[50px] bg-white rounded-full text-black font-semibold text-[20px] cursor-pointer' disabled={loading} onClick={() => {
                handleUpdateAssistant()
            }}>{!loading ? "Finaly Create Your Assistant" : "Loading...."}</button>}

        </div>
    )
}

export default Customize2