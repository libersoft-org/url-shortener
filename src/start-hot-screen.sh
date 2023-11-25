#!/bin/sh

#[ ! -d "./node_modules/" ] && bun i
screen -dmS shortener bun --watch shortener.js
