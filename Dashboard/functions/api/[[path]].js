export async function onRequest({ request, params }) {
  try {
    const url = new URL(request.url);
    const restPath = params.path ? String(params.path) : '';
    const upstream = `https://leaderboard.runasp.net/api/${restPath}${url.search}`;

    const init = {
      method: request.method,
      headers: new Headers(request.headers),
      redirect: 'follow',
    };
    init.headers.delete('host');

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = await request.arrayBuffer();
    }

    const resp = await fetch(upstream, init);

    const headers = new Headers(resp.headers);
    // headers.set('Access-Control-Allow-Origin', '*');
    return new Response(resp.body, { status: resp.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy error', details: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
