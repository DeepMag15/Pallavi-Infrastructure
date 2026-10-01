# Pallavi Infrastructure website

Single-page website for Pallavi Infrastructure, an RMC line pump rental and civil construction firm in Alibag, Raigad, Maharashtra.

It is a plain static site: HTML, CSS and a small amount of JavaScript. There is no build step and nothing to install.

## Preview locally

Open `index.html` in a browser, or serve the folder so the installable-app features also work:

```
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: header, hero, About, Services, The pump, Our work, Contact |
| `assets/css/style.css` | All styling, including the phone and tablet layouts |
| `assets/js/main.js` | Phone menu, video play-on-scroll, service worker registration |
| `assets/img/` | Logo, photos, video poster frames and app icons |
| `assets/video/` | Site videos (muted, no audio track) |
| `manifest.webmanifest` | App name, colours and icons for "Add to Home screen" |
| `sw.js` | Service worker that keeps the page available offline |

The `reference/` folder and the visiting card PDF are the source material the site was built from. They are listed in `.gitignore` and are not needed to run the site.

## Common changes

**Contact details.** The phone number, WhatsApp number and email are not shown as text; they live only in the button links in `index.html`. Search for `tel:`, `wa.me/` and `mailto:` and update every occurrence (header, hero, contact section and the phone bottom bar).

**Text.** Edit the copy directly in `index.html`. Each section is marked by its `id`: `about`, `services`, `pump`, `work`, `contact`.

**Photos and videos.** Put new files in `assets/img/` or `assets/video/` and add a `<figure>` to the gallery in the `work` section. Media is portrait (about 9:14). Each video needs a poster image, and should have its audio removed:

```
ffmpeg -i input.mp4 -an -c:v copy -movflags +faststart assets/video/name.mp4
ffmpeg -ss 0.5 -i input.mp4 -frames:v 1 -q:v 3 assets/img/name-poster.jpg
```

**Logo.** `assets/img/logo.svg` is a redrawn approximation of the logo on the visiting card. Replace it with the original artwork if available, then regenerate `icon-180.png`, `icon-192.png` and `icon-512.png` from it.

**Colours and fonts.** These are set as variables at the top of `assets/css/style.css`.

## Publishing

Upload the folder contents to any static host (GitHub Pages, Netlify, Cloudflare Pages or ordinary shared hosting). The site must be served over `https` for "Add to Home screen" and offline support to work.

After changing which files the site uses, update the `CORE` list in `sw.js` and bump the `CACHE` name (for example `pallavi-v2`) so installed copies pick up the new files.
