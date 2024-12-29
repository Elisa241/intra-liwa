
import { GifSpinner } from '@/assets/gif';
import { ButtonSubmitProps } from '@/utils/interface/components';
import Image from 'next/image';

const ButtonSubmit = ({
    title, 
    onClick,
    isLoading
} : ButtonSubmitProps) => {
    return (
        <div
            className={`h-12 w-full bg-primary  hover:opacity-80
                flex items-center justify-center rounded-full cursor-pointer
                text-white
            `}
            onClick={onClick}
        >
            {isLoading ? (
                <Image src={GifSpinner} alt='Gif Spinner white' height={20} width={20} />
            ) : (
                <p className=' font-bold text-sm'>{title}</p>
            )}
        </div>
    )
}

export default ButtonSubmit