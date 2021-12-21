# codebuild-test

## k6

Run examples:

```sh
k6 run --summary-trend-stats="min,max,avg,p(90),count" --summary-time-unit=s k6.js
K6_STATSD_ENABLE_TAGS=true k6 run --out statsd --summary-time-unit=s k6.js
```
