import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth=()=>{
    const router=useRouter();
    const SignOut=async ()=>{
        try {
            const res=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,{
                ///this end point is provided by default by the trpc
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            if(!res.ok)throw new Error();
            toast.success('Successfully logged out');
            router.push(
                'sign-in'
            )
            router.refresh();
        } catch (error) {
            toast.error(`Couldn't signout out please try again later`);
        }
    }
    return {SignOut};
}