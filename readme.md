# sourcefoundry - a idiomatic `git server`

a small, simple, idiomatic `git` frontend.

## bugs

- need `"`/`'` around directive paths
- asset files!!
  how do we even resolve this..
  - serve `public` (and adjust inline paths manually)
  - serve `public` and resolve paths
  - serve configurable directories
  - ahhh
- if `server.onload` is blocking, the page will freeze. 
  a configurable max timeout?
- i think smew is, for some reason, deleting certain strings
  like `$template`??
  MAJOR wtf!
