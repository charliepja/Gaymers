const Database = require('better-sqlite3');
const db = new Database('settings.sqlite');

const tables = new Map();

tables.set('servers', 'id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL UNIQUE, prefix TEXT NOT NULL DEFAULT "!"');
tables.set('modules', 'module_id INTEGER PRIMARY KEY AUTOINCREMENT, module_name TEXT NOT NULL UNIQUE');
tables.set('commands', 'command_id INTEGER PRIMARY KEY AUTOINCREMENT, command_name TEXT NOT NULL UNIQUE, module_id TEXT NOT NULL REFERENCES modules (module_id) ON DELETE CASCADE');
tables.set('server_modules', 'id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL REFERENCES servers (guild_id) ON DELETE CASCADE, module_id TEXT NOT NULL REFERENCES modules (module_id) ON DELETE CASCADE, enabled INTEGER NOT NULL DEFAULT 1');
tables.set('server_commands', 'id INTEGER PRIMARY KEY AUTOINCREMENT, command_id TEXT NOT NULL REFERENCES commands (command_id) ON DELETE CASCADE, guild_id TEXT NOT NULL REFERENCES servers (guild_id) ON DELETE CASCADE, blacklist INTEGER NOT NULL DEFAULT 0, whitelist INTEGER NOT NULL DEFAULT 0');
tables.set('server_settings', 'id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT NOT NULL REFERENCES servers (guild_id) ON DELETE CASCADE, setting_name TEXT NOT NULL, setting_value TEXT NOT NULL');

for(const [key, value] of tables.entries()) {
	db.prepare(`CREATE TABLE IF NOT EXISTS ${key} (${value});`).run();
}
db.pragma('synchronous = 1');
db.pragma('journal_mode = WAL');

module.exports = db;
