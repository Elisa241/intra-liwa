"use client";

import { useState } from "react";
import InputField from "../ui/InputField"
import { FaLock, FaUser } from "react-icons/fa";
import ButtonSubmit from "../ui/ButtonSubmit";
import { showDialog } from "@/utils/alertUtils";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaBoxesPacking } from "react-icons/fa6";

const FormLogin = () => {
    const [usernameValue, setUsernameValue] = useState<string>('')
    const [passwordValue, setPasswordValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const fetchSign = async () => {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                username : usernameValue,
                password : passwordValue,
            });

            if (res?.error) {
                showDialog('error', 'error', res.error);
            } else {
                router.push('/')
                showDialog('success', 'success', 'Login Berhasil!');
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
                <div className="h-20 w-20 bg-primary rounded-full center-flex text-4xl text-white">
                    <FaBoxesPacking />
                </div>
                <div className="flex flex-col items-center text-md md:text-xl font-medium">
                    <h1>Aplikasi Manajemen Barang</h1>
                    <h2>GudangKu</h2>
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