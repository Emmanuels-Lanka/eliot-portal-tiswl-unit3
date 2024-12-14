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
    const fontSize = textSize === "small" ? "text-2xl" : textSize === "medium" ? "text-3xl" : "text-4xl";

    return (
        <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <img src={image} alt={label} className={cn(imgSize ? `${imgSize} p-2` : "size-[12vh]", "pointer-events-none")} />
            <div className='w-full'>
                <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>{label}</p>
                <p className={cn("mt-1 font-semibold", color, fontSize)}>{value ? value.toUpperCase() : "NAN"}</p>
            </div>
        </div>
    )
}

export default GifAnimatedCard