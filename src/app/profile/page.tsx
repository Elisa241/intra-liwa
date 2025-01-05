"use client";

import { IconsUser } from "@/assets/icons";
import LayoutProfile from "@/components/layout/LayoutProfile";
import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField";
import RootState from "@/redux/store";
import { showDialog, showToast } from "@/utils/alertUtils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
    const [data, setData] = useState({
        id : "",
        nama: "",
        username: "",
        image: "",
        imageNew: null as File | null,
    });
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
                nama: profileData.data.nama || "",
                username: profileData.data.username || "",
                image: profileData.data.image || "",
                imageNew: null,
            });
        } catch (error) {
            console.log(error);
        }
    }, [session, token]); // The function depends on the token

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData((prevData) => ({ ...prevData, imageNew: file }));
        }
    };

    const ImageUrl = data.image
        ? `http://localhost:3000/uploads/${data.image}`
        : IconsUser;

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("id", data.id);
        formData.append("nama", data.nama);
        formData.append("username", data.username);

        if (data.imageNew && data.image) {
            formData.append("image", data.image);
            formData.append("imageUpdate", data.imageNew);
        }

        try {
            setIsLoading(true);

            const response = await fetch(`/api/user`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            })

            if (response.status === 200) {
                showToast('success', "berhasil edit data")
                fetchProfile();
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
                <div className="flex md:flex-row flex-col items-center gap-9 w-full h-max">
                    <div className="h-32 w-32 rounded-full">
                        {data.imageNew ? (
                            <Image
                                src={URL.createObjectURL(data.imageNew)}
                                alt="Uploaded Profile Image"
                                width={128}
                                height={128}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <Image
                                src={ImageUrl}
                                alt="Profile Image"
                                width={128}
                                height={128}
                                className="h-full w-full rounded-full object-cover"
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="w-28 h-10 bg-primary text-white rounded text-xs hover:opacity-80"
                            onClick={() =>
                                document.getElementById("file-input")?.click()
                            }
                        >
                            Ganti Profile
                        </button>
                        <input
                            id="file-input"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <InputField
                        label="Nama"
                        type="text"
                        placeholder=""
                        className="border rounded"
                        value={data.nama}
                        onChange={(e) =>
                            setData((prevData) => ({
                                ...prevData,
                                nama: e.target.value,
                            }))
                        }
                    />
                    <InputField
                        label="Username"
                        type="text"
                        placeholder=""
                        className="border rounded"
                        value={data.username}
                        onChange={(e) =>
                            setData((prevData) => ({
                                ...prevData,
                                username: e.target.value,
                            }))
                        }
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
    );
};

export default Page;
