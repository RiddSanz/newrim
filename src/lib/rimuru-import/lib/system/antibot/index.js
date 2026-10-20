import { createRequire } from 'node:module';
const __require = createRequire(import.meta.url);
'use strict';

import core from './core.js';
import db from './database.js';
import reporter from './reporter.js';
import behavior from './behaviorTracker.js';

function init(ownerNotifyFn) {
    if (ownerNotifyFn) reporter.setNotifyFn(ownerNotifyFn);
    db.cleanOld(7);
    console.log('[AntiBot] ✅ System initialized');
}

const __esmExports = {
    init,
    scan:            core.scan,
    manualScan:      core.manualScan,
    setNotifyFn:     reporter.setNotifyFn,
    generateReport:  reporter.generateDailyReport,
    isWhitelisted:   db.isWhitelisted,
    isBlacklisted:   db.isBlacklisted,
    setWhitelist:    db.setWhitelist,
    setBlacklist:    db.setBlacklist,
    getGroupConfig:  db.getGroupConfig,
    setGroupConfig:  db.setGroupConfig,
    getSuspects:     db.getSuspects,
    getClient:       db.getClient,
    getTimeline:     behavior.getTimeline,
    getDB:           db.getDB,
};

export default __esmExports;
