import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = 'https://music-server-rtk.vercel.app'
const removeUser = createAsyncThunk('users/remove', async (user) => {
    try {
        // Fetch albums associated with the user
        const albumsResponse = await axios.get(`${url}/albums?userId=${user.id}`);
        const albums = albumsResponse.data;
    
        // Loop through each album to delete associated photos and then the album itself
        for (const album of albums) {
          // Fetch photos related to the album
          const photosResponse = await axios.get(`${url}/photos?albumId=${album.id}`);
          const photos = photosResponse.data;
    
          // Delete each photo
          for (const photo of photos) {
            await axios.delete(`${url}/photos/${photo.id}`);
          }
    
          // Delete the album after its photos are deleted
          await axios.delete(`${url}/albums/${album.id}`);
        };
    
        // Delete the user
        await axios.delete(`${url}/users/${user.id}`);
    
        // Return the deleted user data (for the fulfilled action in the reducer)
        return user;
    } catch (error) {
        throw Error('Failed to delete user and nested data');
    }
});

export { removeUser };