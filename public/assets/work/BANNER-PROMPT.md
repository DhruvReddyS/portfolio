# Card banners for the rack

Eight builds sit on the rack in `02 / Selected work`. Three have a real
picture. The other five have no screen worth photographing — two are
back-ends, one is a hackathon prototype, one was never submitted — so they
get a **banner** instead: a designed card carrying the project's own mark,
its name and what it is built out of.

This file is the brief for making another one, whether by hand or by handing
it to a model.

## What already exists

| Project    | What its card shows            | Source                                             |
| ---------- | ------------------------------ | -------------------------------------------------- |
| Corpusil   | real UI                        | `LEGAL_RAG` → `docs/evidence/corpusil-ui/`          |
| CodeSync   | photo                          | `/assets/data-dynamo-win.png`                       |
| Ascend     | render                         | `/assets/healthcare-3d.png`                         |
| TRINETRA   | banner, with its own mark      | `TRINETRA` → `dist/branding/trinetra-mark.png`      |
| HMS        | banner, initials set           | no mark in `HMS_V2`                                 |
| QuizMaster | banner, initials set           | no mark in `QuizMaster`                             |
| ReconAI    | banner, initials set           | no mark in the repo                                 |
| SnapFix    | banner, initials set           | no mark in the repo                                 |

Marks live in `logos/`, cropped to the artwork and keyed onto transparency.
The banner itself is `components/buildlog/banner.tsx`; it is drawn in the
page, not exported as an image, so it stays sharp at any card width and
follows the site's tokens when those change.

## Finding a mark in a repository

```bash
BR=$(gh api repos/DhruvReddyS/<repo> --jq .default_branch)
gh api "repos/DhruvReddyS/<repo>/git/trees/$BR?recursive=1" \
  --jq '.tree[] | select(.path | test("(?i)\\.(png|jpg|svg|webp)$")) | "\(.size)\t\(.path)"'
```

Look in this order, and stop at the first real hit:

1. `**/branding/*`, `**/logo*`, `**/brand/*` — an actual mark
2. `public/favicon*`, `**/icon-512*` — usually the mark at a usable size
3. `docs/**`, `screenshots/**`, `**/evidence/**` — a real screen beats any
   banner, so if one of these exists use it and skip the banner entirely
4. nothing — set the initials

Ignore anything under `node_modules/`, and ignore a favicon that is only the
framework's default.

Then crop it to the artwork and key the ground out, the way
`byusforu-mark.png` was made: take the corner pixel as the ground, set alpha
from each pixel's distance to it, and trim to the alpha bounding box.

## The brief, for generating one

> You are designing one 16:10 banner for a card on an engineering portfolio.
> The page is black (`#0a0908`), bone (`#f2efe6`) and a single burnt orange
> (`#e05a2b`). Type is Archivo 900 for display and JetBrains Mono for labels.
>
> The project is **{name}** — {one sentence on what it does}. It is built
> with {four technologies}. It was {what kind of build: coursework, a
> hackathon prototype, a side quest, a production platform}.
>
> The banner carries four things and no more:
>
> 1. the kind, small, in mono caps, top left
> 2. the project's mark, centred, at its **own** colours — or its initials
>    in outlined Archivo 900 if it has none
> 3. the name, in Archivo 900 caps
> 4. four technologies as hairline pills, with `+n` for the rest
>
> The ground is a dark field with one soft wash of the orange coming in from
> a corner, and a faint dot grid masked off at the edges. No ruled lines: on
> a card behind a product shot they read as notebook paper. No drop shadows
> except under the mark, which is sitting on the card. No gradient text.
>
> It must be legible at 230px wide, which is what a side card on the rack
> gets, so nothing smaller than 8px and no more than four pills.

## Adding one

A real screenshot always wins. Drop `<id>.png` in this folder (16:10,
around 1600×1000) and the card uses it with no code change — see
`README.md`. The banner is only what shows when that file is not there.

To give a banner a mark instead of initials: save the cropped file as
`logos/<id>.png` and add its id and pixel size to `LOGOS` in
`components/buildlog/work-index.tsx`.
