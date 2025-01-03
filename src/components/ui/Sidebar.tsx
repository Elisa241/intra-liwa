"use client";

import SidebarMenu from "./SidebarMenu"
import Image from "next/image";
import { IconsBoxes, IconsUser } from "@/assets/icons";
import { MenuAdmin } from "@/data/menu";


const Sidebar = () => {
    return (
        <div className={`h-max min-h-screen w-[270px]  bg-white shadow-lg fixed md:flex hidden flex-col gap-5`}>
            <div className="h-16 w-full bg-[#03387B] flex items-center gap-4 px-5">
                <Image 
                    src={IconsBoxes}
                    alt="Icons Boxes Logo"
                    height={50}
                    width={50}
                    className="h-10 w-10  object-cover "
                />
                <h2 className="text-white text-xl font-semibold">GudangKu</h2>
            </div>
            <div className="flex flex-col px-5 h-max gap-5 ">
                <div className="h-max py-2 w-full border-b flex  items-center gap-5">
                    <Image 
                        src={IconsUser}
                        alt="Icons User"
                        height={50}
                        width={50}
                        className="h-12 w-12 rounded-full object-cover bg-primary"
                    />
                    <div className="flex flex-col text-sm">
                        <h4 className="font-light text-gray-600">Name</h4>
                        <p className="font-medium ">Admnistrator</p>
                    </div>
                </div>
                <div className="w-full h-max flex flex-col gap-2">
                    {MenuAdmin.map((item, index) => (
                        <SidebarMenu 
                            key={index}
                            title={item.title}
                            link={item.link}
                            Icon={item.Icon}
                            menu={item.menu ? item.menu : undefined}
                            type={item.type}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar