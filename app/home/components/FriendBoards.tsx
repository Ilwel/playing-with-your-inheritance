'use client'
import { GET_FRIEND_GAMES } from '@/app/utils/graphql/subscriptions/GameSubscriptions'
import { useLazyQuery, useSubscription } from '@apollo/client'
import ListFriendGames from './ListFriendGames'
import { QUERY_MY_FRIENDS } from '@/app/utils/graphql/queries/UserQueries'
import { useSession } from '@/app/utils/hooks/useSession'
import MiniLoading from '@/app/components/MiniLoading'
import { useEffect } from 'react'

export default function FriendBoards() {
  const { token } = useSession()
  const { data, loading } = useSubscription(GET_FRIEND_GAMES, {
    fetchPolicy: 'no-cache',
  })

  const [queryMyFriends, { data: firstData, loading: firstLoading }] =
    useLazyQuery(QUERY_MY_FRIENDS)

  useEffect(() => {
    void (async () => {
      if (token != null && token?.length > 0) {
        await queryMyFriends({
          context: {
            headers: {
              authorization: token,
            },
          },
          fetchPolicy: 'no-cache',
        })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="flex flex-col items-center">
      <h1>Friend Boards</h1>
      {!loading ? (
        <ListFriendGames games={data?.getFriendsGames} />
      ) : firstLoading ? (
        <MiniLoading />
      ) : (
        <ListFriendGames games={firstData?.queryFriendGames} />
      )}
    </div>
  )
}
