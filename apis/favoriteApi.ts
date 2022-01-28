import { baseApi } from './baseApi'

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

export const deleteFavorite = async (
  accessToken: string,
  postId: number
): Promise<void> => {
  await baseApi.post(
    `/favorites/delete/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}
