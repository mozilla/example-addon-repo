# Installation

You'll need normal unix command-line utilities. Currently the build process has
only been tested/maintained on Mac/Linux systems.

If you want to try it on Windows, then installing
[MozillaBuild](https://wiki.mozilla.org/MozillaBuild) will provide some tools
for the command line.

Assuming you have the basic utilities, then you also need:

* [node.js](https://nodejs.org/) with npm.
  * Version 4.x of node is currently the minium required.
* Firefox Nightly installed on your system.
  * This is currently for running Firefox for the add-on.
* Firefox Release installed on your system.
  * This is currently for running the tests.

Note: The split of different Firefox versions will be fixed by
https://github.com/mozilla/example-addon-repo/issues/5.

To install all the support packages for the repository run:

```shell
$ npm install
```

# Running the add-on in Firefox

```shell
$ npm run firefox
```

# Running tests

This command runs all tests:

```shell
$ npm test
```

You can run individual tests, e.g.

```shell
$ npm run test:lint
$ npm run test:func
```

More information on the tests in this repository
[can be found here](https://github.com/mozilla/example-addon-repo/#documentation).

# Bundling an xpi

```shell
$ npm run bundle
```

