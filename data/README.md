# Adult Web Trends Observatory data layer

This directory defines the data contract used by CFNM.si.

## Sources

The first planned source is Google's public Google Trends BigQuery dataset. Google documents the international dataset as anonymized, indexed, normalized and aggregated, with country and sub-region coverage and a rolling historical window.

## Rules

- Never publish private or user-level search data.
- Never infer a person's gender, sexuality or identity from search behavior.
- Never describe a normalized Trends score as an absolute search count.
- Store source URL, retrieval timestamp and methodology with observations.
- Preserve the original source score/rank before deriving any secondary metric.
- Distinguish observed data from interpretation.

## Pipeline

1. Source discovery
2. BigQuery query
3. Normalize into `observatory-schema.json`
4. Store versioned snapshots
5. Render dashboard summaries
6. Record provenance

The repository currently contains the schema and query layer. A live scheduled ingestion requires a Google Cloud/BigQuery connection and credentials; no credentials are stored in this repository.
