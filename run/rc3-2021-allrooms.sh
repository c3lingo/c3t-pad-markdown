#! /bin/sh

curl -s 'https://static.rc3.world/schedule/everything.xml' |
sed -n -e 's_.*<room>\s*\(.*\)\s*</room>.*_\1_p' |
sort -u

