import mozinstall
import os
import sys
import tempfile

tempdir = tempfile.mkdtemp()
firefox_exe = sys.argv[1]

install_folder = mozinstall.install(src=firefox_exe, dest=tempdir)
binary = mozinstall.get_binary(install_folder, 'Firefox')

if not os.path.exists("build"):
    os.makedirs("build")

f = open("build/fflocation.bat", "w")
f.write("set FIREFOX_BINARY=%s" % binary)
f.close()
f = open("build/fflocation.txt", "w")
f.write(binary)
f.close()
f = open("build/templocation.txt", "w")
f.write(tempdir)
f.close()
