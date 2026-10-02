# CFNM.si Trend Workers

## Trending Now collector

`trending-now.mjs` is a Cloudflare Worker that reads the public Google Trends Trending Now RSS feed for a configured country and returns normalized JSON.

Example after deployment: `https://YOUR-WORKER.workers.dev/?geo=IN`

The worker preserves the RSS limitation and does not convert bucketed traffic labels into fabricated exact counts.

### Production path

1. Deploy the Worker.
2. Put the Worker URL into the Observatory dashboard configuration.
3. Use Cloudflare scheduled triggers for periodic snapshots.
4. Store snapshots in D1/R2 only after the source and retention policy are configured.
5. Keep `retrieved_at`, `source_url`, country and method with every snapshot.

Google says Trending Now refreshes approximately every 10 minutes, supports 100+ countries/regions, and offers CSV/RSS export.