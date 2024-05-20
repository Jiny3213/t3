import Link from "next/link"
import Image from "next/image"

import { CreatePost } from "~/app/_components/create-post"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"
import { Button } from "@mui/material"

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" })
  const session = await getServerAuthSession()
  console.log('session is ', session)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
       
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <Button variant="contained" href="/translate">translate</Button>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center text-2xl text-white">
              {session && 
                <div>
                  <p>
                    <Button variant="contained" href="/upload">upload</Button>
                  </p>
                  <span>Logged in as {session.user?.name}</span><Image width={50} height={50} src={session.user?.image??''} alt="avatar"/>
                </div>
              }
            </div>
            <Button variant="contained" href={session ? "/api/auth/signout" : "/login"}>{session ? "Sign out" : "Sign in"}</Button>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  )
}

async function CrudShowcase() {
  const session = await getServerAuthSession()
  if (!session?.user) return null

  const latestPost = await api.post.getLatest()

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  )
}
