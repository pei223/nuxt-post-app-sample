import { baseApi } from './baseApi'
import { FavoriteList } from '~/domain/Favorite'

const NO_SELECTED_ID = -1

export const addFavorite = async (
  accessToken: string,
  postId: number
): Promise<void> => {
  await baseApi.post(
    `/favorites/add/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export const deleteFavoriteByPostId = async (
  accessToken: string,
  postId: number
): Promise<void> => {
  await baseApi.post(
    `/favorites/delete`,
    {
      postId,
      favoriteId: NO_SELECTED_ID,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export const deleteFavoriteByFavoriteId = async (
  accessToken: string,
  favoriteId: number
): Promise<void> => {
  await baseApi.post(
    `/favorites/delete`,
    {
      postId: NO_SELECTED_ID,
      favoriteId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export const getFavorites = async (
  accessToken: string
): Promise<FavoriteList> => {
  const result = await baseApi.get<FavoriteList>(`/favorites/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return result.data
}
