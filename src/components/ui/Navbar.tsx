import { IconsUser } from "@/assets/icons"
import { removeToken } from "@/redux/authSlice"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {  FaBars, FaChevronDown, FaChevronUp, FaSignOutAlt, FaUser } from "react-icons/fa"
import { useDispatch } from "react-redux"


const Navbar = () => {
    const [menuIsActive, setMenuIsActive] = useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(removeToken());
        router.push('/sign-in')
    }

    return (
        <>
            <div className="h-16 w-full bg-primary px-5 flex items-center justify-between text-white">
                <FaBars className="text-xl cursor-pointer"/>
                <div 
                    onClick={() => setMenuIsActive(!menuIsActive)}    
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <Image 
                        src={IconsUser}
                        alt="Icons User"
                        className="h-10 w-10 rounded-full object-cover bg-white"
                    />
                    {menuIsActive ? (
                        <FaChevronUp className="text-sm" />
                    ) : (
                        <FaChevronDown className="text-sm" />
                    )}
                </div>

            </div>
            {menuIsActive &&
                <div 
                    onClick={() => setMenuIsActive(false)}
                    className="fixed inset-0 bg-black bg-opacity-5 flex justify-center items-center z-20 cursor-pointer"
                >
                    <div className="h-max w-[250px] bg-white shadow-md absolute right-5 top-16 rounded z-50 px-4 py-7 flex flex-col gap-3">
                        <div className="w-full h-12 hover:bg-primary rounded border cursor-pointer flex items-center gap-3 px-4 text-[#8D9498] hover:text-white">
                            <FaUser />
                            <p className="text-sm">Profile</p>
                        </div>
                        <div 
                            onClick={handleLogout}
                            className="w-full h-12 hover:bg-primary rounded border cursor-pointer flex items-center gap-3 px-4 text-[#8D9498] hover:text-white">
                            <FaSignOutAlt />
                            <p className="text-sm">Logout</p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Navbar