"use client";

import { useState } from "react";
import InputField from "../ui/InputField"
import { FaLock, FaUser } from "react-icons/fa";
import ButtonSubmit from "../ui/ButtonSubmit";
import { showDialog, showToast } from "@/utils/alertUtils";
import Image from "next/image";
import { IconsBoxes } from "@/assets/icons";
import { FormLoginProps } from "@/utils/interface/components";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/authSlice";
import { useRouter } from "next/navigation";


const FormLogin = ({
    role
} : FormLoginProps) => {
    const [usernameValue, setUsernameValue] = useState<string>('')
    const [passwordValue, setPasswordValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const fetchSign = async () => {
        try {
            let roleUser

            if (role === 'Administrator') {
                roleUser = 'administrator'
            } else if (role === 'Kepala Gudang') {
                roleUser = 'kepala_gudang'
            } else if (role === 'Admin Gudang') {
                roleUser = 'admin_gudang'
            } else {
                showDialog('error', 'Error', 'Role tidak valid!');
            }

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameValue,
                    password: passwordValue,
                    role: roleUser
                }),
            });

            const data = await response.json();
            dispatch(setToken(data.data.token));

            if (response.status === 200) {
                showToast('success', 'Login Berhasil!');

                if (role === 'Administrator') {
                    router.push('/')
                }
            } else if (response.status === 402) {
                showToast('error', 'Username tidak ditemukan');
            } else if (response.status === 403) {
                showToast('error', "Login Gagal!")
            } else if (response.status === 401) {
                showDialog('error', "error", "Password salah")
            } else if (response.status === 405) {
                showDialog('error', 'error', 'All Field Required!')
            }

            

           
        } catch (error) {
            console.log(error);
            showDialog('error', 'Error', 'Login Gagal!');
        } 
    }
    
    const handleClick = () => {
        if (!usernameValue || !passwordValue) {
            showDialog('error', 'Error', "Username dan password tidak boleh kosong!");
        } else {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                fetchSign();
            }, 3000);
        }
        setUsernameValue('');
        setPasswordValue('');
    }


    return (
        <div className="h-screen w-full bg-primary flex center-flex">
            <div className="h-max w-[95%] max-w-[500px] bg-white rounded-lg shadow-lg flex flex-col items-center gap-5 p-5 md:p-10">
                <div className="h-20 w-20 bg-primary rounded-full center-flex">
                    <Image 
                        src={IconsBoxes}
                        alt="Icons Boxes"
                        height={50}
                        width={50}
                    />
                </div>
                <div className="flex flex-col items-center text-md md:text-xl font-medium">
                    <h1>Aplikasi Manajemen Barang</h1>
                    <h2>GudangKu</h2>
                    <p className="text-sm font-light mt-2 text-gray-400">{role}</p>
                </div>
                <div className="w-full h-max flex flex-col gap-6 mt-8 mb-5">
                    <InputField
                        Icon={FaUser}
                        type="text"
                        placeholder="Username"
                        value={usernameValue}
                        onChange={(e) => setUsernameValue(e.target.value)}
                    />
                    <InputField 
                        Icon={FaLock}
                        type="password"
                        placeholder="Password"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                    />
                </div>
                <ButtonSubmit
                    title="Login"
                    isLoading={isLoading}
                    onClick={handleClick}
                /> 
                <p className="text-sm text-gray-500 mt-6">@Zerivo - 2024</p>
            </div>
        </div>
    )
}

export default FormLogin