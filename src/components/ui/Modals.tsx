
import { ModalsProps } from "@/utils/interface/components";
import React from "react";
import { FaX } from "react-icons/fa6";

const Modals = ({ 
    isOpen, 
    onClose, 
    children,
    classname
}: ModalsProps) => {
    if (!isOpen) return null; // Don't render the modal if it's closed

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className={` relative ${classname}`}
                onClick={(e) => e.stopPropagation()} // Prevent click event from closing the modal when clicked inside
            >
                <button
                    onClick={onClose}
                    className="text-xl text-gray-500 hover:text-black absolute top-3 right-3"
                >
                    <FaX  />
                </button>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modals;
