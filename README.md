# proj5-mongo
Simple web-based list of dated memos kept in a MongoDB database accessed with Flask.


### Installation and Execution

1) Install and setup mongodb.

2) Download the repository.

3) Edit CONFIG.py for your environment (including your mongodb settings).

4) Setup the virtual enviroment:
```shell
cd /path/to/proj5-mongo
make
```

5) Run the flask app:
```shell
cd /path/to/proj5-mongo
source env/bin/activate
python3 main.py
```

### Usage

**Add a memo:** Enter a date in the date field and optionally add a memo text into the memo text field. Then press the green plus button to add it. Memos are added to the list in ascending order by date.

**Remove a memo:** Click on the red trash button next to the memo you want to remove.


### Resources

#### Website

- [jQuery](https://jquery.com/)
- [Boostrap](http://getbootstrap.com/)
- [Moment](http://momentjs.com/)
- [Jinja2](http://jinja.pocoo.org/)

#### Server

- [Flask](http://flask.pocoo.org/)
- [MongoDB](https://www.mongodb.org/)
- [Pymongo](https://api.mongodb.org/python/current/)
- [Arrow](http://crsmithdev.com/arrow/)
