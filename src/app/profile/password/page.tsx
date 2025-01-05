"use client";

import LayoutProfile from "@/components/layout/LayoutProfile";
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import { showDialog, showToast } from "@/utils/alertUtils";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RootState from "@/redux/store";
import { useSession } from "next-auth/react";

const Page = () => {
    const [data, setData] = useState({
        id : "",
        password: "",
        confirmPassword: "",
    })
    const [isLoadig, setIsLoading] = useState<boolean>(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const { data : session } = useSession(); 

    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch(`/api/user?id=${session?.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch profile data");
            }

            const profileData = await response.json();
            
            setData({
                id: profileData.data.id,
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.log(error);
        }
    }, [session, token]); // The function depends on the token

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSubmit = async () => {
        if (data.password !== data.confirmPassword) {
            return showDialog('error', "error", "Password baru dan konfirm password baru harus sama!")
        }

        try {
            setIsLoading(true);

            const formData = new FormData();

            formData.append("id", data.id);
            formData.append("password", data.password);

            const response = await fetch(`/api/user`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            })

            if (response.status === 200) {
                showToast('success', "berhasil menambahkan password baru");
            }
        } catch (error) {
            console.log(error);
            showDialog('error', "Internal Server", "Internal Server Error");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <LayoutProfile>
            <div className="flex w-full md:flex-1 h-max bg-white rounded shadow p-10 flex-col gap-5">
                <div className="grid grid-cols-1 gap-4">
                    <InputField
                        label="Password Baru"
                        type="text"
                        placeholder=""
                        className="border rounded"
                        value={data?.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                    <InputField
                        label="Konfirm Password Baru"
                        type="text"
                        placeholder=""
                        className="border rounded"
                        value={data?.confirmPassword}
                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                    />
                </div>
                <hr />
                <div className="flex items-center ">
                    <div className="w-32 h-10">
                        <ButtonSubmit 
                            title="Simpan"
                            isLoading={isLoadig}
                            onClick={handleSubmit}
                            style="rounded-md h-10"
                        />
                    </div>
                </div>
            </div>
        </LayoutProfile>
    )
}

export default Page