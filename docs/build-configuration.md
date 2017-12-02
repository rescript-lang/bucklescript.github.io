---
id: build-configuration
title: Configuration
---

`bsconfig.json` is the single, mandatory build meta file needed for bsb.

**The complete configuration schema is [here](https://bucklescript.github.io/bucklescript/docson/#build-schema.json)**. We'll _non-exhaustively_ highlight the important parts in prose here.

### name, namespace

`name` is the name of the library, ideally kept in sync with your npm `package.json`'s `name`.

`namespace` is almost **mandatory** at this point; we haven't turned it on by default as to preserve backward-compatibility, but do put `"namespace": true` into your `bsconfig.json` please!.

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

You can mark your directories as dev-only (for e.g. tests):

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

Hook that's invoked every time a file is recompiled. Good for JS build system interop. See the schema for more details. Example:

```json
{
  "js-post-build": {
    "cmd": "node ../../postProcessTheFile.js"
  }
}
```

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

- `"module": "es6-global"` resolves `node_modules` using relative paths. Good for development-time usage of ES6 in conjunction with browsers like Safari and Firefox that support ES6 modules today. No more dev-time bundling!
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

Turn off warning `44` and `102` (polymorphic comparison). Turn warning `32` (partial application whose result has function type and is ignored) into a hard error.

The warning number are shown in the build output when they're triggered. The complete list is [here](https://caml.inria.fr/pub/docs/manual-ocaml/comp.html#sec281), a little bit below. `100` and up are BuckleScript-specific.

### bsc-flags

Extra flags to pass to the underlying `bsc` call. Notably: `["-bs-super-errors"]` for turning on [cleaning error output](https://reasonml.github.io/community/blog/#way-way-waaaay-nicer-error-messages). No need to pass this flag for a Reason project; it's enabled by default.
