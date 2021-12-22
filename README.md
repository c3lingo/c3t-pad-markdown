# c3t-pad

A tool that takes a Chaos Communication Congress schedule in XML format and spits it out in a format that's ready to be pasted into a Markdown editor.

The translation angels use these to coordinate their translation shifts.

## Usage

If you haven't already, install node.js. `v7.0.0` _works for me_, but in practice anything from `v4.0.0` should be fine. Then install this tool:

```sh
$ npm install -g c3t-pad-markdown
```

Once installed, you can get the most recent schedule and turn it into Markdown files:

```sh
$ curl https://events.ccc.de/congress/2017/Fahrplan/schedule.xml | c3t-pad-markdown
```

Of course, the XML doesn't have to come from curl; you can just as well pipe in a local file.

This will spit out sequentially numbered files into an `output/` directory in your current working directory; one for each day of the conference (`day1.md`, `day2.md`, …).

Open each of them in a web browser, copy everything and paste it into an appropriate document.

## Licence

[The MIT License; see the LICENSE file.](LICENSE)
