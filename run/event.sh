#! /bin/sh

set -e

if [ -t 0 ]; then
	url="$1"
	if [ -z "$url" ]; then
		echo "need a URL parameter or XML on stdin" >&2
		exit 2
	fi
	shift
fi

if [ -d output -a -n "` ls output/*.md 2>/dev/null | head -n1 `" ]; then
	timestamp="`stat -c '%Y' output/*.md | sort -rn | head -n1 `"
	timestamp="` date -d @$timestamp +'%Y%m%d-%H%M' `"
	mv output output-$timestamp
	zip -q9r archive.zip output-$timestamp
	rm -rf output-$timestamp
fi

if [ -t 0 ]; then
	curl -s "$url"
else
	cat
fi |
NODE_PATH=../.. node c3t-pad-markdown ${1+"$@"}

