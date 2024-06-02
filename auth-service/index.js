import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
const PORT = 9000;

app.post('/login', (req, res) => {
    // These should be checked against a database
    const { username, password } = req.body; 
    if (username === 'user' && password === 'pass') {
        const token = jwt.sign({ sub: username }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Authentication failed');
    }
});

app.post('/authorize', (req, res) => {
    const { token, action } = req.body;
    console.log(token);
    try {
        const decoded = jwt.verify(token, 'secretKey');
        // Implement logic based on decoded token values and requested action
        // For example:
        console.log(decoded.sub,action)
        if (decoded.sub === 'user' && action === 'GET') {
            res.send('Authorized');
        } else {
            res.status(403).send('Forbidden');
        }
    } catch (error) {
        res.status(401).send('Invalid token');
    }
});

app.listen(PORT, () => {
    console.log(`Authentication service running on http://localhost:${PORT}`);
});
