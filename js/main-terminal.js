import { portfolioData } from './data/portfolioData.js';
import * as weatherService from './services/weatherService.js';
import * as clipboardService from './services/clipboardService.js';
import { CommandRegistry } from './terminal/CommandRegistry.js';
import * as renderer from './terminal/terminalRenderer.js';
import { registerDefaultCommands } from './terminal/commands.js';
import { TerminalEngine } from './terminal/TerminalEngine.js';
import { BackgroundLoader } from './terminal/BackgroundLoader.js';

function bootstrapTerminal() {
    const portraitEl = document.getElementById('portrait-bg');
    const landscapeEl = document.getElementById('landscape-bg');
    const backgroundLoader = new BackgroundLoader({ portraitEl, landscapeEl });
    backgroundLoader.init();

    const registry = new CommandRegistry();
    registerDefaultCommands(registry, {
        data: portfolioData,
        weatherService,
        clipboardService,
        renderer
    });

    const promptLabel = `[${portfolioData.profile.promptUser}]~$`;
    const promptEl = document.getElementById('prompt');
    if (promptEl) {
        promptEl.textContent = promptLabel;
    }

    const engine = new TerminalEngine({
        terminalEl: document.getElementById('terminal'),
        inputEl: document.getElementById('user-input'),
        outputEl: document.getElementById('auto-run-output'),
        registry,
        promptLabel
    });
    engine.init();
    engine.executeCommand('portofetch', { displayPrompt: true, recordHistory: true });

    const switchToMobileButton = document.getElementById('switch-to-mobile');
    if (switchToMobileButton) {
        switchToMobileButton.addEventListener('click', () => {
            window.location.href = 'mobile.html';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapTerminal);
} else {
    bootstrapTerminal();
}
