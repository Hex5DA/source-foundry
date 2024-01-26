#!/bin/zsh

echo "building..."

# rebuild smew
#cd ../rtc/smew
#cargo build
#cd ../../src-foundry
../rtc/smew/target/debug/smew

# minification
# ./minify --do-not-minify-doctype --ensure-spec-compliant-unquoted-attribute-values --keep-spaces-between-attributes --minify-js --minify-css dist/**/*.html
## ./uncss dist/**/*.html

# tern
cp -r public dist
node ../rtc/tern/index.js dist/
