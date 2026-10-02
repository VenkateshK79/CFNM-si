// CFNM.si Adult Web Trends Observatory
// Cloudflare Worker: fetches Google Trends Trending Now RSS for a selected country.
const ALLOWED_GEOS = new Set(['US','IN','GB','CA','AU','DE','FR','JP','BR','MX','ES','IT','NL','SG','HK','KR','IL','ZA']);
function parseRss(xml, geo) {
  const items = [...xml.matchAll(/<item>([\\s\\S]*?)<\\/item>/gi)];
  return items.map((match, index) => {
    const block = match[1];
    const get = tag => { const m = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i')); return m ? m[1].replace(/<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>/g, '$1').trim() : ''; };
    return { position:index+1, query:get('title'), search_volume_label:get('approx_traffic') || null, started_at:get('pubDate') || null, explore_url:get('link') || null, description:get('description') || null, country_code:geo, source:'Google Trends Trending Now RSS' };
  });
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const geo = (url.searchParams.get('geo') || 'IN').toUpperCase();
    if (!ALLOWED_GEOS.has(geo)) return Response.json({error:'Unsupported geo',allowed:[...ALLOWED_GEOS]}, {status:400});
    const sourceUrl = 'https://trends.google.com/trending/rss?geo=' + encodeURIComponent(geo);
    const cacheKey = new Request(sourceUrl);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
    const response = await fetch(sourceUrl, {headers:{'user-agent':'CFNM-si-Adult-Web-Trends-Observatory/1.0'}});
    if (!response.ok) return Response.json({error:'Google Trends RSS request failed',status:response.status,source:sourceUrl},{status:502});
    const xml = await response.text();
    const data = {retrieved_at:new Date().toISOString(),country_code:geo,source:'Google Trends Trending Now RSS',source_url:sourceUrl,method:'public RSS feed',limitation:'RSS is a limited feed; category, active-status and full trend-pool fields are not guaranteed.',trends:parseRss(xml,geo)};
    const output = new Response(JSON.stringify(data), {headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=600','access-control-allow-origin':'*'}});
    ctx.waitUntil(cache.put(cacheKey, output.clone()));
    return output;
  }
};