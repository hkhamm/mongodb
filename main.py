"""
Simple web-based list of dated memos kept in a MongoDB database accessed
with Flask.

@author H. Keith Hamm
@date: Fall 2015

"""


import flask
from flask import render_template
from flask import request
from flask import url_for

import json
import logging
import uuid
import CONFIG
import sys

# Date handling 
import arrow  # Replacement for datetime, based on moment.js
import datetime  # But we may still need time
from dateutil import tz  # For interpreting local times

# Mongo database
from pymongo import MongoClient
from bson import ObjectId



# Globals
app = flask.Flask(__name__)

try:
    dbclient = MongoClient(CONFIG.MONGO_URL)
    db = dbclient.memos
    collection = db.dated
except:
    print("Failure opening database. Is Mongo running? Correct password?")
    sys.exit(1)

app.secret_key = str(uuid.uuid4())


# Pages

@app.route("/")
@app.route("/index")
def index():
    app.logger.debug("Main page entry")
    flask.session['memos'] = get_memos()
    return flask.render_template('index.html')


@app.route("/_add_memo")
def add_memo():
    """
    Insert a memo into the database.
    """
    try:
        date = arrow.get(request.args.get('date', 0, type=str),
                         'YYYY/MM/DD').naive
        text = request.args.get('text', 0, type=str)

        record = {"type": "dated_memo",
                  "date": date,
                  "text": text}
        result = collection.insert(record)
        record_id = result.inserted_id
        print(record_id)

        message = 'Memo added.'
        result = True
    except:
        message = 'Memo not added.'
        record_id = ''
        result = False

    return flask.jsonify(message=message, record_id=record_id, result=result)


@app.route("/_remove_memo")
def remove_memo():
    """
    Delete a memo from the database.
    """
    try:
        object_id = request.args.get('object_id', 0, type=str)

        record = {"type": "dated_memo",
                  "_id": ObjectId(object_id)}
        result = collection.delete_one(record)

        app.logger.debug('result: ' + str(result.deleted_count))
        message = 'Memo removed.'
        result = True
    except:
        message = 'Memo not removed.'
        result = False

    return flask.jsonify(message=message, result=result)


@app.errorhandler(404)
def page_not_found(error):
    app.logger.debug("Page not found")
    return flask.render_template('page_not_found.html',
                                 badurl=request.base_url,
                                 linkback=url_for("index")), 404


# Functions used within the templates

@app.template_filter('humanize')
def humanize_arrow_date(date):
    """
    Date is internal UTC ISO format string.
    Output should be "today", "yesterday", "in 5 days", etc.
    Arrow will try to humanize down to the minute, so we
    need to catch 'today' as a special case. 
    """
    try:
        then = arrow.get(date).to('local')
        now = arrow.utcnow().to('local')
        if then.date() == now.date():
            human = "Today"
        else:
            human = then.humanize(now)
            if human == "in a day":
                human = "Tomorrow"
    except:
        human = date
    return human


@app.template_filter('format')
def format_arrow_date(date):

    return arrow.get(date).format('YYYY/MM/DD')


# Functions available to the page code above

def get_memos():
    """
    Returns all memos in the database, in a form that
    can be inserted directly in the 'session' object.
    """
    records = []
    records_dict = {}
    for record in collection.find({"type": "dated_memo"}):
        record['date'] = arrow.get(record['date']).isoformat()
        record['_id'] = str(record['_id'])
        records_dict[format_arrow_date(record['date'])] = record
    for key in sorted(records_dict):
        records.append(records_dict[key])
    return records


if __name__ == "__main__":
    # App is created above so that it will
    # exist whether this is 'main' or not
    # (e.g., if we are running in a CGI script)
    app.debug = CONFIG.DEBUG
    app.logger.setLevel(logging.DEBUG)
    # We run on localhost only if debugging,
    # otherwise accessible to world
    if CONFIG.DEBUG:
        # Reachable only from the same computer
        app.run(port=CONFIG.PORT)
    else:
        # Reachable from anywhere 
        app.run(port=CONFIG.PORT, host="0.0.0.0")
