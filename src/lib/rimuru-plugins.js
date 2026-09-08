import fs from "fs";
import path from "path";
import { theme, chalk, logger } from "./rimuru-logger.js";
import { createLegacyPlugin } from "./rimuru-legacy.js";
/**
 * @typedef {Object} PluginConfig
 * @property {string} name - Nama command (tanpa prefix)
 * @property {string[]} alias - Array alias untuk command
 * @property {string} category - Kategori plugin (owner, main, utility, fun, dll)
 * @property {string} description - Deskripsi singkat command
 * @property {string} usage - Cara penggunaan command
 * @property {string} example - Contoh penggunaan command
 * @property {boolean} isOwner - Apakah command khusus owner
 * @property {boolean} isPremium - Apakah command khusus premium user
 * @property {boolean} isGroup - Apakah command hanya untuk group
 * @property {boolean} isPrivate - Apakah command hanya untuk private chat
 * @property {boolean} isAdmin - Apakah command memerlukan admin group
 * @property {boolean} isBotAdmin - Apakah bot harus jadi admin
 * @property {number} cooldown - Cooldown dalam detik
 * @property {number} limit - Jumlah limit yang digunakan per eksekusi
 * @property {boolean} isEnabled - Apakah plugin aktif
 */

/**
 * @typedef {Object} Plugin
 * @property {PluginConfig} config - Konfigurasi plugin
 * @property {PluginHandler} handler - Fungsi handler plugin
 */

/**
 * @callback PluginHandler
 * @param {Object} m - Serialized message object
 * @param {Object} params - Parameter tambahan
 * @param {Object} params.sock - Socket connection Baileys
 * @param {Object} params.store - Data store
 * @param {Object} params.config - Bot configuration
 * @param {Object} params.plugins - All loaded plugins
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} PluginStore
 * @property {Map<string, Plugin>} commands - Map command name ke plugin
 * @property {Map<string, string>} aliases - Map alias ke command name
 * @property {Map<string, Plugin[]>} categories - Map category ke array plugins
 */

/**
 * Collection untuk menyimpan semua plugins
 * @type {PluginStore}
 */
const pluginStore = {
  commands: new Map(),
  aliases: new Map(),
  categories: new Map(),
  legacyHooks: [],
};

/**
 * Default config untuk plugin
 * @type {PluginConfig}
 */
const defaultConfig = {
  name: "",
  alias: [],
  category: "uncategorized",
  description: "No description",
  usage: "",
  example: "",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  isAdmin: false,
  isBotAdmin: false,
  cooldown: 3,
  limit: 1,
  isEnabled: true,
};

