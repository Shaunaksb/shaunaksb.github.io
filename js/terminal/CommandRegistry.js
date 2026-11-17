/**
 * Registry storing terminal command descriptors and enforcing a uniform command contract.
 */
export class CommandRegistry {
    constructor() {
        this.commands = new Map();
    }

    /**
     * Registers a command descriptor.
     * @param {{
     *   name: string,
     *   description?: string,
     *   usage?: string,
     *   usageCommand?: string,
     *   includeInAllInfo?: boolean,
     *   execute: (args: string[], terminalApi: object) => (void|Promise<void>)
     * }} commandConfig
     */
    register(commandConfig) {
        if (!commandConfig || typeof commandConfig.name !== 'string' || !commandConfig.name.trim()) {
            throw new Error('Command registration requires a non-empty string name.');
        }
        if (typeof commandConfig.execute !== 'function') {
            throw new Error(`Command "${commandConfig.name}" must provide an execute function.`);
        }

        const normalizedName = commandConfig.name.trim().toLowerCase();
        this.commands.set(normalizedName, {
            name: normalizedName,
            description: commandConfig.description || '',
            usage: commandConfig.usage || normalizedName,
            usageCommand: commandConfig.usageCommand || normalizedName,
            includeInAllInfo: Boolean(commandConfig.includeInAllInfo),
            execute: commandConfig.execute
        });
    }

    /**
     * Looks up a registered command by name (case-insensitive).
     * @param {string} name
     * @returns {object|undefined}
     */
    get(name) {
        if (typeof name !== 'string') {
            return undefined;
        }
        return this.commands.get(name.trim().toLowerCase());
    }

    /**
     * Checks whether a command name is registered.
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return Boolean(this.get(name));
    }

    /**
     * Returns all registered command descriptors in registration order.
     * @returns {Array<object>}
     */
    getAll() {
        return Array.from(this.commands.values());
    }

    /**
     * Returns commands marked for inclusion in the `allinfo` summary command.
     * @returns {Array<object>}
     */
    getAllInfoCommands() {
        return this.getAll().filter((cmd) => cmd.includeInAllInfo);
    }
}
