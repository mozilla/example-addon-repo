# Generating docker-functional

We assume you have experience of Docker, if not, take a look at their
[getting started guide](https://docs.docker.com/engine/getstarted/).

From a mozilla-central checkout (does not need to be built), run:

```sh
./mach taskcluster-build-image desktop1604-test
```

This creates a local copy of the image, currently tagged "quay.io/mozilla/desktop1604-test".

Now build the docker image:

```sh
docker build -t <username>/example-addon-repo-functional .
```

Ideally at this stage you should test it out, but if you're working on an
experimental branch, it is sometimes easier to push it, and see what taskcluster
does with it.

Tag the image, and push it. For the tag, the recommended setting is
`YYYYMMDDNN.<changeset>`, where `YYYYMMDD` is the date, `NN` is the number of the
image created on that day, and `<changeset>` is the mozilla-central changeset the
original build image is based on.

```
docker tag <username>/example-addon-repo-functional:latest <username>/example-addon-repo-functional:2016082401.ca24710db69a
docker push <username>/example-addon-repo-functional:2016082401.ca24710db69a
```
