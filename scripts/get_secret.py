import urllib2
import json
import sys

url = "http://taskcluster/secrets/v1/secret/repo:github.com/mozilla/example-addon-repo:pull-request"

try:
    res = urllib2.urlopen(url)
except:
    sys.exit(0)

if res.getcode() == 200:
    print json.load(res)['secret']['COVERALLS_REPO_TOKEN']
