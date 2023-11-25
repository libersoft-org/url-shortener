#!/bin/sh

#[ ! -d "./node_modules/" ] && bun i
screen -dmS shortener bun --hot shortener.js
