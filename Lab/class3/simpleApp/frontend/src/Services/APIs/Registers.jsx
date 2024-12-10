import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 150000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const register = async (title,artist,yearR,genre) => {
    const {data} = await instance.post('/registro', {title: title, artist: artist, yearR: parseInt(yearR), genre: genre});
    return data;
}