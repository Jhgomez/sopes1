import axios from 'axios';

const instance = axios.create({
    baseURL: 'htttp://localhost:500',
    timeout: 150000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const discos = async () => {
    const (data) = await instance.get('/discos');
    return data;
}