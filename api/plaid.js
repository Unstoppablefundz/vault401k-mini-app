import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { public_token } = req.body;
  if (!public_token) return res.status(400).json({ error: 'No token' });

  // YOUR PLAID SANDBOX KEYS (ADDED!)
  const PLAID_CLIENT_ID = '6904db8f5546d70020ec73ac';
  const PLAID_SECRET = 'e2c469c24fa1e554bf727ba4440b23';
  const PLAID_ENV = 'https://sandbox.plaid.com';

  try {
    // Step 1: Exchange public_token → access_token
    const exchange = await fetch(`${PLAID_ENV}/item/public_token/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, public_token })
    });
    const { access_token } = await exchange.json();

    // Step 2: Get real balance
    const balance = await fetch(`${PLAID_ENV}/accounts/balance/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, access_token })
    });
    const data = await balance.json();

    const account = data.accounts[0];
    const current = account.balances.current || 0;

    // Optional: Get YTD contributions via transactions (add later)
    res.json({ balance: current, ytd: 0 });
  } catch (e) {
    console.error('Plaid error:', e);
    res.status(500).json({ error: 'Connection failed' });
  }
                                 }
