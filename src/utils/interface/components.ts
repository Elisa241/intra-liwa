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
    isLoading : boolean;
    style? : string;
}

export interface FormLoginProps {
    role? : string;
}

interface SidebarSubMenuProps {
    title : string;
    link? : string;
    type? : string;
    Icon? : IconType;
    submenu? : { title : string; link : string }[] ;
}

export interface SidebarMenuProps {
    title : string;
    Icon? : IconType | null;
    link? : string;
    type? : string;
    menu? : SidebarSubMenuProps[]
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

export interface BreadcrumbsProps {
    title : string;
    link? : { link: string; title: string }[];
    Icon? : IconType
}

export interface SidebarProps {
    isActive : boolean;
    setIsActive : (isActive: boolean) => void;
}

export interface NavbarProps {
    isActive : boolean;
    setIsActive : (isActive: boolean) => void;
}