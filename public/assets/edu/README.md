# Campus photos for the study act

Drop a file here named after the school's `id` in `lib/portfolio-data.ts`.
It is picked up on the next load and fills the square beside that school's
name in the timetable; until one exists the short name holds the space, so
a lane with no photo is a state the layout already knows how to be in.

| File        | School                                |
| ----------- | ------------------------------------- |
| `mvsr.png`  | MVSR Engineering College, Hyderabad   |
| `iitm.png`  | IIT Madras                            |

`.jpg` works too; `.png` is tried first. The slot is square and cropped to
fill, so anything from about 600x600 up works; a shot of the building or
the gate reads better than a crowd, and it wants to survive being shown at
sixty pixels across, so one clear shape beats a wide view.

One note on where the file comes from. A campus photograph is somebody's
copyright: your own photo is the clean answer, and so is one the college
has published for public use. A Creative Commons photo works too, but the
BY licences require a credit, and that credit belongs on /colophon.
