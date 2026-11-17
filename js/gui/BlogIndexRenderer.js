import { resolveBlogCommand } from './blogCommands.js';

export const MIN_POSTS_FOR_PAGINATION = 10;

/**
 * Renders the blog index with live search, arrow-key post navigation, and conditional pagination.
 */
export class BlogIndexRenderer {
    /**
     * @param {{
     *   posts: Array<object>,
     *   minPostsForPagination?: number,
     *   pageSize?: number,
     *   documentRef?: Document,
     *   windowRef?: Window
     * }} options
     */
    constructor({
        posts,
        minPostsForPagination = MIN_POSTS_FOR_PAGINATION,
        pageSize = minPostsForPagination,
        documentRef = document,
        windowRef = window
    }) {
        this.posts = posts || [];
        this.minPostsForPagination = minPostsForPagination;
        this.pageSize = pageSize;
        this.doc = documentRef;
        this.win = windowRef;

        this.query = '';
        this.currentPage = 1;
        this.selectedIndex = 0;
        this.isInitialized = false;
    }

    /**
     * Initializes keyboard/search event listeners and performs initial render.
     */
    init() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.bindEvents();
        }
        this.render();
    }

    /**
     * Binds search input, arrow-key navigation, and quick `/` focus shortcut.
     */
    bindEvents() {
        const searchInput = this.doc.getElementById('blog-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.setQuery(event.target.value);
            });
            searchInput.addEventListener('keydown', (event) => {
                this.handleKeyDown(event);
            });
            searchInput.focus?.();
        }

        this.doc.addEventListener?.('keydown', (event) => {
            if (event.key === '/' && this.doc.activeElement !== searchInput) {
                event.preventDefault?.();
                searchInput?.focus?.();
            }
        });
    }

    /**
     * Updates the active search filter and resets pagination/selection.
     * @param {string} rawQuery
     */
    setQuery(rawQuery) {
        this.query = String(rawQuery ?? '').trim().toLowerCase();
        this.currentPage = 1;
        this.selectedIndex = 0;
        this.render();
    }

    /**
     * Returns posts matching the current search query across title, summary, and tags.
     * @returns {Array<object>}
     */
    getFilteredPosts() {
        if (!this.query) {
            return this.posts;
        }
        return this.posts.filter((post) => {
            const haystack = [post.title, post.summary, ...(post.tags || [])]
                .join(' ')
                .toLowerCase();
            return haystack.includes(this.query);
        });
    }

    /**
     * Determines whether pagination should be shown for the given post list.
     * @param {Array<object>} filteredPosts
     * @returns {boolean}
     */
    shouldShowPagination(filteredPosts) {
        return filteredPosts.length > this.minPostsForPagination;
    }

    /**
     * Returns total page count for the filtered post list.
     * @param {Array<object>} filteredPosts
     * @returns {number}
     */
    getTotalPages(filteredPosts) {
        if (!this.shouldShowPagination(filteredPosts)) {
            return 1;
        }
        return Math.max(1, Math.ceil(filteredPosts.length / this.pageSize));
    }

    /**
     * Returns the slice of posts visible on the current page.
     * @param {Array<object>} filteredPosts
     * @returns {Array<object>}
     */
    getPagedPosts(filteredPosts) {
        if (!this.shouldShowPagination(filteredPosts)) {
            return filteredPosts;
        }
        const totalPages = this.getTotalPages(filteredPosts);
        this.currentPage = Math.min(Math.max(1, this.currentPage), totalPages);
        const start = (this.currentPage - 1) * this.pageSize;
        return filteredPosts.slice(start, start + this.pageSize);
    }

    /**
     * Navigates to a target page index and resets selection to the first visible post.
     * @param {number} page
     */
    goToPage(page) {
        const filtered = this.getFilteredPosts();
        const totalPages = this.getTotalPages(filtered);
        const nextPage = Math.min(Math.max(1, page), totalPages);
        if (nextPage === this.currentPage) {
            return;
        }
        this.currentPage = nextPage;
        this.selectedIndex = 0;
        this.render();
    }

    /**
     * Handles ArrowUp/ArrowDown post cycling, ArrowLeft/ArrowRight paging, Escape, and Enter.
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        const filtered = this.getFilteredPosts();
        const paged = this.getPagedPosts(filtered);

        if (event.key === 'ArrowDown') {
            event.preventDefault?.();
            if (paged.length > 0) {
                this.selectedIndex = (this.selectedIndex + 1) % paged.length;
                this.render();
                this.scrollSelectedIntoView();
            }
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault?.();
            if (paged.length > 0) {
                this.selectedIndex = (this.selectedIndex - 1 + paged.length) % paged.length;
                this.render();
                this.scrollSelectedIntoView();
            }
            return;
        }

        if (event.key === 'ArrowRight' && this.shouldShowPagination(filtered) && !this.query) {
            event.preventDefault?.();
            this.goToPage(this.currentPage + 1);
            return;
        }

        if (event.key === 'ArrowLeft' && this.shouldShowPagination(filtered) && !this.query) {
            event.preventDefault?.();
            this.goToPage(this.currentPage - 1);
            return;
        }

        if (event.key === 'Escape') {
            const searchInput = this.doc.getElementById('blog-search-input');
            if (searchInput) {
                searchInput.value = '';
            }
            this.setQuery('');
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault?.();
            const searchInput = this.doc.getElementById('blog-search-input');
            const rawCmd = searchInput ? searchInput.value : this.query;
            const resolved = resolveBlogCommand(rawCmd, { posts: this.posts, isPostPage: false });

            if (resolved?.action === 'navigate') {
                this.win.location.href = resolved.url;
                return;
            }
            if (resolved?.action === 'clearSearch') {
                if (searchInput) {
                    searchInput.value = '';
                }
                this.setQuery('');
                return;
            }

            const selectedPost = paged[this.selectedIndex];
            if (selectedPost) {
                this.win.location.href = selectedPost.url;
            }
        }
    }

    scrollSelectedIntoView() {
        const container = this.doc.getElementById('blog-posts-list');
        const selectedEl = container?.childNodes?.[this.selectedIndex];
        selectedEl?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
    }

    /**
     * Renders post cards, search status, and conditional pagination controls.
     */
    render() {
        const container = this.doc.getElementById('blog-posts-list');
        if (!container) {
            return;
        }

        const filtered = this.getFilteredPosts();
        const paged = this.getPagedPosts(filtered);

        if (paged.length === 0) {
            this.selectedIndex = -1;
            const emptyState = this.doc.createElement('p');
            emptyState.className = 'blog-subtitle';
            emptyState.textContent = `No posts matching "${this.query}". Press Esc to reset.`;
            container.replaceChildren(emptyState);
        } else {
            if (this.selectedIndex < 0 || this.selectedIndex >= paged.length) {
                this.selectedIndex = 0;
            }

            const cards = paged.map((post, index) => {
                const isSelected = index === this.selectedIndex;
                const article = this.doc.createElement('article');
                article.className = isSelected ? 'blog-card is-selected' : 'blog-card';
                article.setAttribute('aria-selected', String(isSelected));

                const title = this.doc.createElement('h2');
                title.className = 'blog-card-title';
                const link = this.doc.createElement('a');
                link.setAttribute('href', post.url);
                link.textContent = post.title;
                title.appendChild(link);

                const meta = this.doc.createElement('div');
                meta.className = 'blog-meta';
                meta.textContent = `${post.publishedAt} · ${post.readingTime}`;

                const summary = this.doc.createElement('p');
                summary.textContent = post.summary;

                const tagsWrap = this.doc.createElement('div');
                tagsWrap.className = 'blog-tags';
                (post.tags || []).forEach((tagText) => {
                    const tag = this.doc.createElement('span');
                    tag.className = 'blog-tag';
                    tag.textContent = tagText;
                    tagsWrap.appendChild(tag);
                });

                article.append(title, meta, summary, tagsWrap);
                return article;
            });

            container.replaceChildren(...cards);
        }

        this.renderStatus(filtered);
        this.renderPagination(filtered);
    }

    renderStatus(filtered) {
        const statusEl = this.doc.getElementById('blog-search-status');
        if (!statusEl) {
            return;
        }
        const countLabel = `${filtered.length} ${filtered.length === 1 ? 'post' : 'posts'}`;
        statusEl.textContent = this.query
            ? `${countLabel} matching "${this.query}"`
            : `${countLabel} available · ↑/↓ to cycle, Enter to open`;
    }

    renderPagination(filtered) {
        const paginationEl = this.doc.getElementById('blog-pagination');
        if (!paginationEl) {
            return;
        }

        if (!this.shouldShowPagination(filtered)) {
            paginationEl.replaceChildren();
            paginationEl.style.display = 'none';
            return;
        }

        paginationEl.style.display = 'flex';
        const totalPages = this.getTotalPages(filtered);

        const prevBtn = this.doc.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'blog-page-btn';
        prevBtn.textContent = '← Prev';
        prevBtn.disabled = this.currentPage <= 1;
        prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));

        const info = this.doc.createElement('span');
        info.className = 'blog-meta';
        info.textContent = `Page ${this.currentPage} of ${totalPages}`;

        const nextBtn = this.doc.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'blog-page-btn';
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = this.currentPage >= totalPages;
        nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));

        paginationEl.replaceChildren(prevBtn, info, nextBtn);
    }
}
