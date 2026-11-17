/**
 * Resolves terminal-style navigation commands (`cd`, `ls`, `gui`, `terminal`) in blog views.
 * @param {string} rawInput
 * @param {{ posts?: Array<{ slug: string, url: string }>, isPostPage?: boolean }} [options]
 * @returns {{ action: 'navigate', url: string } | { action: 'clearSearch' } | null}
 */
export function resolveBlogCommand(rawInput, { posts = [], isPostPage = false } = {}) {
    const trimmed = String(rawInput ?? '').trim().toLowerCase();
    if (!trimmed) {
        return null;
    }

    if (trimmed === 'terminal' || trimmed === 'exit') {
        return { action: 'navigate', url: '/' };
    }

    if (trimmed === 'gui') {
        return { action: 'navigate', url: '/mobile.html' };
    }

    if (trimmed === 'ls') {
        return isPostPage ? { action: 'navigate', url: '/blog/' } : { action: 'clearSearch' };
    }

    if (trimmed === 'cd' || trimmed.startsWith('cd ')) {
        const target = trimmed.slice(2).trim().replace(/\/+$/, '');
        if (!target || target === '~' || target === '/') {
            return { action: 'navigate', url: '/' };
        }
        if (target === '..') {
            return { action: 'navigate', url: isPostPage ? '/blog/' : '/' };
        }
        if (target === 'blog' || target === '/blog' || target === '~/blog') {
            return { action: 'navigate', url: '/blog/' };
        }
        if (target === 'gui') {
            return { action: 'navigate', url: '/mobile.html' };
        }

        const cleanSlug = target.replace(/^(\.\/|\/blog\/)/, '');
        const matchedPost = posts.find(
            (post) => post.slug.toLowerCase() === cleanSlug || post.slug.toLowerCase().startsWith(cleanSlug)
        );
        if (matchedPost) {
            return { action: 'navigate', url: matchedPost.url };
        }
    }

    return null;
}
