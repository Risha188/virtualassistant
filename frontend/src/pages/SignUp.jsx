import React,{useContext,useState} from 'react'
import bg from "../assets/authBg.png"
import {IoEye} from "react-icons/io5";
import {IoEyeOff} from "react-icons/io5";
import {useNavigate} from 'react-router-dom';
import axios from "axios"
import {userDataContext} from '../context/UserContext';

function SignUp() {

    const [showPassword,setShowPassword] = useState(false)
    const {serverUrl,userData,setUserData} = useContext(userDataContext)
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [err,setErr] = useState("")

    const handleSignUp = async (e) => {
        e.preventDefault()
        setErr("")
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`,{
                name,email,password
            },{withCredentials: true})
            setUserData(result.data)
            setLoading(false)
            navigate("/customize")
        } catch(error) {
            console.log(error)
            setUserData(null)
            setLoading(false)
            setErr(error.response.data.message)
        }
    }

    return (
        <div className='w-full h-[100vh] lg:bg-cover bg-fit flex justify-center items-center' style={{backgroundImage: `url(${bg})`}}>
            <form className='w-[90%] h-[550px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] px-[20px]' onSubmit={handleSignUp}>
                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-900'>Virtual Assistant</span></h1>
                <input type='text' placeholder='Enter your Name' className='w-full h-[60px] outline-none border-2 border-white bg-trasparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' required onChange={(e) => setName(e.target.value)} value={name} />

                <input type='email' placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-trasparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email} />

                <div className='w-full h-[60px] border-2 border-white bg-trasparent text-white rounded-full text-[18px] relative'>
                    <input type={showPassword ? "text" : "password"} placeholder='Password' className='w-full h-full outline-none bg-trasparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]' required onChange={(e) => setPassword(e.target.value)} value={password} />
                    {!showPassword && <IoEye className='absolute top-[18px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={() => setShowPassword(true)} />}
                    {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={() => setShowPassword(false)} />}
                </div>
                {err.length > 0 && <p className='text-red-500 text-[17px]'>
                    *{err}
                </p>}
                <button className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer' disabled={loading}>{loading ? "Loading...." : "Sign Up"}</button>
                <p className='text-white text-[17px] cursor-pointer' onClick={() => navigate("/signin")}>Already have an account? <span className='text-blue-300 cursor-pointer'>Sign In</span></p>
            </form>
        </div>
    )
}

export default SignUp