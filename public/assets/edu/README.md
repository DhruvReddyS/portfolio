# Campus photos for the study act

Drop a file here named after the school's `id` in `lib/portfolio-data.ts`.
It is picked up on the next load and fills the plate; until then the monogram
holds the space. No code change needed.

| File        | School                                |
| ----------- | ------------------------------------- |
| `mvsr.png`  | MVSR Engineering College, Hyderabad   |
| `iitm.png`  | IIT Madras                            |

`.jpg` works too; `.png` is tried first. The plate is a tall portrait slot and
the file is cropped to fill it, so a landscape campus shot around 1200×900
works well.
