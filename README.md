# Serey Mongkol E-Theap — Vercel invitation

This is the complete Golden Floral Story invitation prepared for static hosting on Vercel. It includes local Khmer fonts, decorations, photographs, the opening video, background song, calendar download, and the Google Maps link.

The design, names, ceremony schedule, and drawn map match the complete approved invitation. The video plays after **បើកធៀប**. Finishing or skipping it opens the invitation, starts the looping song, and begins automatic scrolling. Guests can mute or unmute with the music button.

## Deploy from your computer

1. Unzip the package, then open Terminal in the `vercel-invitation` directory containing `vercel.json`.
2. If the Vercel CLI is not installed, run `npm install -g vercel`.
3. Sign in:

   ```sh
   vercel login
   ```

4. Create a preview deployment:

   ```sh
   vercel
   ```

5. After reviewing the preview, publish to your production domain:

   ```sh
   vercel --prod
   ```

Choose your existing invitation project when prompted if you want to keep its existing Vercel domain. Otherwise, create a new project. Use the URL printed by Vercel; no example domain in this guide is an actual deployment.

The included `vercel.json` selects **Other**, skips dependency installation and building, and publishes the `public` folder. No environment variables are required.

## Deploy using a Git repository

Commit this directory to a repository and import it in Vercel. If this directory is inside a larger repository, select it as the project's **Root Directory**. The configuration file must be at that root.

Settings, if Vercel asks:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Build Command | Empty |
| Install Command | Empty |
| Output Directory | `public` |

## Invite a specific guest

Add `?guest=` followed by a URL-encoded guest name to your deployed URL. Existing links ending in `golden-floral-story-invitation.html` or `golden_floral_story.html` also work.

Example (replace the example domain with your own deployment):

```text
https://YOUR-PROJECT.vercel.app/?guest=%E1%9E%94%E1%9E%84%20%E1%9E%A0%E1%9F%8A%E1%9E%93%20%E1%9E%82%E1%9E%B8%E1%9E%98%E1%9E%A0%E1%9E%B6%E1%9E%93
```

To generate another guest link in your browser console:

```js
const link = new URL('https://YOUR-PROJECT.vercel.app/');
link.searchParams.set('guest', 'Guest name');
console.log(link.href);
```

## Edit and preview

- `public/index.html`: invitation content and media references.
- `public/styles.css`: colors, layout, and Khmer font declarations.
- `public/wedding-date.js`: live countdown to the reception on 3 January 2027 at 5:00 PM in Cambodia. The countdown reads the `datetime` on `#wedding-start`; the displayed calendar highlights the same date.
- `public/app.js`: guest name, opening video, music, scrolling, and photo gallery. `window.PAGE_INVITATION` at the top contains the default guest and automatic scrolling setting.
- `public/assets/`: all invitation images, fonts, video, song, and calendar file. Keep this folder with the page.
- `vercel.json`: hosting settings and compatibility routes.
- `asset-manifest.json`: media hashes and file sizes for verification.

For a local preview from this directory:

```sh
python3 -m http.server 8880 --directory public
```

Then open `http://localhost:8880/` in a browser. Local preview serves the invitation; compatibility routes and cache headers are configured by Vercel.

Media were extracted from the standalone HTML and deduplicated without changing their bytes. The page loads the opening video only after the guest opens the invitation, and loads the song when the video finishes or is skipped. Asset filenames contain content hashes for caching; when replacing media, use a new filename and update its reference.

## Reference

- [Vercel static build settings](https://vercel.com/docs/builds/configure-a-build)
- [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel CLI deployment](https://vercel.com/docs/cli/deploy)
