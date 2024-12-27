import { IconType } from "react-icons";


export interface InputFieldProps {
    value? : string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label? : string;
    Icon? : IconType;
    type : string;
    placeholder : string;
    className?: string;
}

export interface ButtonSubmitProps {
    title : string;
    onClick : () => void;
    isLoading : boolean
}