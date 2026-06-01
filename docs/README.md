# Engineering and Process Docs

Internal source-of-truth specs for developing, shipping, and maintaining the ZSoftly documentation
site (`zcp-docs`). These files are not published. Reader-facing docs live in `src/content/docs/`.

For external-contributor guidance (fork, report an issue, open a PR), see
[CONTRIBUTING.md](../CONTRIBUTING.md). For AI-assistant rules, see [CLAUDE.md](../CLAUDE.md).

| Doc                                            | Covers                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| [release-process.md](./release-process.md)     | Git workflow, branch naming, commits, cutting and shipping releases |
| [cicd.md](./cicd.md)                           | The four GitHub Actions workflows, CI gates, secrets, runners       |
| [environments.md](./environments.md)           | dev, stg, prd definitions, domains, deploy triggers                 |
| [content-standards.md](./content-standards.md) | Writing style, Starlight authoring rules, frontmatter               |
| [launch-checklist.md](./launch-checklist.md)   | Pre-launch validation before a prd deploy                           |
