import { SelectOptionsProps } from "@/utils/interface/components"


const SelectOption = ({
    value,
    onChange,
    data,
    label,
    className,
    title
} : SelectOptionsProps) => {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">{title}</span>
            <select
                value={value}
                onChange={onChange}
                className={`${className}`}
            >
                <option value="">{label}</option>
                {data?.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
        </div>
    )
}

export default SelectOption