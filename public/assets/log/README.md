# Company logos for the experience timeline

Drop a file here named after the entry's `id` in `lib/portfolio-data.ts`.
It is picked up on the next load, fills the medallion on the rail, and the
monogram underneath stops showing. No code change is needed.

| File to add        | Company                               |
| ------------------ | ------------------------------------- |
| `simplehire.png`   | SimpleHire.ai (Task Consulting)       |
| `axon.png`         | Axon Development                      |
| `paper.png`        | Paper Foundation India                |
| `sai.png`          | Sai Enterprises                       |
| `otbi.png`         | Osmania Technology Business Incubator |

`.jpg` works too; `.png` is tried first.

The medallion is a circle and the file is cropped to fill it, so a square
source around 256×256 with the mark centred works best. A logo on a
transparent background sits on the page's own dark ground.
