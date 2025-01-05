"use client";

import SidebarMenu from "./SidebarMenu"
import Image from "next/image";
import { IconsBoxes, IconsUser } from "@/assets/icons";
import { DataMenuAdmin, DataMenuAdminGudang, DataMenuKepalaGudang } from "@/data/menu";
import { useSelector } from "react-redux";
import RootState from "@/redux/store";
import { useCallback, useEffect, useState } from "react";
import { DataUserProps } from "@/utils/interface/data";
import { useSession } from "next-auth/react";
import { SidebarProps } from "@/utils/interface/components";
import { FaBars } from "react-icons/fa";

const Sidebar = ({
    isActive, 
    setIsActive
} : SidebarProps) => {
    const token = useSelector((state : RootState) => state.auth.token);
    const [data, setData] = useState<DataUserProps | null>(null);
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

    let DataMenu;
    let role ;

    if (session?.user.role === 'administrator') {
        DataMenu = DataMenuAdmin;
        role = "Administrator"
    } else if (session?.user.role === 'kepala_gudang') {
        DataMenu = DataMenuKepalaGudang;
        role = 'Kepala Gudang';
    } else if (session?.user.role === 'admin_gudang') {
        DataMenu = DataMenuAdminGudang;
        role = 'Admin Gudang';
    }

    return (
        <div className={`h-max min-h-screen w-[270px]  bg-white shadow-lg fixed ${isActive ? 'flex ' : 'hidden '}  flex-col gap-5 z-50 `}>
            <div className="h-16 w-full bg-[#03387B] flex items-center justify-between px-5">
                <div className="flex items-center gap-4">
                    <Image 
                        src={IconsBoxes}
                        alt="Icons Boxes Logo"
                        height={50}
                        width={50}
                        className="h-10 w-10  object-cover "
                    />
                    <h2 className="text-white text-xl font-semibold">GudangKu</h2>
                </div>
                <FaBars
                    className="text-white flex md:hidden cursor-pointer text-lg"
                    onClick={() => setIsActive(false)}
                />
            </div>
            <div className="flex flex-col px-5 h-max gap-5 ">
                <div className="h-max py-2 w-full border-b flex  items-center gap-5">
                    <Image 
                        src={data?.image ? `http://localhost:3000/uploads/${data?.image}` : IconsUser}
                        alt="Icons User"
                        height={50}
                        width={50}
                        className="h-12 w-12 rounded-full object-cover bg-primary"
                    />
                    <div className="flex flex-col text-sm">
                        <h4 className="font-light text-gray-600">{data?.nama}</h4>
                        <p className="font-medium first-letter:uppercase">{role ? role : ''}</p>
                    </div>
                </div>
                <div className="w-full h-max flex flex-col gap-3">

                    {DataMenu && DataMenu.map((item, index) => (
                        <SidebarMenu 
                            key={index}
                            title={item.title}
                            link={item.link}
                            Icon={item?.Icon}
                            menu={item.submenu}
                            type={item.type}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar