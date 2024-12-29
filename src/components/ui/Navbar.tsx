import { IconsUser } from "@/assets/icons"
import Image from "next/image"
import {  FaBars, FaChevronDown } from "react-icons/fa"


const Navbar = () => {
    return (
        <div className="h-16 w-full bg-primary px-5 flex items-center justify-between text-white">
            <FaBars className="text-xl cursor-pointer"/>
            <div className="flex items-center gap-2 cursor-pointer">
                <Image 
                    src={IconsUser}
                    alt="Icons User"
                    className="h-10 w-10 rounded-full object-cover bg-white"
                />
                <FaChevronDown className="text-sm" />
            </div>
        </div>
    )
}

export default Navbar