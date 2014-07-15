#!/usr/bin/env bash

apt-get update

# Install tools
apt-get install -y python-software-properties python g++ make nginx git libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential

# Install node.js from its own repo
add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs


# Set up nginx
cp /nodelab_www/nodelab /etc/nginx/sites-available/nodelab
ln -s /etc/nginx/sites-available/nodelab /etc/nginx/sites-enabled/nodelab
rm /etc/nginx/sites-enabled/default

/etc/init.d/nginx restart

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org


# Set up node.js project
echo "|------ NOW INSTALLING SERVER SIDE DEPENDANCIES"
cd /nodelab_www/app
sudo npm install canvas
sudo npm install mongodb
# npm install express passport twitter request opentype
echo "|------ NOW INSTALLING CLIENT SIDE DEPENDANCIES"
sudo npm install -g bower grunt-cli pm2
# node app.js &
