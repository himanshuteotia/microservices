import express from 'express';
import circuitBreaker from 'opossum';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello from Service Two!');
});

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Healthy', timestamp: new Date().toISOString() });
});

// A function that performs a network request
function fetchExternalService(url) {
  return axios.get(url);
}

// Circuit breaker options
const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trip the circuit
  errorThresholdPercentage: 50, // Trip the circuit when 50% of requests fail
  resetTimeout: 5000 // After 5 seconds, try again.
};

// Creating a circuit breaker instance
const breaker = new circuitBreaker(fetchExternalService, options);

// Fallback function when the circuit is open
breaker.fallback(() => 'The service is currently unavailable.');

// Event listeners
breaker.on('open', () => console.log('The circuit has been opened.'));
breaker.on('close', () => console.log('The circuit has been closed.'));
breaker.on('halfOpen', () => console.log('The circuit is half-open.'));


// Using the circuit breaker
async function makeRequest(url) {
  try {
    const response = await breaker.fire(url);
    console.log('Request:',response);
  } catch (error) {
    console.error('Service failed:', error.message);
  }
}


// Circuit breaker endpoint
app.get('/circuit-breaker', async(req, res) => {
  // Test the circuit breaker
  // Change the id to a non-existent post id to see the circuit breaker in action
  const id = 1;
  await makeRequest(`https://jsonplaceholder.typicode.com/posts/${id}`);
  res.send('Circuit breaker test completed.');
});

app.listen(PORT, () => {
  console.log(`Service Two running on http://localhost:${PORT}`);
});