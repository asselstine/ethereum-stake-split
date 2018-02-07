#! /bin/sh
watchman-make -p 'contracts/**' 'test/**' --make=truffle -t test
