"""
Configuration of 'memos' Flask app. 
Edit to fit development or deployment environment.

"""
# import random

# localhost
# PORT = 5000
# DEBUG = True
# MONGO_PORT = 27017

# ix.cs.uoregon.edu
PORT = 7420  # random.randint(5000, 8000)
MONGO_PORT = 4152
DEBUG = False  # Because it's unsafe to run outside localhost

# both
MONGO_USER = 'memos_user'
MONGO_PW = 'peach-cobbler'
MONGO_DB = 'memos'
MONGO_URL = 'mongodb://{$MONGO_USER}:{$MONGO_PW}@localhost:{$MONGO_PORT}/{$MONGO_DB}'
