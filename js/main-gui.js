import { portfolioData } from './data/portfolioData.js';
import { GuiRenderer } from './gui/GuiRenderer.js';

function bootstrapGui() {
    const renderer = new GuiRenderer({ data: portfolioData });
    renderer.render();

    const switchToDesktopButton = document.getElementById('switch-to-desktop');
    if (switchToDesktopButton) {
        switchToDesktopButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapGui);
} else {
    bootstrapGui();
}
