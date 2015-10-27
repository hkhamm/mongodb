# Mongodb Notes

Create/Add user:

3.x: db.createUser({user: "memos_user", pwd: "peach-cobbler", roles: 
["readWrite"]})
2.4: db.addUser({user: "memos_user", pwd: "peach-cobbler", roles: 
["readWrite"]})


use memos: switch to db memos

show users: shows all users


# Project Notes

The user should be able to add dated memos, either from the same index page 
or from a separate page. Memos should be displayed in date order. The user 
should be able to delete memos.

HTML/CSS:
- on page load: list of memos currently in the database in date order
- buttons to add and remove memos
    - use bootstrap buttons at end of each memo for delete
    - provide main add memo button at bottom
- same as last time automatically add memo to db after text is entered/updated

JS:
- listeners for the fields and buttons
- use AJAX to send/receive data to/from server

Python Flask:
- add routes for add to/remove from database

Questions:
- Is it better to do validation in JS before sending to server or is it 
better to send to server, do validation, and report back as invalid before 
warning the user?