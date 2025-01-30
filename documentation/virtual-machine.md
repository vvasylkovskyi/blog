# Virtual Machine commands

Currently we have one virtual machine owned by us, and it is hosted on https://cloud.digitalocean.com/networking/domains/vvasylkovskyi.com?i=1d6419

Its IP can be found in the website above. All the hostnames and DNS are also managed by that machine.

### Access via SSH with Key

`$ ssh -i <key-location> <user>@<ip-address>`

Once you accessed it via SSH you can do everything that is needed. First go to `nginx` folder and see how to run nginx server using docker
