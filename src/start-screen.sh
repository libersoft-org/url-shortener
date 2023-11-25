#!/bin/sh

#[ ! -d "./node_modules/" ] && bun i
screen -dmS shortener bash -c '
while true; do
 bun shortener.js || exit 1
done
'
