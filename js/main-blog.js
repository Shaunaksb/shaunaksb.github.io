import { blogPosts } from './data/blogData.js';
import { BlogIndexRenderer, MIN_POSTS_FOR_PAGINATION } from './gui/BlogIndexRenderer.js';
import { BackgroundLoader } from './terminal/BackgroundLoader.js';

function bootstrapBlogIndex() {
    const backgroundLoader = new BackgroundLoader({
        portraitEl: document.getElementById('portrait-bg'),
        landscapeEl: document.getElementById('landscape-bg')
    });
    backgroundLoader.init();

    const renderer = new BlogIndexRenderer({
        posts: blogPosts,
        minPostsForPagination: MIN_POSTS_FOR_PAGINATION
    });
    renderer.init();

    const switchToGuiButton = document.getElementById('switch-to-mobile');
    if (switchToGuiButton) {
        switchToGuiButton.addEventListener('click', () => {
            window.location.href = '/mobile.html';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapBlogIndex);
} else {
    bootstrapBlogIndex();
}
