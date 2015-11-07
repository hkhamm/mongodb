"""
Configuration of 'memos' Flask app. 
Edit to fit development or deployment environment.

"""
import random

# localhost
# PORT = 5000
# DEBUG = True
# MONGO_PORT = 

# ix.cs.uoregon.edu
PORT = random.randint(5000, 8000)
DEBUG = False  # Because it's unsafe to run outside localhost

# both
MONGO_PW = ''
MONGO_USER = ''
MONGO_PORT = 
MONGO_DB = ''
MONGO_URL = 'mongodb://{$MONGO_USER}:{$MONGO_PW}@localhost:{$MONGO_PORT}/{$MONGO_DB}'
