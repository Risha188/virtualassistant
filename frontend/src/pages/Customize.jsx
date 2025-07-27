import {RiImageAddFill} from "react-icons/ri";
import React, {useContext, useRef} from 'react'
import {IoArrowBackSharp} from "react-icons/io5";
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image7 from "../assets/image7.jpeg"
import image8 from "../assets/image8.png"
import image9 from "../assets/image9.jpeg"
import image10 from "../assets/image10.jpeg"
import image12 from "../assets/image12.jpeg"
import image13 from "../assets/image13.jpeg"
import image14 from "../assets/image14.jpeg"
import image15 from "../assets/image15.jpeg"
import {userDataContext} from "../context/UserContext";
import {useNavigate} from "react-router-dom";

function Customize() {
    const {serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
    const inputImage = useRef()
    const navigate = useNavigate()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    return (
        <div className='w-full h-[120vh] lg:h-[160vh] bg-gradient-to-t from-purple-950 to-[#030353] flex justify-center items-center flex-col p-[20px]'>
            <IoArrowBackSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate("/")} />
            <h1 className="text-white lg:text-[30px] text-[30px] mb-[80px] lg:mb-[80px] text-center">Select your <span className="text-blue-300">Assistant Image</span></h1>
            <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]'>
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image7} />
                <Card image={image8} />
                <Card image={image9} />
                <Card image={image10} />
                <Card image={image12} />
                <Card image={image13} />
                <Card image={image14} />
                <Card image={image15} />
                <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`} onClick={() => {
                    inputImage.current.click()
                    setSelectedImage("input")
                }}>
                    {!frontendImage && <RiImageAddFill className="text-white h-[30px] w-[30px]" />}
                    {frontendImage && <img src={frontendImage} className="h-full object-cover" />}
                </div>
                <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
            </div>
            {selectedImage && <button className='lg:min-w-[150px] min-w-[120px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold text-[20px] cursor-pointer' onClick={() => navigate("/customize2")}>Next</button>}

        </div>
    )
}

export default Customize