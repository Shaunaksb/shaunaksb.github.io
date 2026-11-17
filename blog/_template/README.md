# Blog Post Template

Use this directory to create new SEO-ready blog posts that match the portfolio's Terminal Mode theme (`/css/terminal.css` + `/css/blog.css`).

## Steps to Publish a New Post

1. **Copy the template folder:**
   Duplicate `blog/_template/` to `blog/<your-post-slug>/` (for example, `blog/my-new-post/`).

2. **Replace placeholders in `blog/<your-post-slug>/index.html`:**
   - `POST_TITLE`
   - `POST_DESCRIPTION`
   - `POST_KEYWORDS`
   - `POST_SLUG`
   - `PUBLISHED_DATE` (YYYY-MM-DD)
   - `READING_TIME` (e.g., `6 min read`)

3. **Register the post in `js/data/blogData.js`:**
   Add a matching metadata entry to `blogPosts` so it appears automatically on `/blog/`.

4. **Update `sitemap.xml`:**
   Add `<url><loc>https://shaunaksb.github.io/blog/<your-post-slug>/</loc>...</url>`.