const normalizePluginNames = (name) => {
  const values = Array.isArray(name) ? name : [name];
  return values
    .map((item) =>
      String(item || "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);
};

const normalizePluginAliases = (alias) => {
  const values = Array.isArray(alias) ? alias : alias ? [alias] : [];
  return values
    .map((item) =>
      String(item || "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);
};

const findRegisteredPluginByFilePath = (filePath) => {
  if (!filePath) {
    return null;
  }
  const resolvedFilePath = path.resolve(filePath);
  for (const plugin of new Set(pluginStore.commands.values())) {
    if (
      plugin?.filePath &&
      path.resolve(plugin.filePath) === resolvedFilePath
    ) {
      return plugin;
    }
  }
  return null;
};

const removePluginFromStore = (plugin) => {
  if (!plugin?.config) {
    return false;
  }
  const names = normalizePluginNames(plugin.config.name);
  const aliases = normalizePluginAliases(plugin.config.alias);
  const category = String(plugin.config.category || "").toLowerCase();
  for (const name of names) {
    pluginStore.commands.delete(name);
  }
  for (const alias of aliases) {
    pluginStore.aliases.delete(alias);
  }
  const categoryPlugins = pluginStore.categories.get(category);
  if (categoryPlugins) {
    const index = categoryPlugins.findIndex((item) => item === plugin);
    if (index !== -1) {
      categoryPlugins.splice(index, 1);
    }
  }
  return true;
};

/**
 * Memuat satu plugin dari file
 * @param {string} filePath - Path ke file plugin
 * @returns {Plugin|null} Plugin object atau null jika gagal
 * @example
 * const plugin = await loadPlugin('./plugins/main/ping.js');
 */
import { pathToFileURL } from "url";



const wrapFeatureCreditHandler = (handler, featureCredit) => {
  if (typeof handler !== "function" || !featureCredit) return handler;

  const MEDIA_KEYS = ["image", "video", "document"];
  const hasMedia = (payload) =>
    payload && typeof payload === "object" && MEDIA_KEYS.some((key) => key in payload);
  const creditText = String(featureCredit);
  const addCredit = (caption) => {
    const text = String(caption ?? "");
    if (text.includes("Fitur By: Anita Putri Azzahra") && text.includes("anita.putri.azzah1")) return text;
    return text ? `${text}\n\n${creditText}` : creditText;
  };

  const decorate = (m, sock) => {
    if (!m || !sock) return { m, sock };
    const wrappedSock = new Proxy(sock, {
      get(target, prop, receiver) {
        const original = Reflect.get(target, prop, receiver);
        if (typeof original !== "function") return original;
        if (prop === "sendMessage") {
          return async function (jid, content, options) {
            if (hasMedia(content) || (content && typeof content === "object" && "text" in content)) {
              const next = { ...content };
              if (hasMedia(next) && ("caption" in next || next.image || next.video || next.document)) next.caption = addCredit(next.caption);
              else if ("text" in next) next.text = addCredit(next.text);
              content = next;
            }
            return original.call(target, jid, content, options);
          };
        }
        if (prop === "sendMedia") {
          return async function (jid, source, caption = "", quoted, options = {}) {
            return original.call(target, jid, source, addCredit(caption), quoted, options);
          };
        }
        if (prop === "sendFile") {
          return async function (jid, input, options = {}) {
            const next = { ...options };
            const mime = String(next.mimetype || "");
            const filename = String(next.filename || "").toLowerCase();
            const isMedia = mime.startsWith("image/") || mime.startsWith("video/") || mime.startsWith("application/pdf") || /\.(?:jpe?g|png|gif|webp|mp4|mov|mkv|pdf)$/i.test(filename);
            if (isMedia || "caption" in next) next.caption = addCredit(next.caption);
            return original.call(target, jid, input, next);
          };
        }
        if (prop === "sendButton") {
          return async function (jid, source, text = null, quoted, options = {}) {
            const hasSource = source !== null && source !== undefined;
            return original.call(target, jid, source, hasSource ? addCredit(text) : text, quoted, options);
          };
        }
        return original.bind(target);
      },
    });

    const wrappedMessage = new Proxy(m, {
      get(target, prop, receiver) {
        if (prop === "reply") {
          return async function (text, ...args) {
            const value = typeof text === "string" ? addCredit(text) : text;
            return target.reply.call(target, value, ...args);
          };
        }
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
      },
    });
    return { m: wrappedMessage, sock: wrappedSock };
  };

  return async function wrappedFeatureHandler(m, ctx = {}) {
    const { m: wrappedM, sock: wrappedSock } = decorate(m, ctx.sock || ctx.conn);
    const nextCtx = { ...ctx, m: wrappedM, sock: wrappedSock };
    if (ctx.conn) nextCtx.conn = wrappedSock;
    return handler(wrappedM, nextCtx);
  };
};

async function loadPlugin(filePath, bustCache = false) {
  try {
    const fileUrl =
      pathToFileURL(path.resolve(filePath)).href +
      (bustCache ? "?t=" + Date.now() : "");
    let plugin = await import(fileUrl);

    if ((!plugin.config || !plugin.handler) && plugin.default) {
      plugin = plugin.default;
    }

    // Compatibility for Megami/old-style plugins: default-exported function
    // with handler.command/help/tags instead of Rimuru's { config, handler }.
    if (typeof plugin === "function" && !plugin.config && !plugin.handler &&
        (plugin.command || plugin.help || plugin.tags)) {
      const legacyPlugin = createLegacyPlugin(plugin, filePath);
      legacyPlugin.featureCredit = plugin.FEATURE_CREDIT || plugin.default?.FEATURE_CREDIT || null;
      legacyPlugin.handler = wrapFeatureCreditHandler(legacyPlugin.handler, legacyPlugin.featureCredit);
      return legacyPlugin;
    }

    if (!plugin.config || !plugin.handler) {
      return null;
    }

    if (typeof plugin.handler !== "function") {
      return null;
    }

    const makePluginInfo = (entry, inheritedCredit = null) => {
      if (!entry || !entry.config || typeof entry.handler !== "function") return null;
      const featureCredit = entry.FEATURE_CREDIT || inheritedCredit || entry.config?.credit || null;
      const info = {
        config: { ...defaultConfig, ...entry.config },
        handler: wrapFeatureCreditHandler(entry.handler, featureCredit),
        featureCredit,
        filePath,
      };
      if (!info.config.name) {
        info.config.name = path.basename(filePath, path.extname(filePath));
      }
      if (typeof entry.replyHandler === "function") info.replyHandler = entry.replyHandler;
      if (entry.fileRole) info.fileRole = entry.fileRole;
      return info;
    };

    const featureCredit = plugin.FEATURE_CREDIT || plugin.default?.FEATURE_CREDIT || plugin.handler?.FEATURE_CREDIT || plugin.config?.credit || null;
    const pInfo = makePluginInfo(plugin, featureCredit);
    if (!pInfo) return null;

    if (Array.isArray(plugin.plugins)) {
      pInfo.extraPlugins = plugin.plugins
        .map((entry) => makePluginInfo(entry, featureCredit))
        .filter(Boolean);
    }

    return pInfo;
  } catch (error) {
    const fileName = path.basename(filePath);
    if (process.env.DEBUG_PLUGINS === "true" || true) {
      logger.error("plugin", `failed ${fileName} - ${error.message}`);
    }
    return null;
  }
}

/**
 * Mendaftarkan plugin ke store
 * @param {Plugin} plugin - Plugin untuk didaftarkan
 * @returns {boolean} True jika berhasil
 */
function registerPlugin(plugin) {
  if (!plugin || !plugin.config || !plugin.config.name) {
    return false;
  }

  const { name, alias, category } = plugin.config;

  const names = normalizePluginNames(name);
  const aliases = normalizePluginAliases(alias);
  const primaryName = names[0];
  if (!primaryName) {
    return false;
  }

  for (const n of names) {
    if (!pluginStore.commands.has(n) && !pluginStore.aliases.has(n)) {
      pluginStore.commands.set(n, plugin);
    }
  }

  for (const a of aliases) {
    if (!pluginStore.commands.has(a) && !pluginStore.aliases.has(a)) {
      pluginStore.aliases.set(a, primaryName);
    }
  }

  const categoryLower = String(
    category || defaultConfig.category,
  ).toLowerCase();
  if (!pluginStore.categories.has(categoryLower)) {
    pluginStore.categories.set(categoryLower, []);
  }
  pluginStore.categories.get(categoryLower).push(plugin);

  return true;
}

function printPluginTable(plugins) {
  if (plugins.length === 0) return;

  const safeStr = (str) => {
    if (Array.isArray(str)) return str[0] || "";
    return String(str || "");
  };

  const grouped = {};
  plugins.forEach((p) => {
    const cat = safeStr(p.category);
    if (!grouped[cat]) grouped[cat] = 0;
    grouped[cat]++;
  });

  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const catCount = sorted.length;
  const TOP = 8;
  const top = sorted.slice(0, TOP);
  const rest = sorted.slice(TOP);
  const restTotal = rest.reduce((s, [, c]) => s + c, 0);

  const COL_W = 25;
  const pad = (cat, count, index) => {
    const label = String(cat).padEnd(12);
    return `${theme.colorizeCategory(label, index)} ${theme.pill(String(count), "accent")}`.padEnd(
      COL_W + 12,
    );
  };

  console.log("");
  console.log(
    `  ${theme.pill("plugins", "primary")} ${theme.rainbow(String(plugins.length))} ${theme.dim("total")} ${theme.border("│")} ${chalk.whiteBright(`${catCount} kategori`)}`,
  );
  console.log(`  ${theme.borderFx("─".repeat(58))}`);

  for (let i = 0; i < top.length; i += 2) {
    const left = pad(top[i][0], top[i][1], i);
    const right =
      i + 1 < top.length ? pad(top[i + 1][0], top[i + 1][1], i + 1) : "";
    console.log(`  ${left}  ${theme.border("│")}  ${right}`);
  }

  if (rest.length > 0) {
    console.log(
      `  ${theme.dim(`+${rest.length} lainnya`.padEnd(14))}${theme.pill(String(restTotal), "system")}`,
    );
  }

  console.log("");
}

/**
 * Memuat semua plugins dari directory
 * @param {string} pluginsDir - Path ke directory plugins
 * @returns {number} Jumlah plugin yang berhasil dimuat
 * @example
 * const count = loadPlugins('./rimuru-plugins');
 * console.log(`Loaded ${count} plugins`);
 */
async function loadPlugins(pluginsDir) {
  pluginStore.commands.clear();
  pluginStore.aliases.clear();
  pluginStore.categories.clear();
  pluginStore.legacyHooks.length = 0;
  global.__legacyPlugins = {};

  let loadedCount = 0;
  const loadedPlugins = [];

  if (!fs.existsSync(pluginsDir)) {
    logger.warn("plugin", `directory not found: ${pluginsDir}`);
    return 0;
  }

  const categories = fs.readdirSync(pluginsDir);

  for (const category of categories) {
    const categoryPath = path.join(pluginsDir, category);

    if (!fs.statSync(categoryPath).isDirectory()) {
      if (category.endsWith(".js") && category !== "_index.js") {
        const plugin = await loadPlugin(categoryPath);
        if (plugin) {
          const entries = [plugin, ...(plugin.extraPlugins || [])];
          for (const entry of entries) {
            if (!entry) continue;
            if (entry.config && (!entry.config.category || entry.config.category === "uncategorized")) entry.config.category = "uncategorized";
            if (registerPlugin(entry)) {
              loadedCount++;
              loadedPlugins.push({ name: entry.config.name, category: entry.config.category || "uncategorized" });
            }
          }
        }
      }
      continue;
    }

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (!file.endsWith(".js") || file.startsWith("_")) continue;

      const filePath = path.join(categoryPath, file);
      const plugin = await loadPlugin(filePath);

      if (plugin) {
        const entries = [plugin, ...(plugin.extraPlugins || [])];
        for (const entry of entries) {
          if (!entry) continue;
          if (!entry.config.category || entry.config.category === "uncategorized") {
            entry.config.category = category;
          }
          if (registerPlugin(entry)) {
            loadedCount++;
            loadedPlugins.push({ name: entry.config.name, category: entry.config.category });
          }
        }
      }
    }
  }

  printPluginTable(loadedPlugins);
  return loadedCount;
}

/**
 * Mendapatkan plugin berdasarkan nama atau alias
 * @param {string} name - Nama command atau alias
 * @returns {Plugin|null} Plugin object atau null jika tidak ditemukan
 * @example
 * const plugin = getPlugin('menu');
 * if (plugin) {
 *   await plugin.handler(m, { sock, config });
 * }
 */
function getPlugin(name) {
  if (!name) return null;

  const nameLower = name.toLowerCase();

  if (pluginStore.commands.has(nameLower)) {
    return pluginStore.commands.get(nameLower);
  }

  if (pluginStore.aliases.has(nameLower)) {
    const commandName = pluginStore.aliases.get(nameLower);
    return pluginStore.commands.get(commandName);
  }

  return null;
}

/**
 * Mendapatkan semua plugins dalam kategori tertentu
 * @param {string} category - Nama kategori
 * @returns {Plugin[]} Array plugins dalam kategori
 * @example
 * const ownerPlugins = getPluginsByCategory('owner');
 */
function getPluginsByCategory(category) {
  if (!category) return [];
  return pluginStore.categories.get(category.toLowerCase()) || [];
}

/**
 * Mendapatkan semua kategori yang ada
 * @returns {string[]} Array nama kategori
 * @returns {string[]} Array nama kategori
 */
function getCategories() {
  return Array.from(pluginStore.categories.keys());
}

/**
 * Mendapatkan semua plugins
 * @returns {Plugin[]} Array semua plugins
 */
function getAllPlugins() {
  return Array.from(new Set(pluginStore.commands.values()));
}

/**
 * Mendapatkan total jumlah plugins
 * @returns {number} Total plugins
 */
function getPluginCount() {
  return pluginStore.commands.size;
}

/**
 * Mendapatkan semua nama command dan alias as array (Cached)
 * @returns {string[]}
 */
function getAllCommandNames() {
  return [...pluginStore.commands.keys(), ...pluginStore.aliases.keys()];
}

/**
 * Mendapatkan daftar command per kategori untuk menu
 * @returns {Object<string, string[]>} Object dengan key kategori dan value array command names
 */
function getCommandsByCategory() {
  const result = {};

  for (const [category, plugins] of pluginStore.categories.entries()) {
    const seen = new Set();
    result[category] = [];

    for (const p of plugins) {
      if (!p?.config?.isEnabled) continue;

      const names = Array.isArray(p.config.name)
        ? p.config.name
        : [p.config.name];

      for (const rawName of names) {
        const name = String(rawName || '').trim().toLowerCase();
        if (!name || seen.has(name)) continue;

        // Only count commands that are actually registered and executable.
        // This prevents a duplicate plugin file from inflating menu totals.
        const registered = pluginStore.commands.get(name);
        if (registered !== p) continue;

        seen.add(name);
        result[category].push(name);
      }
    }
  }

  return result;
}

/**
 * Mendapatkan info plugin untuk help
 * @param {string} name - Nama command
 * @returns {Object|null} Info plugin atau null
 */
function getPluginInfo(name) {
  const plugin = getPlugin(name);
  if (!plugin) return null;

  const { config } = plugin;

  return {
    name: config.name,
    alias: config.alias,
    category: config.category,
    description: config.description,
    usage: config.usage,
    example: config.example,
    isOwner: config.isOwner,
    isPremium: config.isPremium,
    cooldown: config.cooldown,
  };
}

/**
 * Reload single plugin
 * @param {string} name - Nama command untuk reload
 * @returns {boolean} True jika berhasil
 */
function reloadPlugin(name) {
  const plugin = getPlugin(name);
  if (!plugin || !plugin.filePath) return false;

  const category = plugin.config.category;

  pluginStore.commands.delete(name.toLowerCase());

  for (const alias of plugin.config.alias || []) {
    pluginStore.aliases.delete(alias.toLowerCase());
  }

  const categoryPlugins = pluginStore.categories.get(category.toLowerCase());
  if (categoryPlugins) {
    const index = categoryPlugins.findIndex((p) => p.config.name === name);
    if (index !== -1) {
      categoryPlugins.splice(index, 1);
    }
  }

  const newPlugin = loadPlugin(plugin.filePath);
  if (newPlugin && registerPlugin(newPlugin)) {
    logger.success("plugin", `reloaded: ${name}`);
    return true;
  }

  return false;
}

/**
 * Disable plugin
 * @param {string} name - Nama command untuk disable
 * @returns {boolean} True jika berhasil
 */
function disablePlugin(name) {
  const plugin = getPlugin(name);
  if (!plugin) return false;

  plugin.config.isEnabled = false;
  return true;
}

/**
 * Enable plugin
 * @param {string} name - Nama command untuk enable
 * @returns {boolean} True jika berhasil
 */
function enablePlugin(name) {
  const plugin = getPlugin(name);
  if (!plugin) return false;

  plugin.config.isEnabled = true;
  return true;
}

/**
 * Cek apakah plugin aktif
 * @param {string} name - Nama command
 * @returns {boolean} True jika plugin aktif
 */
function isPluginEnabled(name) {
  const plugin = getPlugin(name);
  return plugin ? plugin.config.isEnabled : true;
}

async function hotReloadPlugin(filePath, categoryOverride = null) {
  try {
    const plugin = await loadPlugin(filePath, true);
    if (!plugin) return { success: false, error: "Failed to load plugin" };

    const entries = [plugin, ...(plugin.extraPlugins || [])];
    if (categoryOverride) {
      for (const entry of entries) entry.config.category = String(categoryOverride).toLowerCase();
    }

    // Remove every command originating from this bundled file.
    for (const existing of new Set(pluginStore.commands.values())) {
      if (existing?.filePath && path.resolve(existing.filePath) === path.resolve(filePath)) {
        removePluginFromStore(existing);
      }
    }

    let registered = 0;
    let firstName = "";
    for (const entry of entries) {
      if (registerPlugin(entry)) {
        registered++;
        if (!firstName) firstName = normalizePluginNames(entry.config.name)[0] || "";
      }
    }

    if (registered) {
      logger.success("plugin", `hot reloaded: ${firstName}${entries.length > 1 ? ` (+${registered - 1} bundled)` : ""}`);
      return { success: true, name: firstName, count: registered };
    }

    return { success: false, error: "Failed to register plugin" };
  } catch (error) {
    logger.error("plugin", `hot reload error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function unloadPlugin(name) {
  try {
    const nameLower = name.toLowerCase();
    let plugin = pluginStore.commands.get(nameLower);

    if (!plugin) {
      const commandName = pluginStore.aliases.get(nameLower);
      if (commandName) {
        plugin = pluginStore.commands.get(commandName);
      }
    }

    if (!plugin && /[\\/]/.test(name)) {
      plugin = findRegisteredPluginByFilePath(name);
    }

    if (!plugin) {
      return { success: false, error: "Plugin not found" };
    }

    const names = normalizePluginNames(plugin.config.name);
    const primaryName = names[0] || nameLower;

    removePluginFromStore(plugin);

    if (plugin.filePath) {
      try {
        // require.cache removed
      } catch {}
    }

    logger.warn("plugin", `unloaded: ${primaryName}`);
    return { success: true, name: primaryName };
  } catch (error) {
    logger.error("plugin", `unload error: ${error.message}`);
    return { success: false, error: error.message };
  }
}


function getLegacyHooks() {
  return pluginStore.legacyHooks;
}

export {
  loadPlugin,
  loadPlugins,
  registerPlugin,
  getPlugin,
  getPluginsByCategory,
  getCategories,
  getAllPlugins,
  getPluginCount,
  getCommandsByCategory,
  getPluginInfo,
  reloadPlugin,
  disablePlugin,
  enablePlugin,
  isPluginEnabled,
  hotReloadPlugin,
  unloadPlugin,
  getLegacyHooks,
  pluginStore,
  defaultConfig,
  getAllCommandNames,
};
