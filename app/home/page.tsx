'use client'
import { XOctagon } from 'lucide-react'
import Button from '../components/Button'
import PageWrapper from '../components/PageWrapper'
import SearchFriends from './components/SearchFriends'
import { useRouter } from 'next/navigation'
import MyFriends from './components/MyFriends'
import { useSession } from '../hooks/useSession'

export default function Page() {
  const router = useRouter()
  useSession()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/')
  }

  return (
    <PageWrapper>
      <div className="flex flex-col h-full w-full items-start justify-start p-10">
        <Button
          onClick={handleSignOut}
          className="absolute top-10 right-10 flex gap-2"
        >
          <XOctagon />
          Sign Out
        </Button>
        <header className="flex items-start justify-start w-full gap-2">
          <SearchFriends />
          <Button href="/friend-requests/sent" delay={0.7} className="mt-4">
            Requests Sent
          </Button>
          <Button href="/friend-requests/received" delay={1} className="mt-4">
            Requests Received
          </Button>
        </header>
        <main className="flex items-start w-full">
          <aside>
            <MyFriends />
          </aside>
        </main>
      </div>
    </PageWrapper>
  )
}
