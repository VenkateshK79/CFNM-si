-- CFNM.si Adult Web Trends Observatory
-- Purpose: ingest public Google Trends international top/rising data.
-- Run in BigQuery against the public dataset. Keep refresh_date partition filters.
-- Do not convert normalized scores into absolute search counts.

SELECT
  refresh_date,
  country_code,
  region_name,
  region_code,
  term,
  score,
  rank
FROM `bigquery-public-data.google_trends.international_top_terms`
WHERE refresh_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
ORDER BY refresh_date DESC, country_code, rank;

-- Rising terms:
SELECT
  refresh_date,
  country_code,
  region_name,
  region_code,
  term,
  score,
  rank
FROM `bigquery-public-data.google_trends.international_top_rising_terms`
WHERE refresh_date = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
ORDER BY refresh_date DESC, country_code, rank;