import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/components/Logout";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

const Page = async () => {
  await requireAuth()

  const data = await caller.getUser()

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server Route
      <div>
        {JSON.stringify(data , null, 2)}
      </div>
      <LogoutButton />
    </div>
  )
}


export default Page;