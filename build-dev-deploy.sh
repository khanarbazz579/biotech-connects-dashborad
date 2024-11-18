ng build 
# mv dist/can-frontend-boilerplate/ deploy
# rm -R dist
# mv deploy/ dist
scp -r dist/ root@172.104.187.208:/home/crsuser/projects/prodo/prodo-dashboard/dist
scp -r node_modules/ root@172.104.187.208:/var/www/html/defcom/defcom/bropex