# What is Taskcluster?

[TaskCluster](https://docs.taskcluster.net/) is the task execution
framework that supports Mozilla's continuous integration and release
processes.

In this respository, it is used with
[taskcluster-github](https://docs.taskcluster.net/manual/vcs/github)
integration to provide testing for the example add-on.

Note that Taskcluster will only work with repositories in the "mozilla"
organisation on github. Mozilla repositories outside of that will need
to be specially whitelisted. Ask the #taskcluster team for details.

# Setting up Taskcluster on a new Repository

Taskcluster tests will only run if there is a .taskcluster.yml on the
branch being pushed to. Therefore, integration will need to be developed and
tested on a branch within a repository in the Mozilla organisation.

## Docker images

The docker images are based on mozilla-central images. They may need to be
regenerated from time to time to add features, or to keep updated.

See the instructions in the `docker-*` directories for more information on how
to regenerate them.

## .taskcluster.yml

The .taskcluster.yml file lists the tests to run, which Docker images to run them
on and when to run them. This should be configured as necessary for the repository,
see the [taskcluster-github](https://docs.taskcluster.net/manual/vcs/github) docs
for more information.

## TaskClusterRobot

The TaskClusterRobot needs to be added to the list of contributors for
the repository for it to be able to report PR status properly. You'll need
to add it with read/write permissions.

## Unit Tests and Coveralls.

When run on Taskcluster, the unit tests will generate code coverage information
to be uploaded to coveralls.

To enable this for a new repository:

* Ask in #taskcluster for credentials for:
  * Yourself/main developers to get:
    * secrets:set:repo:github.com/mozilla/example-addon-repo:*
    * secrets:get:repo:github.com/mozilla/example-addon-repo:*
  * Your repository to get:
    * secrets:get:repo:github.com/mozilla/example-addon-repo:*
  * Replace the url to your repository in the secrets above.
* Log into Coveralls.
* Go to the "Add repositories section".
* Search for the repository and select "Turn On".
* Go to the repository page (select "Details").
* There you will see the repo_token. Make a copy of it.
* In Taskcluster, go to the [secrets tool](https://tools.taskcluster.net/secrets/).
  * Enter the secret name as `repo:github.com/mozilla/example-addon-repo:pull-request`
    * (replace the repository url as appropriate)
  * Set the expiry date to something in the future.
  * Set the JSON secret to (using the appropriate token):

```json
{
  "COVERALLS_REPO_TOKEN": "abcdefghijklmnopq"
}
```

* Hit "Create Secret".

# Integrating with TreeHerder

Integration with TreeHerder not possible at this time. In theory it should be
as simple as cloning [bug 1297671](https://bugzilla.mozilla.org/show_bug.cgi?id=1297671)
and its patch, however the work to hook github and treeherder together is not
complete (there are examples, but they are hacks).
