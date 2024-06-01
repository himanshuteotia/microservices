import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const port = 6000;

const app = express();
app.use(bodyParser.json());

// This will store service data
const services = {}; 

// Health check for the service registry
const TIMEOUT = 30000; // 30 seconds
setInterval(() => {
    Object.keys(services).forEach(service => {
        axios.get(`${services[service]}/health`)
        .then(() => {
            console.log(`Service at ${services[service]} is healthy.`);
        })
        .catch(() => {
            delete services[service];
            console.log(`Service at ${url} failed health check and was removed.`);
        });
    });
}, TIMEOUT);

app.post('/register', (req, res) => {
    const { name, url } = req.body;
    // Register a new service instance
    services[name] = url; 
    console.log(`Registered ${name} at ${url}`);
    res.send('Registered');
});

app.post('/deregister', (req, res) => {
    const { name, url } = req.body;
    if (services[name]) {
        delete services[name];
        console.log(`Deregistered ${name} at ${url}`);
    }
    res.send('Deregistered');
});

app.get('/services/:service', (req, res) => {
    if(services[req.params.service]){
        return res.json(services[req.params.service]);
    } else {
        return res.status(404).send('Service not available');
    }
});

app.listen(port, () => {
    console.log(`Service registry running on http://localhost:${port}`);
});
