from server.mongo import Mongo,MongoSave,MongoLoad, MongoUpd
from flask import Flask, render_template, request, jsonify, redirect, session, url_for
import pprint,json
from os.path import join,dirname
from sys import platform

from server.database import mdb
from server.url import url

from wsgiref.simple_server import make_server


app= Flask(__name__)
app.config.from_mapping(SECRET_KEY='mysecret')


app.register_blueprint(mdb)
app.register_blueprint(url)

if __name__ == '__main__' :
    with make_server('',5000,app) as server:
        if(platform.startswith('win')):
            print("Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)")
        else:
            print("Running on http://127.0.0.1:5000/ (Press CTRL+Z to quit)")
        server.serve_forever()
        
        