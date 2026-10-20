import { createRequire } from 'node:module';
const __require = createRequire(import.meta.url);
'use strict';

import db from './database.js';

function record(jid, event, meta) {
    db.addTimeline(jid, {
        ts:    Date.now(),
        event: event,
        meta:  meta || null,
    });
}

function ensureClient(jid) {
    if (!db.getClient(jid)) {
        db.upsertClient(jid, { score: 0, level: 'CLEAN' });
    }
}

function getTimeline(jid) {
    const c = db.getClient(jid);
    return c ? (c.timeline || []) : [];
}

function getMessageFrequency(jid, windowMs) {
    const timeline = getTimeline(jid);
    const cutoff   = Date.now() - (windowMs || 3600000);
    return timeline.filter(e => e.ts >= cutoff && e.event === 'message').length;
}

const __esmExports = { record, ensureClient, getTimeline, getMessageFrequency };

export default __esmExports;
