# c3t-pad-markdown

A tool that takes a Chaos Communication Congress schedule in XML format and spits it out in a format that's ready to be pasted into a Markdown editor.

The translation angels use these to coordinate their translation shifts.

## Installation

If you haven't already, install node.js. `v7.0.0` _works for me_, but in practice anything from `v4.0.0` should be fine. Then install this tool:

```sh
$ npm install -g c3t-pad-markdown
```

You can also install locally, i.e. without the `-g` option, in which case you probably have to set `NODE_PATH` to include the directory above the top directory of this package (or run the software from that directory).

## Usage

### Basic usage

To get the most recent schedule and turn it into Markdown files, you can run this:

```sh
$ curl https://events.ccc.de/congress/2017/Fahrplan/schedule.xml | c3t-pad-markdown
```

Of course, the XML doesn't have to come from curl; you can just as well pipe in a local file.

After a local install you will probably have run the software as `node c3t-pad-markdown`.

This will spit out sequentially numbered files into the `output` subdirectory that will be created in your current working directory.
There will be one file for each day in the schedule (`day1.md`, `day2.md`, …).

Upload these files into the collaborative editor of your choice.

### Helper script

A good place to run the software is the `run` subdirectory.
It contains a wrapper script `event.sh` which archives the previous contents of `output`, creating a new timestamped directory in `archive.zip`, then sets `NODE_PATH` and runs the main software, creating a new set of files from an schedule URL given in the command line.
This in turn is wrapped by event-specific scripts that are prepared with the correct URLs for an event; feel free to add a new one.

## Licence

[The MIT License; see the LICENSE file.](LICENSE)
