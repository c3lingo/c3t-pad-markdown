#! /bin/sh

curl -s 'https://data.c3voc.de/rC3_21/everything.schedule.xml' |
sed -n -e 's_.*<room>\s*\(.*\)\s*</room>.*_\1_p' |
sort -u

