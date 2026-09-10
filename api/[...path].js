const VPS_ORIGIN = process.env.VPS_ORIGIN || 'http://169.58.37.124:3006'

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 30,
}

function backendPath(req) {
  const url = new URL(req.url, 'http://localhost')
  let pathname = url.pathname
  if (pathname.startsWith('/api/_files/')) {
    pathname = pathname.slice('/api/_files'.length)
  }
  return `${pathname}${url.search}`
}

export default async function handler(req, res) {
  const target = `${VPS_ORIGIN}${backendPath(req)}`
  const headers = {}

  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue
    const lower = key.toLowerCase()
    if (['host', 'connection', 'content-length', 'accept-encoding'].includes(lower)) continue
    headers[key] = Array.isArray(value) ? value.join(',') : value
  }

  const method = req.method || 'GET'
  const chunks = []
  if (method !== 'GET' && method !== 'HEAD') {
    for await (const chunk of req) chunks.push(chunk)
  }

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
      redirect: 'manual',
    })

    res.status(upstream.status)
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (['transfer-encoding', 'connection', 'content-encoding'].includes(lower)) return
      res.setHeader(key, value)
    })
    res.send(Buffer.from(await upstream.arrayBuffer()))
  } catch (error) {
    res.status(502).json({
      success: false,
      message: 'Impossible de joindre le backend (169.58.37.124:3006).',
    })
  }
}
