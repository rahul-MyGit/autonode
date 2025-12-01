"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";


const Page = () => {
  const { data: session, isPending: loading } = authClient.useSession()

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      HOME PAGE <br />
      {JSON.stringify(session)}
      { session && (
              <Button onClick={() => authClient.signOut()}>
                Logout
              </Button> 
            )
      }
    </div>
  )
}


export default Page;