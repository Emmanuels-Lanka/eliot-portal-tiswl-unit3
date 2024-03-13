"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation";
import axios from "axios"; 

import { useToast } from "../ui/use-toast";

const SignOutButton = () => {
    const { toast } = useToast();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const res = await axios.post('/api/auth/sign-out');
            toast({
                title: res.data,
                variant: "success",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            You&apos;re successfully signed out!
                        </code>
                    </div>
                ),
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
            className="group flex flex-row items-center px-3 py-3 mx-4 my-2 gap-3 border border-white/0 hover:border-white/15 text-slate-200/80 hover:text-slate-200 bg-white/10 rounded-sm cursor-pointer transition overflow-hidden"
            onClick={handleSignOut}
        >
            <LogOut className="w-5 h-5" />
            <p className="text-sm font-semibold">Sign out</p>
        </div>
    )
}

export default SignOutButton