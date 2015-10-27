"""
Configuration of 'memos' Flask app. 
Edit to fit development or deployment environment.

"""
import random

# localhost
PORT = 5000
DEBUG = True
MONGO_URL = "mongodb://memos_user:peach-cobbler@localhost:27017/memos"

# ix.cs.uoregon.edu
# PORT = random.randint(5000,8000)
# DEBUG = False # Because it's unsafe to run outside localhost
# MONGO_URL =  "mongodb://memos_user:peach-cobbler@localhost:4152/memos"  # on ix
