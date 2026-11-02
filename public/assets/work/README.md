# Screenshots for the work wall

Drop a file here named after the project's `id` in `lib/portfolio-data.ts`.
It is picked up on the next load, fills that card's picture, and the ghosted
project name underneath stops showing. No code change is needed.

| File to add        | Project    | Has one today                       |
| ------------------ | ---------- | ----------------------------------- |
| `corpusil.png`     | Corpusil   | yes, `/assets/rag-3d.png`           |
| `codesync.png`     | CodeSync   | yes, `/assets/data-dynamo-win.png`  |
| `trinetra.png`     | TRINETRA   | **no**                              |
| `ascend.png`       | Ascend     | yes, `/assets/healthcare-3d.png`    |
| `hms.png`          | HMS        | **no**                              |
| `quizmaster.png`   | QuizMaster | **no**                              |
| `reconai.png`      | ReconAI    | **no**                              |
| `snapfix.png`      | SnapFix    | **no**                              |

A file dropped here wins over the one named in the data, so the three that
already have a picture can be replaced the same way.

`.jpg` works too; `.png` is tried first.

The picture is 16:10 and the file is cropped to fill it, so a landscape
source around 1600×1000 works best. A screen capture of the app running,
rather than a logo: the card already prints the name underneath.
