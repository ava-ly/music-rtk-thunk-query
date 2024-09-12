import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchUsers = createAsyncThunk('users/fetch', async () => {
    const response = await axios.get('https://music-server-rtk.vercel.app/users');
    // DEV only
    // await pause(1000);

    return response.data;
});

// DEV only
// const pause = (duration) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, duration);
//     });
// }

export { fetchUsers };