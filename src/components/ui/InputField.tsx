"use client";

import { InputFieldProps } from "@/utils/interface/components";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  value,
  onChange,
  label,
  Icon,
  type,
  placeholder,
  className, // Terima className sebagai props
}: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className={`w-full h-12 border-b flex items-center gap-3 px-2 ${className}`}>
            {Icon && <Icon className="text-lg text-gray-400" />}
            <input
                type={showPassword && type === "password" ? "text" : type} // Mengubah type input jika showPassword true
                value={value}
                onChange={onChange}
                className="flex flex-1 h-full outline-none border-none focus:border-none placeholder:font-light text-sm"
                placeholder={placeholder}
            />
            {type === "password" && (
                <div onClick={toggleShowPassword} className="cursor-pointer text-gray-400">
                    {showPassword ? (
                        <FaEyeSlash className="text-xl" />
                    ) : (
                        <FaEye className="text-xl" />
                    )}
                </div>
            )}
        </div>
    );
};

export default InputField;
