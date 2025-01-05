"use client";

import LayoutAdmin from "@/components/layout/LayoutAdmin"
import { LayoutAdminProps } from "@/utils/interface/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  FaLock, FaUser } from "react-icons/fa"
import Breadcrumbs from "../ui/Breadcrumbs";

const LayoutProfile = ({
    children
} : LayoutAdminProps) => {
    const pathname = usePathname();

    return (
        <LayoutAdmin>
             <div className="flex flex-col gap-10 w-full h-max">
                {pathname === "/profile/password" ? (
                    <Breadcrumbs 
                        Icon={FaUser}
                        title="Profile"
                        link={[
                            {title : "Profile", link : "/profile"},
                            {title : "Ubah Password", link : "/profile/password"},
                        ]}
                    />
                ) : (
                    <Breadcrumbs 
                        Icon={FaUser}
                        title="Profile"
                        link={[
                            {title : "Profile", link : "/profile"}
                        ]}
                    />
                )}
                <div className="w-full h-max flex md:flex-row flex-col gap-5">
                    <div className="w-full md:w-[250px] h-max bg-white rounded shadow flex flex-col gap-2 py-5 ">
                        <Link href={'/profile'}>
                            <div className={`w-full h-12 flex items-center gap-3 px-5  cursor-pointer hover:bg-[#07469923] hover:border-r-4 hover:border-primary hover:text-primary
                                ${pathname === '/profile' ? 'bg-[#07469923] border-r-4 border-primary text-primary' : 'text-textColor'}
                                `}>
                                <FaUser  className="text-lg"/>
                                <p className="text-sm">Profile</p>
                            </div>
                        </Link>
                        <Link href={'/profile/password'}>
                            <div className={`w-full h-12 flex items-center gap-3 px-5  cursor-pointer hover:bg-[#07469923] hover:border-r-4 hover:border-primary hover:text-primary
                                ${pathname === '/profile/password' ? 'bg-[#07469923] border-r-4 border-primary text-primary' : 'text-textColor'}
                                `}>
                                <FaLock  className="text-lg"/>
                                <p className="text-sm">Ubah Password</p>
                            </div>
                        </Link>
                    </div>
                    {/* children*/}
                    {children}

                </div>
            </div>
        </LayoutAdmin>
    )
}

export default LayoutProfile