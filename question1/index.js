const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 9876;
const WINDOW_SIZE = 10;


let numberWindow = [];

const API_URLS = {
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand'
};

const fetchNumbers = async (id) => {
    try {
        const res = await axios.get(API_URLS[id], {
            timeout: 500,
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAyMDQ5LCJpYXQiOjE3NDQ3MDE3NDksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkwMjFiZTgyLTgxYzEtNDBhOS04MmVkLWFmYTVjMWJiMTBiOCIsInN1YiI6ImJoYXJnYXYyMTQuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJiaGFyZ2F2MjE0LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImJoYXJnYXYgc2luZ2xhIiwicm9sbE5vIjoiMjIxMDk5MDIxNCIsImFjY2Vzc0NvZGUiOiJQd3p1ZkciLCJjbGllbnRJRCI6IjkwMjFiZTgyLTgxYzEtNDBhOS04MmVkLWFmYTVjMWJiMTBiOCIsImNsaWVudFNlY3JldCI6IlBzWm5kTlBTZmFDV0ZXUFQifQ.Zp6QVrhwRp-Zm2wmCqUIRPTlAmX_FrgtnjyNYDCcip8"
            }
        });
        return res.data.numbers || [];
    } catch (err) {
        console.error(`Error fetching numbers for ID ${id}`, err.message);
        return [];
    }
};

app.get('/', (req, res) => {
    res.send(" Number Window API is running!");
});

app.get('/numbers/:id', async (req, res) => {
    const id = req.params.id;

    if (!API_URLS[id]) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const windowPrevState = [...numberWindow];
    const newNumbers = await fetchNumbers(id);

    const uniqueNewNumbers = newNumbers.filter(num => !numberWindow.includes(num));

    for (let num of uniqueNewNumbers) {
        if (numberWindow.length >= WINDOW_SIZE) {
            numberWindow.shift();
        }
        numberWindow.push(num);
    }

    const avg = numberWindow.length === 0
        ? 0
        : parseFloat(
            (numberWindow.reduce((sum, val) => sum + val, 0) / numberWindow.length).toFixed(2)
        );

    return res.json({
        windowPrevState,
        windowCurrState: [...numberWindow],
        numbers: newNumbers,
        avg
    });
});

app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});