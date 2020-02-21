---
title: Loading stdlib from memory
---

## Loading stdlib from memory

In next release, we are going to load stdlib from memory instead of from external file systems, which will make the BuckleScript toolchain more accessible and performant.

You can try it via `npm i bs-platform@7.2.0-dev.3`

## How does it work

When a compiler compiles a module `test.ml`, the module `Test` will import some modules from stdlib. This is inevitable since even basic operators in BuckleScript, take `(+)` for example is defined in Pervasives module which is part of the stdlib. 

Traditionally, the compiler will consult `Pervasives.cmi` which is a binary artifact describing the interface of Pervasives module and `Pervasives.cmj` which is a binary artifact describing the implementation of Pervasives module. `Pervasives.cm[ij]` and other modules in stdlib are shipped together with the compiler. 


This traditional mode has some consequences:

- The compiler is not stand-alone and relocatable, even if we have the compiler prebuilt for different platforms, we still have to compile stdlib post-installation. `postinstall` is supported by npm, but it has [various](https://github.com/BuckleScript/bucklescript/issues/3213) [issues](https://github.com/BuckleScript/bucklescript/issues/2799) [against](https://github.com/BuckleScript/bucklescript/issues/3254) yarn

- It's hard to split compiler from generated stdlib js artifacts. When a BuckleScript user deploys apps depending on BuckleScript, in theory, it only needs to deploy those generated JS artifacts, the native binary is not needed in production. However, they are still needed since they are bundled together. Allowing easy delivery of compiled code is one of the most desired [feature request](https://github.com/BuckleScript/bucklescript/issues/2772) by the community.


In this release, we solve the problem by embedding the binary artifacts into the compiler directly and load it on demand. 

To make it possible, we try to make the binary data platform agnostic and as compact as possible to avoid size bloating. The entrance of loading cmi/cmj has to be adapted to this new way.

So whenever the compiler tries to load a module from stdlib, it will consult a lazy data-structure in the compiler itself instead of consulting external file system.

## What's the benefit?

- More accessiblity.
  
  Package installation is just downloading for prebuilt platforms. In the future, we can make it installable from system package manager as well. The subtle interaction with [yarn reinstall](https://github.com/BuckleScript/bucklescript/issues/2799) is also solved once for all.


- Easy separation between compiler and JS artifacts

    The compiler is just one relocatable file, this makes the separation between the compiler and generated JS artifacts easier. The remaining work is mostly to design a convention between compiler and stdlib version schemes.

- Yes, better compile performance

    A large set of files are not loaded from the file system but rather from memory now!

- Fast installation and reinstallation.

    Depending on your network speed, the installation is reduced from 15s to 3s. Reinstallation is almost a no-op now.    
<!-- TODO: collect data points later -->

- JS playground is easier to build 
    
    We translate the compiler into JS so that developers can play with it in the browser.  To make this happen, we used to fake the IO system, this not needed any more since no IO happens when compiling a single file to string.


## Some internal changes

To make this happen, the layout of binaries are changed to the below structure, it is **not recommended** for users to depend on the layout, but [it happens](https://github.com/BuckleScript/bucklescript/pull/4170#issuecomment-586959464), the new layout is as below

```

|-- bsb // node wrapper of bsb.exe
|-- bsc // node wrapper of bsc.exe
|
|-- win32
|     |-- bsb.exe
|     |-- bsc.exe 
|
|---darwin
|     |-- bsb.exe
|     |-- bsc.exe
|
|---linux
|     |-- bsb.exe
|     |-- bsc.exe

```
