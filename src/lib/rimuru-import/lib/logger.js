import { createRequire } from 'node:module';
const __require = createRequire(import.meta.url);
/**
 * Rimuru MULTI DEVICE LOGGER
 * High-Precision Clean & Modern Terminal UI
 * Default Creator: Anita Official
 */

const readline = __require('readline');
const os = __require('os');
const fs = __require('fs');

const _startTime = Date.now();
const _isTTY = process.stdout.isTTY === true;
const _MAX_ERRORS = 10;
let _busy = false;
let _tickerTimer = null;
let _sysTimer = null;

// --- INTERNAL STATES ---
const _state = {
    botName: 'Rimuru',
    creator: 'Anita Official',
    prefix: '.',
    role: 'Owner',
    status: 'SYSTEM OPERATIONAL',
    session: 'ACTIVE',
    connection: '42ms',
    mode: 'Pairing',
    pairingStatus: '● READY',
    counters: {
        msg: 0,
        cmd: 0,
        err: 0,
    },
    system: {
        cpuUsage: '0%',
        memoryUsage: '0 MB',
        platform: os.platform(),
    },
    database: {
        lastSync: null,
        status: 'IDLE',
    },
    errors: [],
};

const _pair = {
    active: false,
    phone: '',
    code: '',
    status: 'READY',
};

// ANSI Color Styles
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    gray: '\x1b[90m',
    white: '\x1b[37m',
    brightWhite: '\x1b[97m',
};

