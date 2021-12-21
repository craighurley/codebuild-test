import http from 'k6/http';
import { sleep, group, check } from 'k6';
import { Trend } from 'k6/metrics';

let duration_search = new Trend('duration_search', true)
let duration_news = new Trend('duration_news', true)

export const options = {
    stages: [
        { target: 10, duration: '5s' },
        // { target: 20, duration: '5s' },
        // { target: 10, duration: '5s' },
    ],
    thresholds: {
        // 90% of requests must finish within 3s.
        duration_search: ['p(90) < 3000'],
        duration_news: ['p(90) < 3000'],
        http_req_duration: ['p(90) < 3000'],
    },
    summaryTimeUnit: 's',
    summaryTrendStats: ['min', 'max', 'avg', 'p(90)', 'count'],
};

export default function () {
    let params = {
        compression: 'gzip'
    };

    group('search', function () {
        const res = http.get('https://www.google.com/', params);
        duration_search.add(res.timings.duration);
        const checkRes = check(res, {
            'status is 200': (r) => r.status === 200,
            'response body': (r) => r.body.indexOf('Google offered in') !== -1,
        });
    });

    group('news', function () {
        const res = http.get('https://www.stuff.co.nz/', params);
        duration_news.add(res.timings.duration);
        const checkRes = check(res, {
            'status is 200': (r) => r.status === 200,
            'response body': (r) => r.body.indexOf('Breaking news') !== -1,
        });
    });

    sleep(1);
}
