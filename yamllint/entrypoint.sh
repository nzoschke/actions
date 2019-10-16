#!/bin/sh -l

CONFIG=${1:-"{extends: default}"}
STRICT=${2:-true}
FILE=${3:-.}

[ "$STRICT" = "true" ] && STRICT="-s" || STRICT=""

yamllint -d "$CONFIG" $STRICT $FILE
