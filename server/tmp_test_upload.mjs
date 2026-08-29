// Test upload endpoint
async function test() {
  // 1. Login
  const loginRes = await fetch('https://bns-api-production.up.railway.app/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@bnsservices.sn', password: 'admin1234' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.token;
  console.log('Token OK');

  // 2. Create FormData with a tiny PNG
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const blob = new Blob([png], { type: 'image/png' });
  const formData = new FormData();
  formData.append('images', blob, 'test.png');

  // 3. Upload
  const uploadRes = await fetch('https://bns-api-production.up.railway.app/api/admin/upload', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: formData
  });
  console.log('Upload Status:', uploadRes.status);
  const text = await uploadRes.text();
  console.log('Response:', text);
}
test().catch(e => console.log('ERROR:', e.message));
