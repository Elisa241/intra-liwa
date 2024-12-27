"use client";

import ButtonSubmit from "@/components/ui/ButtonSubmit";
import InputField from "@/components/ui/InputField"
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa"


const Home = () => {
  const [usernameValue, setUsernameValue] = useState<string>('')
  const [spinner, setSpinner] = useState<boolean>(false);

  const handleClick = () => {
    
  }

  return (
    <div className="h-screen w-full bg-primary flex center-flex">
      <div className="h-[60vh] w-[95%] max-w-[500px] bg-white rounded-lg shadow-lg flex flex-col items-center gap-5 p-10">
        <div className="h-20 w-20 bg-primary rounded-full">

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
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
        <ButtonSubmit
          title="Login"
          isLoading={spinner}
          onClick={handleClick}
        /> 
      </div>
    </div>
  )
}

export default Home