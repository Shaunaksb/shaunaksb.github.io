/**
 * Manages terminal I/O, command history navigation, safe DOM output, and scrolling.
 */
export class TerminalEngine {
    /**
     * @param {{
     *   terminalEl: HTMLElement,
     *   inputEl: HTMLInputElement,
     *   outputEl: HTMLElement,
     *   registry: import('./CommandRegistry.js').CommandRegistry,
     *   promptLabel?: string,
     *   windowRef?: Window,
     *   documentRef?: Document
     * }} options
     */
    constructor({
        terminalEl,
        inputEl,
        outputEl,
        registry,
        promptLabel = '[shaunaksb@portfolio]~$',
        windowRef = window,
        documentRef = document
    }) {
        this.terminalEl = terminalEl;
        this.inputEl = inputEl;
        this.outputEl = outputEl;
        this.registry = registry;
        this.promptLabel = promptLabel;
        this.windowRef = windowRef;
        this.documentRef = documentRef;

        this.commandHistory = [];
        this.historyIndex = 0;
        this.isInitialized = false;

        this.terminalApi = {
            printElement: (element) => {
                this.outputEl.appendChild(element);
                this.scrollToBottom();
                return element;
            },
            printText: (text, className = 'command-output') => {
                const el = this.documentRef.createElement('div');
                el.className = className;
                el.textContent = text;
                this.outputEl.appendChild(el);
                this.scrollToBottom();
                return el;
            },
            clear: () => {
                this.outputEl.replaceChildren();
            },
            exit: () => {
                this.handleExit();
            },
            getHistory: () => [...this.commandHistory],
            openLink: (url, target = '_blank') => {
                if (target === '_self') {
                    this.windowRef.location.href = url;
                } else {
                    this.windowRef.open(url, target, 'noopener,noreferrer');
                }
            }
        };
    }

    /**
     * Binds input keyboard handlers, clickable command delegation, and auto-scroll observer.
     */
    init() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;

        this.inputEl.addEventListener('keydown', (event) => this.handleKeyDown(event));

        this.outputEl.addEventListener('click', (event) => {
            const clickable = event.target.closest?.('.clickable-command');
            if (clickable) {
                const command = clickable.dataset.command || clickable.textContent;
                this.executeCommand(command);
                this.inputEl.focus?.();
            }
        });

        if (typeof this.windowRef.MutationObserver === 'function') {
            this.observer = new this.windowRef.MutationObserver(() => this.scrollToBottom());
            this.observer.observe(this.outputEl, { childList: true, subtree: true });
        }
    }

    /**
     * Handles Enter execution and ArrowUp/ArrowDown history navigation.
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            const command = this.inputEl.value.trim();
            this.executeCommand(command);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault?.();
            if (this.historyIndex > 0) {
                this.historyIndex -= 1;
                this.inputEl.value = this.commandHistory[this.historyIndex];
            }
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault?.();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex += 1;
                this.inputEl.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.inputEl.value = '';
            }
        }
    }

    /**
     * Parses and executes a command string through the registry.
     * @param {string} rawCommand
     * @param {{ displayPrompt?: boolean, recordHistory?: boolean }} [options]
     * @returns {Promise<void>}
     */
    async executeCommand(rawCommand, { displayPrompt = true, recordHistory = true } = {}) {
        const command = String(rawCommand ?? '').trim();

        if (displayPrompt) {
            const promptLine = this.documentRef.createElement('div');
            promptLine.appendChild(this.documentRef.createTextNode(`${this.promptLabel} `));
            const cmdSpan = this.documentRef.createElement('span');
            cmdSpan.className = 'command';
            cmdSpan.textContent = command;
            promptLine.appendChild(cmdSpan);
            this.outputEl.appendChild(promptLine);
        }

        this.inputEl.value = '';

        if (!command) {
            this.scrollToBottom();
            return;
        }

        if (recordHistory) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
        }

        const [cmdName, ...args] = command.split(/\s+/);
        const handler = this.registry.get(cmdName);

        if (handler) {
            await handler.execute(args, this.terminalApi);
        } else {
            this.terminalApi.printText(`Command not found: ${command}`);
        }

        this.scrollToBottom();
    }

    /**
     * Handles the exit command lifecycle with graceful fallback if browser blocks window.close().
     */
    handleExit() {
        this.terminalApi.printText('Exiting the terminal. Thank you for visiting!');
        this.inputEl.disabled = true;
        this.terminalEl.style.opacity = '0.5';

        this.windowRef.setTimeout(() => {
            let closed = false;
            try {
                this.windowRef.close();
                closed = Boolean(this.windowRef.closed);
            } catch {
                closed = false;
            }

            if (!closed) {
                this.terminalApi.printText(
                    'Unable to close the tab automatically. You can close this tab manually. Thank you for using the terminal!'
                );
                this.inputEl.disabled = false;
                this.terminalEl.style.opacity = '1';
                this.inputEl.focus?.();
            }
        }, 2000);
    }

    /**
     * Keeps the scrollable terminal scrolled to the newest output.
     */
    scrollToBottom() {
        if (this.terminalEl.scrollHeight > this.terminalEl.clientHeight) {
            this.terminalEl.scrollTop = this.terminalEl.scrollHeight;
        }
        if (this.outputEl.scrollHeight > this.outputEl.clientHeight) {
            this.outputEl.scrollTop = this.outputEl.scrollHeight - this.outputEl.clientHeight;
        }
    }
}
