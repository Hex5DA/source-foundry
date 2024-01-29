# sourcefoundry - a idiomatic `git server`

a small, simple, idiomatic `git` frontend.

## goals

this project was done primarily to stress-test `rtc`

furthermore, i'm targeting feature parity with [stagit]<https://codemadness.org/stagit.html> (the project's primary inspiration)
  as listed below:

* Log of all commits from HEAD.
* Show file tree with linkable line numbers.
* Show references: local branches and tags.
* Make index page for multiple repositories with stagit-index.

- Log and diffstat per commit.
- Detect README and LICENSE file from HEAD and link it as a webpage.
- Atom feed of the commit log (atom.xml).
- Atom feed of the tags/refs (tags.xml).
? Detect submodules (.gitmodules file) from HEAD and link it as a webpage.

## TODO

- branches
- text format parser (& name)
- [`falcon`] test framework

## bugs

- need `"`/`'` around directive paths
- public directories should be configurable
- `/layouts/default.html` -> `/default.html` (path roots)
- if `server.onload` is blocking, the page will freeze. 
  > a [configurable] max timeout?
- seperate `ssr` into own pkg (seperate from server again)
  >> can use as a library, ie. for `tern` or as binary, ie. for SSG
  >> SSG: just change buildsteps
          support github pages - github CI to rebuild on push!
- `tern-ssr` hardcores `url: "http:localhost:8080/"
- `tern` - cull any element with a specified class (strip server-side code before serving!)

## pipeline

1. `smew`
2. copy static files to `dist/`
3. [minify `dist/`](https://github.com/wilsonzlin/minify-html)
4. [cull CSS (read: `skua`)](https://github.com/purifycss/purifycss)
5. `tern`

