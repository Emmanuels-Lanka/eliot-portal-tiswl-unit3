import { cn } from '@/lib/utils';

interface GifAnimatedCardProps {
    label: string;
    value: string;
    image: string;
    color: string;
    imgSize?: string;
    textSize?: "small" | "medium" | "large";
}

const GifAnimatedCard = ({
    label,
    value,
    image,
    color,
    imgSize,
    textSize = "small",
}: GifAnimatedCardProps) => {
    const fontSize = textSize === "small" ? "text-2xl" : textSize === "medium" ? "text-3xl" : "text-5xl";

    return (
        <div className='h-full w-full bg-white pt-4 pb-4 pl-2 pr-4 flex flex-col justify-between items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <div className='w-full flex items-center'>
                <img
                    src={image}
                    alt={label}
                    className={cn("w-1/2 pointer-events-none", imgSize ? `${imgSize} p-1` : "size-[12vh]")}
                />
                <p className={cn("font-semibold", color, fontSize)}>{value ? value.toUpperCase() : "NAN"}</p>
            </div>
            <p className='w-full text-xl text-center font-medium text-slate-500 tracking-[0.01em]'>{label}</p>
        </div>
    )
}

export default GifAnimatedCard