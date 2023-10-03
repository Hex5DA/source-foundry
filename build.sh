#! /bin/sh
cd ../rtc/smew
cargo build
cd ../../src-foundry
../rtc/smew/target/debug/smew
cp -r public dist
node ../rtc/tern/index.js dist/
