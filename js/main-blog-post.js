import { blogPosts } from './data/blogData.js';
import { resolveBlogCommand } from './gui/blogCommands.js';
import { BackgroundLoader } from './terminal/BackgroundLoader.js';

function bootstrapBlogPost() {
    const backgroundLoader = new BackgroundLoader({
        portraitEl: document.getElementById('portrait-bg'),
        landscapeEl: document.getElementById('landscape-bg')
    });
    backgroundLoader.init();

    const cmdInput = document.getElementById('blog-command-input');
    const feedbackEl = document.getElementById('blog-cmd-feedback');

    if (cmdInput) {
        cmdInput.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' && !cmdInput.value) {
                event.preventDefault();
                window.scrollBy({ top: 120, behavior: 'smooth' });
                return;
            }

            if (event.key === 'ArrowUp' && !cmdInput.value) {
                event.preventDefault();
                window.scrollBy({ top: -120, behavior: 'smooth' });
                return;
            }

            if (event.key === 'Escape') {
                cmdInput.value = '';
                if (feedbackEl) {
                    feedbackEl.textContent = '';
                }
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                const resolved = resolveBlogCommand(cmdInput.value, {
                    posts: blogPosts,
                    isPostPage: true
                });

                if (resolved?.action === 'navigate') {
                    window.location.href = resolved.url;
                    return;
                }

                if (feedbackEl && cmdInput.value.trim()) {
                    feedbackEl.textContent = `Unknown command: "${cmdInput.value.trim()}". Try: cd .., cd ~, gui, ls`;
                }
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === '/' && document.activeElement !== cmdInput) {
            event.preventDefault();
            cmdInput?.focus();
        }
    });

    const switchToGuiButton = document.getElementById('switch-to-mobile');
    if (switchToGuiButton) {
        switchToGuiButton.addEventListener('click', () => {
            window.location.href = '/mobile.html';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapBlogPost);
} else {
    bootstrapBlogPost();
}
