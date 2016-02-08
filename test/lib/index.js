import test from 'tape';

import * as task from '../../lib/';

test('instrument: basic', t => {
    t.equal(
        typeof task.instrument,
        'function',
        '1st function'
    );

    t.equal(
        typeof task.instrument(),
        'function',
        '2nd function'
    );

    t.equal(
        typeof task.instrument()(),
        'function',
        '3rd function'
    );

    t.end();
});

test('report: basic', t => {
    t.equal(
        typeof task.report,
        'function',
        '1st function'
    );

    t.equal(
        typeof task.report(),
        'function',
        '2nd function'
    );

    t.equal(
        typeof task.report()(),
        'function',
        '3rd function'
    );

    t.end();
});

test('thresholds: basic', t => {
    t.equal(
        typeof task.thresholds,
        'function',
        '1st function'
    );

    t.equal(
        typeof task.thresholds(),
        'function',
        '2nd function'
    );

    t.equal(
        typeof task.thresholds()(),
        'function',
        '3rd function'
    );

    t.end();
});
