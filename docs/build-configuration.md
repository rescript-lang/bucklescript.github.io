---
id: build-configuration
title: Configuration
---

`bsconfig.json` is the single, mandatory build meta file needed for bsb.

**The complete configuration schema is [here](https://bucklescript.github.io/bucklescript/docson/#build-schema.json)**. We'll _non-exhaustively_ highlight the important parts in prose here.

### name, namespace

`name` is the name of the library, used as its "namespace". You can activate namespacing through `"namespace": true` in your `bsconfig.json`. Namespacing is almost **mandatory**; we haven't turned it on by default yet to preserve backward-compatibility.

Explanation: by default, your files, once used as a third-party dependency, are available globally to the consumer. If you have an e.g. `Util.re` and the consumer also has a file of the same name, things will clash. Turning on `namespace` avoids this by wrapping all your files into an extra module layer, so instead of a global `Util` module, the consumer will see you as `MyProject.Util`.

Aka, in Bsb, "namespace" is just a fancy term for an auto-generated module that wraps all your project's files (efficiently and correctly, of course!) for third-party consumption.

Inside your own project, you don't have to reference your own namespace. We don't do folder-level namespacing, aka all your project's file names must be unique. This is a constraint that enables several features such as fast search and easier project reorganization.

**Note**: the `bsconfig.json` `name` should be the same as the `package.json` `name`, to avoid confusing corner-cases. However, this means that you can't use a camelCased names such as `MyProject`, since `package.json` and npm forbid you to do so (some file systems are case-insensitive). To have the namespace/module as `MyProject`, write `"name": "my-project"`. Bsb will turn that into the camelCased name correctly.

### sources

Your source files need to be specified explicitly (we don't want to accidentally drill down into some unrelated directories). Examples:

```json
{
  "sources": ["src", "examples"]
}
```
```json
{
  "sources": {
    "dir": "src",
    "subdirs": ["page"]
  }
}
```

```json
{
  "sources": [
    "examples",
    {
      "dir": "src",
      "subdirs": true // recursively builds every subdirectory
    }
  ]
}
```

You can mark your directories as dev-only (for e.g. tests). These won't be build and exposed to third-party:

```json
{
  "sources" : {
    "dir" : "test",
    "type" : "dev"
  }
}
```

### bs-dependencies, bs-dev-dependencies

List of BuckleScript/Reason dependencies. Just like `package.json`'s dependencies, they'll be searched in `node_modules`.

### reason, refmt

`reason` config is enabled by default. To turn on JSX for [ReasonReact](https://reasonml.github.io/reason-react/), specify:

```json
{
  "reason": {"react-jsx": 2}
}
```

The `refmt` config **should be explicitly specified**: `"refmt": 3` for the new [Reason V3 syntax](https://reasonml.github.io/community/blog/#reason-3).

### js-post-build

Hook that's invoked every time a file is recompiled. Good for JS build system interop, but please use it **sparingly**. Calling your custom command for every recompiled file slows down your build and worsens the building experience for even third-party users of your lib.

Example:

```json
{
  "js-post-build": {
    "cmd": "/path/to/node ../../postProcessTheFile.js"
  }
}
```

Note that the command's path resolution is done through the following:

- `/myCommand` is resolved into `/myCommand`
- `myCommand/` is resolved into `node_modules/myCommand`
- `./myCommand` is resolved into `myProjectRoot/myCommand`
- `myCommand` is just called as `myCommand`. But note that Bsb doesn't read into your environment, so if you put `node`, it won't find it unless you specify an absolute path. Alternatively, point to a script that has the header `#!/usr/local/bin/node`.

The command itself is called from inside `lib/bs`.

### package-specs

Output to either CommonJS, ES6 modules or AMD. Example:

```json
{
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  }
}
```

- `"module": "es6-global"` resolves `node_modules` using relative paths. Good for development-time usage of ES6 in conjunction with browsers like Safari and Firefox that support ES6 modules today. **No more dev-time bundling**!
- `"in-source": true` generates output alongside source files, instead of by default isolating them into `lib/js`. The output directory is otherwise not configurable.

### suffix

Either `".js"` or `".bs.js"`. Strongly [prefer the latter](build-overview.md#tips-tricks).

### warnings

Selectively turn on/off certain warnings and/or turn them into hard errors. Example:

```json
{
  "warnings": {
    "number": "-44-102",
    "error": "+5"
  }
}
```

Turn off warning `44` and `102` (polymorphic comparison). Turn warning `5` (partial application whose result has function type and is ignored) into a hard error.

The warning number are shown in the build output when they're triggered. The complete list is [here](https://caml.inria.fr/pub/docs/manual-ocaml/comp.html#sec281), a little bit below. `100` and up are BuckleScript-specific.

### bsc-flags

Extra flags to pass to the underlying `bsc` call. Notably: `["-bs-super-errors"]` for turning on [cleaning error output](https://reasonml.github.io/community/blog/#way-way-waaaay-nicer-error-messages). No need to pass this flag for a Reason project; it's enabled by default.
