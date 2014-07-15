rm /etc/nginx/sites-enabled/nodelab
cp /nodelab_www/nodelab /etc/nginx/sites-available/nodelab
ln -s /etc/nginx/sites-available/nodelab /etc/nginx/sites-enabled/nodelab
rm /etc/nginx/sites-enabled/default
/etc/init.d/nginx restart
cd /nodelab_www/app/
pm2 restart all