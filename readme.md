# sourcefoundry - a idiomatic `git server`

a small, simple, idiomatic `git` frontend.

## TODO

- TODO: test branches. i think they're a little (a lot) fucky
- collapse directories
- text format parser and "standard"
- investigate `atom` feeds
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
- `skua` responsive forms / form styling
- `tern-ssr` hardcores `url: "http:localhost:8080/"

## pipeline

1. `smew`
2. copy static files to `dist/`
3. [minify `dist/`](https://github.com/wilsonzlin/minify-html)
4. [cull CSS (read: `skua`)](https://github.com/purifycss/purifycss)
5. `tern`

