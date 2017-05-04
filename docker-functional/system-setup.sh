#!/usr/bin/env bash
# This allows ubuntu-desktop to be installed without human interaction
export DEBIAN_FRONTEND=noninteractive

set -ve

test `whoami` == 'root'

mkdir -p /setup
cd /setup

# Without this we get spurious "LC_ALL: cannot change locale (en_US.UTF-8)" errors,
# and python scripts raise UnicodeEncodeError when trying to print unicode characters.
locale-gen en_US.UTF-8
dpkg-reconfigure locales

# The desktop1604-test version is currently good enough for us.
# install node

#curl -O https://nodejs.org/dist/v4.5.0/node-v4.5.0-linux-x64.tar.xz
#tar -C /usr/local --strip-components 1 -xJ < node-*.tar.xz
#node -v  # verify
#npm -v

cd /
rm -rf /setup
