# Campus photos for the study act

Drop a file here named after the school's `id` in `lib/portfolio-data.ts`.
It is picked up on the next load and fills the band across the top of that
school's card; until one exists the short name holds the space, so a card
with no photo is a state the layout already knows how to be in.

| File        | School                                |
| ----------- | ------------------------------------- |
| `mvsr.png`  | MVSR Engineering College, Hyderabad   |
| `iitm.png`  | IIT Madras                            |

`.jpg` works too; `.png` is tried first. The band is a wide landscape slot
cropped to fill, so a shot around 1400x800 or larger works well. A photo of
the building or the gate reads better than a crowd.

One note on where the file comes from. A campus photograph is somebody's
copyright: your own photo is the clean answer, and so is one the college
has published for public use. A Creative Commons photo works too, but the
BY licences require a credit, and that credit belongs on /colophon.
