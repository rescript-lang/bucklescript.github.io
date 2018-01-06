---
title: TypeScript Support
---

`bsc` has the ability to emits `.d.ts` for better interaction with typescript. This is still **experimental**. Turn it on with the flag `-bs-gen-tds`. In your `bsconfig.json`, it'd be:

```json
{
  "bsc-flags": ["-bs-gen-tds"]
}
```

<!-- TODO document flow support -->