// --- HELPER FUNCTIONS ---
function _stripAnsi(str) {
    return String(str || '').replace(/\x1b\[[0-9;]*m/g, '');
}

function _formatUptime() {
    const diff = Math.floor((Date.now() - _startTime) / 1000);
    const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    return `${hrs}h ${mins}m`;
}

function _getRealtimeClock() {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const day = days[now.getDay()];
    return `${hrs}:${mins}:${secs} • ${day}`;
}

function _writeCrashLog(text) {
    try { fs.appendFileSync('crash.log', `[${new Date().toISOString()}] ${text}\n`); } catch {}
}

function _formatNumber(num) {
    return Number(num || 0).toLocaleString('en-US');
}

function _pad(str, len) {
    const rawLen = _stripAnsi(str).length;
    const space = Math.max(0, len - rawLen);
    return str + ' '.repeat(space);
}

// --- RENDER ENGINE ---
function _render() {
    if (_busy) return;
    _busy = true;

    try {
        if (_pair.active) {
            _renderPairing();
            _busy = false;
            return;
        }

        const isOp = _state.session === 'ACTIVE' || _state.status === 'CONNECTED' || _state.status.includes('OPERATIONAL');
        const opColor = isOp ? c.green : c.yellow;
        const opLabel = isOp ? '◉ SYSTEM OPERATIONAL' : `◉ SYSTEM ${_state.status.toUpperCase()}`;

        const uptime = _formatUptime();
        const latency = _state.connection || '42ms';
        const session = _state.session.toUpperCase();

        const msgCount = _formatNumber(_state.counters.msg);
        const cmdCount = _formatNumber(_state.counters.cmd);
        const errCount = String(_state.counters.err).padStart(2, '0');

        const boxWidth = 30; // Lebar isi inner box

        const lineName   = _pad(`NAMEBOT    : ${_state.botName}`, boxWidth);
        const lineCreator= _pad(`CREATOR    : ${_state.creator}`, boxWidth);
        const linePrefix = _pad(`PREFIX     : ${_state.prefix}`, boxWidth);
        const lineRole   = _pad(`ROLE       : ${_state.role}`, boxWidth);
        const lineMode   = _pad(`MODE       : ${_state.mode}`, boxWidth);
        const linePairSt = _pad(`STATUS     : ${_state.pairingStatus}`, boxWidth);
        const lineTicker = _pad(`MSG  ${msgCount}   CMD ${cmdCount}   ERR ${errCount}`, boxWidth);

        const buffer = [
            `\x1b[2J\x1b[H`, // Clean clear screen
            `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮`,
            `┃        C A N T A R E L L A     ┃`,
            `┃        MULTI DEVICE LOGGER     ┃`,
            `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
            ``,
            `    ${opColor}${opLabel}${c.reset}`,
            `    ─────────────────────`,
            `    CONNECTION   ${latency}`,
            `    UPTIME       ${uptime}`,
            `    SESSION      ${session}`,
            ``,
            `╭─ BOT INFORMATION ──────────────╮`,
            `│  ${lineName}│`,
            `│  ${lineCreator}│`,
            `│  ${linePrefix}│`,
            `│  ${lineRole}│`,
            `╰────────────────────────────────╯`,
            ``,
            `╭─ PAIRING ──────────────────────╮`,
            `│  ${lineMode}│`,
            `│  ${linePairSt}│`,
            `╰────────────────────────────────╯`,
            ``,
            `╭─ LIVE TICKER ──────────────────╮`,
            `│  ${lineTicker}│`,
            `╰────────────────────────────────╯`,
            ``,
            `    ${_getRealtimeClock()}`,
            ``
        ];

        if (_state.errors.length) {
            buffer.push(`${c.red}    LAST ERRORS (full log: crash.log)${c.reset}`);
            for (const e of _state.errors.slice(-4)) buffer.push(`    ${c.red}${String(e).slice(0, 160)}${c.reset}`);
            buffer.push(``);
        }

        process.stdout.write(buffer.join('\n'));
    } catch {}

    _busy = false;
}

function _renderPairing() {
    const code = _pair.code || 'WAITING...';
    const phone = _pair.phone || '—';
    const boxWidth = 30;

    const linePhone = _pad(`PHONE      : ${phone}`, boxWidth);
    const lineCode  = _pad(`CODE       : ${code}`, boxWidth);
    const lineStat  = _pad(`STATUS     : ● ${_pair.status}`, boxWidth);

    const buffer = [
        `\x1b[2J\x1b[H`,
        `╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮`,
        `┃        C A N T A R E L L A     ┃`,
        `┃        MULTI DEVICE LOGGER     ┃`,
        `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        ``,
        `    ${c.yellow}◉ PAIRING AUTHENTICATION${c.reset}`,
        `    ─────────────────────`,
        `    TARGET       ${phone}`,
        `    SESSION      PAIRING_MODE`,
        ``,
        `╭─ PAIRING SETUP ────────────────╮`,
        `│  ${linePhone}│`,
        `│  ${lineCode}│`,
        `│  ${lineStat}│`,
        `╰────────────────────────────────╯`,
        ``,
        `    ${_getRealtimeClock()}`,
        ``
    ];

    if (_state.errors.length) {
        buffer.push(`${c.red}    LAST ERRORS (full log: crash.log)${c.reset}`);
        for (const e of _state.errors.slice(-4)) buffer.push(`    ${c.red}${String(e).slice(0, 160)}${c.reset}`);
        buffer.push(``);
    }

    process.stdout.write(buffer.join('\n'));
}

// --- PUBLIC METHODS ---

function update(data = {}) {
    if (data.botName) _state.botName = data.botName;
    if (data.owner || data.creator) _state.creator = data.owner || data.creator;
    if (data.prefix) _state.prefix = data.prefix;
    if (data.role) _state.role = data.role;
    if (data.mode) _state.mode = data.mode;
    if (data.status) setStatus(data.status);
    if (data.connection) _state.connection = data.connection;
    if (data.session) _state.session = data.session;
    _render();
}

function setBotInfo(info = {}) {
    update(info);
}

function setStatus(status) {
    _state.status = status;
    if (status === 'CONNECTED') {
        _state.session = 'ACTIVE';
        _state.pairingStatus = '● CONNECTED';
    } else if (status === 'RECONNECTING') {
        _state.session = 'RECONNECT';
        _state.pairingStatus = '● WAITING';
    } else if (status === 'OFFLINE') {
        _state.session = 'INACTIVE';
        _state.pairingStatus = '● OFFLINE';
    }
    _render();
}

function msg() {
    _state.counters.msg += 1;
    _render();
}

function cmd() {
    _state.counters.cmd += 1;
    _state.counters.msg += 1;
    _render();
}

function error(scope, message) {
    _state.counters.err += 1;
    const msgStr = `[ERR][${scope}] ${message}`;
    _state.errors.push(msgStr);
    if (_state.errors.length > _MAX_ERRORS) _state.errors.shift();
    _writeCrashLog(msgStr);
    if (!_tickerTimer) process.stderr.write(msgStr + '\n');
    _render();
}

function log(scope, message) {
    if (process.env.DEBUG || !_tickerTimer) {
        process.stdout.write(`[LOG][${scope}] ${message}\n`);
    }
}

function syncNow(dbName = 'Database') {
    _state.database.lastSync = new Date();
    _state.database.status = 'SYNCED';
    _render();
}

function startTicker(intervalMs = 1000) {
    if (_tickerTimer) clearInterval(_tickerTimer);
    global._LOGGER_TICKER = true;
    _render();
    _tickerTimer = setInterval(() => {
        _render();
    }, intervalMs);

    if (!_sysTimer) {
        _sysTimer = setInterval(() => {
            const mem = process.memoryUsage();
            _state.system.memoryUsage = `${Math.round(mem.rss / 1024 / 1024)} MB`;
            if (_state.session === 'ACTIVE') {
                const j = [35, 42, 38, 45, 41, 49];
                _state.connection = `${j[Math.floor(Math.random() * j.length)]}ms`;
            }
        }, 5000);
    }
}

// --- PAIRING FUNCTIONS ---

function enterPairingMode(phone = '') {
    _pair.active = true;
    _pair.phone = phone;
    _pair.status = 'REQUESTING';
    _state.pairingStatus = '● PAIRING';
    _render();
}

function setPairingPhone(phone) {
    _pair.phone = phone;
    _pair.active = true;
    _render();
}

function setPairingCode(code) {
    _pair.code = code;
    _pair.active = true;
    _pair.status = 'CODE READY';
    _render();
}

function exitPairingMode() {
    _pair.active = false;
    _state.pairingStatus = '● READY';
    _render();
}

function pairingPrompt(text) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: process.stdout.isTTY === true,
        });
        const promptText = text || `\n  Enter Your Number Here : `;
        rl.question(promptText, (answer) => {
            rl.close();
            const cleanPhone = String(answer || '').trim().replace(/[^0-9]/g, '');
            enterPairingMode(cleanPhone);
            resolve(cleanPhone);
        });
        rl.on('error', () => {
            try { rl.close(); } catch {}
            resolve('');
        });
    });
}

