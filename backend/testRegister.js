(async () => {
  const testCases = [
    {
      name: 'Valid registration',
      body: { name: 'Frontend Test User', email: `frontendtest_${Date.now()}@example.com`, password: 'TestPass123' }
    },
    {
      name: 'Missing email',
      body: { name: 'Invalid', password: 'TestPass123' }
    }
  ];

  for (const test of testCases) {
    try {
      const res = await fetch('http://127.0.0.1:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.body)
      });
      const data = await res.text();
      console.log('---', test.name, '---');
      console.log('status', res.status);
      console.log('body', data);
    } catch (err) {
      console.error('fetch error', err);
    }
  }
})();
