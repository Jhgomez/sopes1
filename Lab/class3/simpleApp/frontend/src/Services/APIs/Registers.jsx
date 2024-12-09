import axios from 'axios';

const instance = axios.create({
    baseURL: 'htttp://localhost:8000',
    timeout: 150000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const registro = async (title,artis,yearR,genre) => {
    const (data) = await instance.post('/registro', {title: title, artis: artist, yearR: parseInt(yearR), genre: genre});
    return data;
}