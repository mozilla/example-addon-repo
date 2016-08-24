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

Tag & push to Docker hub

## .taskcluster.yml

The .taskcluster.yml file lists the tests to run, which Docker images to run them
on and when to run them. This should be configured as necessary for the repository,
see the [taskcluster-github](https://docs.taskcluster.net/manual/vcs/github) docs
for more information.

## TaskClusterRobot

The TaskClusterRobot needs to be added to the list of contributors for
the repository for it to be able to report PR status properly. You'll need
to add it with read/write permissions.