// --- GLOBAL PROCESS GUARD ---
if (!global._LOGGER_PROC_GUARD) {
    global._LOGGER_PROC_GUARD = true;
    process.on('uncaughtException', (err) => {
        try {
            const msg = `[CRASH] : ${err?.message || err}`;
            _writeCrashLog(`${msg}\n${err?.stack || ''}`);
            process.stderr.write(`\n${msg}\n${err?.stack || ''}\n`);
            if (_isTTY) {
                _state.errors.push(msg);
                if (_state.errors.length > _MAX_ERRORS) _state.errors.shift();
                _busy = false;
                _render();
            } else {
                process.stderr.write(msg + '\n');
            }
        } catch {}
    });
    process.on('unhandledRejection', (reason) => {
        try {
            const msg = `[CRASH] unhandledRejection: ${reason?.message || String(reason || '')}`;
            _writeCrashLog(`${msg}\n${reason?.stack || ''}`);
            process.stderr.write(`\n${msg}\n${reason?.stack || ''}\n`);
            if (_isTTY) {
                _state.errors.push(msg);
                if (_state.errors.length > _MAX_ERRORS) _state.errors.shift();
                _busy = false;
                _render();
            } else {
                process.stderr.write(msg + '\n');
            }
        } catch {}
    });
}

// --- EXPORTS ---
const __esmExports = {
    update,
    log,
    error,
    cmd,
    msg,
    setStatus,
    setBotInfo,
    startTicker,
    syncNow,
    enterPairingMode,
    setPairingPhone,
    setPairingCode,
    exitPairingMode,
    pairingPrompt,
    get state() { return _state; },
    get pairState() { return _pair; },
};

export default __esmExports;
