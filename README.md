This repository is intended as an example repository containing templates and good practices for creating an add-on for Firefox. This could be a general add-on, or a system add-on built in a separate repository to mozilla-central.

# Aims

The aim is to bring together tools and services we've used on other system add-ons
(e.g. Hello), into a template/example repository, so that new projects can come
along and get a infrastructure together quickly, and be up and running with code,
test suites, coverage etc quickly.

# Bits currently missing

* Unit tests
* L10n
* Integration with m-c.

# Issues

Please see the [issues list](https://github.com/mozilla/example-addon-repo/issues)

# Documentation

It is intended that all parts of this repository have at least outline
documentation. If you find any parts that are missing, please file an issue or
create a PR.

* [Building, running code and tests](docs/Developing.md)
* [Keeping modules up to date via automated services](docs/ModulesUpdating.md)
* Testing
  * [Linting](docs/Linting.md)
  * [Functional Tests](docs/Functional.md)
  * [Continous Integration via Taskcluster](docs/Taskcluster.md)
