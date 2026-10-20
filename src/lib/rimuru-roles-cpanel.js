import fs from 'fs';
import path from 'path';
import { isLid, lidToJid } from './rimuru-lid.js';

const CPANEL_DIR = path.join(process.cwd(), 'database', 'cpanel');
const LEGACY_SELLER_PATH = path.join(CPANEL_DIR, 'legacy_sellers.json');
const VALID_SERVERS = ['v1', 'v2', 'v3', 'v4', 'v5'];
const VALID_ROLES = ['owner', 'ceo', 'reseller'];
const ROLE_RANK = { reseller: 1, ceo: 2, owner: 3 };

function ensureDir() {
  if (!fs.existsSync(CPANEL_DIR)) fs.mkdirSync(CPANEL_DIR, { recursive: true });
}

function getFilePath(role, server) {
  return path.join(CPANEL_DIR, `${role}_${server}.json`);
}

function cleanNumber(jid) {
  if (!jid) return null;
  let value = String(jid);
  if (isLid(value)) {
    value = lidToJid(value) || '';
    if (!value || isLid(value)) return null;
  }
  let number = value.replace(/@.*$/, '').replace(/[^0-9]/g, '');
  if (number.startsWith('0')) number = `62${number.slice(1)}`;
  return number || null;
}

function loadRoleFile(role, server) {
  ensureDir();
  const filePath = getFilePath(role, server);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(data) ? data.map(cleanNumber).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveRoleFile(role, server, data) {
  ensureDir();
  fs.writeFileSync(getFilePath(role, server), JSON.stringify([...new Set(data.map(cleanNumber).filter(Boolean))], null, 2), 'utf8');
}

function readLegacyData() {
  try {
    const data = JSON.parse(fs.readFileSync(LEGACY_SELLER_PATH, 'utf8'));
    return {
      sellers: Array.isArray(data?.sellers) ? data.sellers.map(cleanNumber).filter(Boolean) : [],
      ownerPanels: Array.isArray(data?.ownerPanels) ? data.ownerPanels.map(cleanNumber).filter(Boolean) : [],
    };
  } catch {
    return { sellers: [], ownerPanels: [] };
  }
}

function isOwnerPanel(jid) {
  const number = cleanNumber(jid);
  if (!number) return false;
  return readLegacyData().ownerPanels.includes(number);
}

function isLegacySeller(jid, server) {
  if (!['v1', 'v2', 'v3'].includes(server)) return false;
  const number = cleanNumber(jid);
  if (!number) return false;
  return readLegacyData().sellers.includes(number);
}

function getPanelAccessRole(jid, server) {
  if (!VALID_SERVERS.includes(server)) return null;
  if (isOwnerPanel(jid)) return 'Owner Panel';
  const role = getUserRole(jid, server);
  if (role) return role;
  if (isLegacySeller(jid, server)) return 'Seller';
  return null;
}

function getRoles(server) {
  if (!VALID_SERVERS.includes(server)) return null;
  return {
    owners: loadRoleFile('owner', server),
    ceos: loadRoleFile('ceo', server),
    resellers: loadRoleFile('reseller', server),
  };
}

function hasRole(jid, server, allowedRoles = ['owner', 'ceo', 'reseller']) {
  if (!VALID_SERVERS.includes(server)) return false;
  const number = cleanNumber(jid);
  if (!number) return false;
  for (const role of allowedRoles) {
    if (!VALID_ROLES.includes(role)) continue;
    if (loadRoleFile(role, server).includes(number)) return true;
  }
  return false;
}

function getUserRole(jid, server) {
  if (!VALID_SERVERS.includes(server)) return null;
  const number = cleanNumber(jid);
  if (!number) return null;
  for (const role of VALID_ROLES) {
    if (loadRoleFile(role, server).includes(number)) return role;
  }
  return null;
}

function addRole(jid, server, role) {
  if (!VALID_SERVERS.includes(server)) return { success: false, error: 'Server tidak valid' };
  if (!VALID_ROLES.includes(role)) return { success: false, error: 'Role tidak valid' };
  const number = cleanNumber(jid);
  if (!number || number.length < 8 || number.length > 15) return { success: false, error: 'Nomor tidak valid' };
  const existingRole = getUserRole(number, server);
  if (existingRole) return { success: false, error: `Sudah memiliki role ${existingRole} di ${server.toUpperCase()}` };
  const list = loadRoleFile(role, server);
  if (list.includes(number)) return { success: false, error: 'Sudah terdaftar' };
  list.push(number);
  saveRoleFile(role, server, list);
  return { success: true, number, role, server };
}

function removeRole(jid, server, role) {
  if (!VALID_SERVERS.includes(server)) return { success: false, error: 'Server tidak valid' };
  if (!VALID_ROLES.includes(role)) return { success: false, error: 'Role tidak valid' };
  const number = cleanNumber(jid);
  if (!number) return { success: false, error: 'Nomor tidak valid' };
  const list = loadRoleFile(role, server);
  const idx = list.indexOf(number);
  if (idx === -1) return { success: false, error: 'Tidak terdaftar' };
  list.splice(idx, 1);
  saveRoleFile(role, server, list);
  return { success: true, number, role, server };
}

function listByRole(server, role) {
  if (!VALID_SERVERS.includes(server) || !VALID_ROLES.includes(role)) return [];
  return loadRoleFile(role, server);
}

function getAccessibleServers(jid) {
  const number = cleanNumber(jid);
  if (!number) return [];
  const legacy = readLegacyData();
  const isPanelOwner = legacy.ownerPanels.includes(number);
  const isSeller = legacy.sellers.includes(number);
  const accessible = [];
  for (const server of VALID_SERVERS) {
    if (isPanelOwner) {
      accessible.push({ server, role: 'ownerPanel' });
      continue;
    }
    const role = getUserRole(number, server);
    if (role) {
      accessible.push({ server, role });
      continue;
    }
    if (isSeller && ['v1', 'v2', 'v3'].includes(server)) accessible.push({ server, role: 'seller' });
  }
  return accessible;
}

function hasAccessToServer(jid, server, isOwner = false) {
  if (!VALID_SERVERS.includes(server)) return false;
  if (isOwner || isOwnerPanel(jid)) return true;
  return hasRole(jid, server, ['owner', 'ceo', 'reseller']) || isLegacySeller(jid, server);
}

function hasFullAccess(jid, server, isOwner = false) {
  if (!VALID_SERVERS.includes(server)) return false;
  if (isOwner || isOwnerPanel(jid)) return true;
  return hasRole(jid, server, ['owner', 'ceo']);
}

function canManageRole(jid, server, targetRole, isOwner = false) {
  if (!VALID_SERVERS.includes(server) || !VALID_ROLES.includes(targetRole)) return false;
  if (isOwner || isOwnerPanel(jid)) return true;
  const userRole = getUserRole(jid, server);
  if (!userRole) return false;
  return ROLE_RANK[userRole] > ROLE_RANK[targetRole];
}

function canViewRole(jid, server, targetRole, isOwner = false) {
  if (!VALID_SERVERS.includes(server) || !VALID_ROLES.includes(targetRole)) return false;
  if (isOwner || isOwnerPanel(jid)) return true;
  const userRole = getUserRole(jid, server);
  if (!userRole) return false;
  return ROLE_RANK[userRole] >= ROLE_RANK[targetRole];
}

function getAllRolesForUser(jid) {
  const number = cleanNumber(jid);
  if (!number) return [];
  const roles = [];
  for (const server of VALID_SERVERS) {
    const role = getUserRole(number, server);
    if (role) roles.push({ server, role });
  }
  return roles;
}

function initializeFiles() {
  ensureDir();
  for (const server of VALID_SERVERS) {
    for (const role of VALID_ROLES) {
      const filePath = getFilePath(role, server);
      if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf8');
    }
    const gcPath = path.join(CPANEL_DIR, `gcseller_${server}.json`);
    if (!fs.existsSync(gcPath)) fs.writeFileSync(gcPath, 'null', 'utf8');
  }
}

initializeFiles();

export {
  VALID_SERVERS, VALID_ROLES, getRoles, hasRole, getUserRole, addRole,
  removeRole, listByRole, getAccessibleServers, hasAccessToServer,
  hasFullAccess, canManageRole, canViewRole, getAllRolesForUser,
  cleanNumber, getPanelAccessRole, isOwnerPanel, isLegacySeller,
};
