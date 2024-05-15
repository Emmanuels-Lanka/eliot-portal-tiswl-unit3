"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation";
import axios from "axios"; 

import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";

const SignOutButton = ({ mode }: { mode?: string }) => {
    const { toast } = useToast();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const res = await axios.post('/api/auth/sign-out');
            toast({
                title: "You are signed out!",
                variant: "success"
            });
            router.push('/sign-in');
        } catch (error: any) {
            toast({
                title: "Something went wrong! Try again",
                variant: "error",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            ERROR: {error.message}
                        </code>
                    </div>
                ),
            });
        }
    }

    return (
        <div
            className={cn(
                "group flex flex-row items-center px-3 py-3 gap-3 border rounded-sm cursor-pointer transition overflow-hidden",
                mode === 'qc' ? 'px-5 py-2.5 rounded-lg hover:bg-slate-100' : 'mx-4 my-2 border-white/0 hover:border-white/15 text-slate-200/80 hover:text-slate-200 bg-white/10'
            )}
            onClick={handleSignOut}
        >
            <LogOut className="w-5 h-5 max-sm:hidden" />
            <p className="text-sm font-semibold">Sign out</p>
        </div>
    )
}

export default SignOutButton