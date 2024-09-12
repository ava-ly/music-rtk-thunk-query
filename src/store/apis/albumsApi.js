import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { faker } from "@faker-js/faker";

// DEV only
// const pause = (duration) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, duration);
//     });
// }

const albumsApi = createApi({
    reducerPath: 'albums',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://music-server-rtk.vercel.app',
        
        // fetchFn: async (...args) => {
        //     // remove for production
        //     // await pause(1000);
        //     return fetch(...args);
        // }
    }),
    endpoints(builder) {
        return {
            removeAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: 'Album', id: album.id}, { type: 'AlbumPhoto', id: album.id }]
                },
                // query: (album) => {
                //     return {
                //         url: `/albums/${album.id}`,
                //         method: 'DELETE',
                //     }
                // }
                // Handle deleting nested photos and album
                async queryFn(album, _queryApi, _extraOptions, fetchWithBQ) {
                    try {
                    // Fetch all photos associated with this album
                    const photosResponse = await fetchWithBQ({
                        url: `/photos?albumId=${album.id}`,
                    });

                    if (photosResponse.error) throw photosResponse.error;

                    // Delete each photo individually
                    const photos = photosResponse.data;
                    for (const photo of photos) {
                        await fetchWithBQ({
                        url: `/photos/${photo.id}`,
                        method: 'DELETE',
                        });
                    }

                    // Delete the album itself
                    const albumResponse = await fetchWithBQ({
                        url: `/albums/${album.id}`,
                        method: 'DELETE',
                    });

                    if (albumResponse.error) throw albumResponse.error;

                    return { data: albumResponse.data };

                    } catch (error) {
                    return { error };
                    }
                },
            }),
            addAlbum: builder.mutation({
                invalidatesTags: (result, error, user) => {
                    return [{ type: 'UsersAlbums', id: user.id}]
                },
                query: (user) => {
                    return {
                        url: '/albums',
                        method: 'POST',
                        body: {
                            userId: user.id,
                            title: faker.music.album()
                        }
                    }
                }
            }),
            fetchAlbums: builder.query({
                providesTags: (result, error, user) => {
                    const tags = result.map(album => {
                        return { type: 'Album', id: album.id}
                    });
                    tags.push({ type: 'UsersAlbums', id: user.id})
                    return tags;
                },
                query: (user) => {
                    return {
                        url: '/albums',
                        params: {
                            userId: user.id
                        },
                        method: 'GET'
                    }
                }
            })
        }
    }
});

export const { useFetchAlbumsQuery, useAddAlbumMutation, useRemoveAlbumMutation } = albumsApi;
export { albumsApi };