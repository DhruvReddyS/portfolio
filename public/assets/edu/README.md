# Campus photos for the study act

Drop a file here named after the school's `id` in `lib/portfolio-data.ts`.
It is picked up on the next load and fills the square beside that school's
name in the timetable; until one exists the short name holds the space, so
a lane with no photo is a state the layout already knows how to be in.

| File        | School                                |
| ----------- | ------------------------------------- |
| `mvsr.png`  | MVSR Engineering College, Hyderabad   |
| `iitm.png`  | IIT Madras                            |

`.jpg` works too; `.png` is tried first. The slot is a round tile of paper
and whatever is in it is fitted whole rather than cropped, because what is
in it now is each college's seal: both were drawn round, on white, to be
pressed into a page. A square photograph works in it too, but it will be
shown at about sixty pixels across, so one clear shape beats a wide view.

One note on where the file comes from. A campus photograph is somebody's
copyright: your own photo is the clean answer, and so is one the college
has published for public use. A Creative Commons photo works too, but the
BY licences require a credit, and that credit belongs on /colophon.
