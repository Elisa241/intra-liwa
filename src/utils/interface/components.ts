import React from "react";
import { IconType } from "react-icons";


export interface InputFieldProps {
    value? : string | number | undefined;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label? : string;
    Icon? : IconType;
    type : string;
    placeholder : string;
    className?: string;
    disabled? : boolean;
    max? : number;
}

export interface ButtonSubmitProps {
    title : string;
    onClick : () => void;
    isLoading : boolean
}

export interface FormLoginProps {
    role? : string;
}

export interface SidebarSubMenuProps {
    title : string;
    link : string | undefined;
}

export interface SidebarMenuProps {
    title : string;
    link? : string;
    Icon : IconType;
    type? : string;
    menu? : SidebarSubMenuProps[] | undefined;
}

export interface LayoutAdminProps {
    children : React.ReactNode;
}

export interface ModalsProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  classname : string;
}

export interface SelectOptionsDataProps {
    label : string;
    value : string | number;
}

export interface SelectOptionsProps {
    value : string | number;
    onChange : (e: React.ChangeEvent<HTMLSelectElement>) => void;
    data : SelectOptionsDataProps[] | undefined;
    label : string;
    className?: string;
    title? : string
}