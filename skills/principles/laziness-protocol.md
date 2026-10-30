# Laziness Protocol

- **Consolidate decisions.** Do not repeat the same choice in several places. Put it behind one source of truth and pass the result as a simple flag.
- **Minimize the diff.** Make the smallest change that solves the problem. Fewer lines beat "elegant" boilerplate.
- **Skip layers that remove nothing.** Do not add an abstraction, a layer, or signal threading unless it removes real complexity.
- **Ship what the evidence justifies.** With [Prove It Works](prove-it-works.md), ship the smallest change the evidence justifies. Belt-and-suspenders that "might help" fails both principles.
