---
id: build-overview
title: Overview
---

BuckleScript comes with a build system, bsb, that's meant to be fast, lean and used as the build system of the BuckleScript/Reason community.

Bsb provides a few templates to quickly start a new project:

```sh
bsb -init my-directory-name
```

To generate a Reason project:

```sh
bsb -init my-directory-name -theme basic-reason
```

Feel free to inspect the various files in the newly generated directory. To see all the templates available, do:

```sh
bsb -themes
```

<!-- TODO: clean up themes -->

To build a project, make sure you have the `bsconfig.json` generated above, then run:

```sh
bsb -make-world
```

Add `-w` to keep the built-in watcher running. Any new file change will be picked up and the build will re-run. **Note** that third-party libraries in `node_modules` aren't watched as it may exceed the node.js watcher count limit.

## `bsconfig.json` Configurations

**The complete configuration schema is [here](https://bucklescript.github.io/bucklescript/docson/#build-schema.json)**. We'll highlight the important parts in prose here.

### name, namespace

`name` is the name of the library, ideally kept in sync with your npm `package.json`'s `name`.

`namespace` is almost **mandatory** at this point; we haven't turned it on by default as to preserve backward-compatibility, but do put `"namespace": true` into your bsconfig.
