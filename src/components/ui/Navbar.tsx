import { IconsUser } from "@/assets/icons"
import RootState from "@/redux/store"
import { NavbarProps } from "@/utils/interface/components"
import { DataUserProps } from "@/utils/interface/data"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {  FaBars, FaChevronDown, FaChevronUp, FaSignOutAlt, FaUser } from "react-icons/fa"
import { FaBarsStaggered } from "react-icons/fa6"
import { useSelector } from "react-redux"

const Navbar = ({
    isActive,
    setIsActive
} : NavbarProps) => {
    const [menuIsActive, setMenuIsActive] = useState<boolean>(false);
    const token = useSelector((state : RootState) => state.auth.token);
    const [data, setData] = useState<DataUserProps | null>(null);
    const handleLogout = () => {
        signOut({ callbackUrl : '/sign-in' })
    }

    const { data : session } = useSession();
    
    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch(`/api/user?id=${session?.user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setData(data.data);
        } catch (error) {
            console.log(error);
        }
    }, [session, token]); // Depend on token so it updates if token changes
    
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <>
            <div className="h-16 w-full bg-primary px-5 flex items-center justify-between text-white">
                {isActive ?  (
                    <FaBars 
                        className="text-xl cursor-pointer"
                        onClick={() => setIsActive(!isActive)}
                    />
                ) : (
                    <FaBarsStaggered 
                        className="text-xl cursor-pointer"
                        onClick={() => setIsActive(!isActive)}
                    />
                )}
                <div 
                    onClick={() => setMenuIsActive(!menuIsActive)}    
                    className="flex items-center gap-2 cursor-pointer"
                >
                    {data?.image ? (
                        <Image 
                            src={`http://localhost:3000/uploads/${data.image}`}
                            alt="Icons User"
                            width={50}
                            height={50}
                            className="h-10 w-10 rounded-full object-cover bg-white"
                        />
                    ) : (
                        <Image 
                            src={IconsUser}
                            alt="Icons User"
                            className="h-10 w-10 rounded-full object-cover bg-white"
                        />
                    )}
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
                    <div className="h-max w-[250px] bg-white shadow-md absolute right-5 top-16 rounded z-50 py-1 flex flex-col gap-1">
                        <div className="h-20 w-full flex items-center gap-3 px-4">
                            {data?.image ? (
                                <Image 
                                    src={`http://localhost:3000/uploads/${data.image}`}
                                    alt="Icons User"
                                    width={50}
                                    height={50}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            ) : (
                                <Image 
                                    src={IconsUser}
                                    alt="Icons User"
                                    className="h-12 w-12 rounded-full object-cover bg-primary"
                                />
                            )}
                            <div className="flex flex-col text-sm">
                                <p className="font-light text-gray-600">{data?.username ? data.username : "Username"}</p>
                                <p className="font-medium first-letter:uppercase">{data?.role ? data.role : "role"}</p>
                            </div>
                        </div>
                        <hr />
                        <Link href="/profile">
                            <div className="w-full h-10 hover:bg-primary  cursor-pointer flex items-center gap-3 px-4 text-[#8D9498] hover:text-white">
                                <FaUser />
                                <p className="text-sm">Profile</p>
                            </div>
                        </Link>
                        <hr />
                        <div 
                            onClick={handleLogout}
                            className="w-full h-10 hover:bg-primary cursor-pointer flex items-center gap-3 px-4 text-[#8D9498] hover:text-white">
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