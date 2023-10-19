# Import the dependencies.
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS


#################################################
# Database Setup
#################################################
engine = create_engine("postgresql+psycopg2://postgres:password@localhost:5432/project-3")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
Ufos = Base.classes.ufos

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

print(Base.classes.keys())

#################################################
# Flask Routes
#################################################
@app.route("/")
def home():
    """How to use API documentation -- home"""
    return ()

@app.route("/api/v1.0/all_locations")
def all_locations():
    """Return a JSON list of UFO sighting coordinates from the dataset"""
    data = session.query(Ufos.id, Ufos.latitude, Ufos.longitude).all()

    session.close()
    
    all_coordinates = []
    for id, latitude, longitude in data:
        coords_dict = {}
        coords_dict["id"] = id
        coords_dict["latitude"] = latitude
        coords_dict["longitude"] = longitude
        all_coordinates.append(coords_dict)

    return (jsonify(all_coordinates))

## Marker clusters to avoid Leaflet problem

@app.route("/api/v1.0/before2000")
def before2000():
    """Return a JSON list of UFO sighting coordinates before the year 2000"""
    data = session.query(Ufos.datetime, Ufos.id, Ufos.latitude, Ufos.longitude).filter(Ufos.datetime <= func.date("2000-01-01")).all()

    session.close()
    
    all_coordinates = []
    for datetime, id, latitude, longitude in data:
        coords_dict = {}
        coords_dict["datetime"] = datetime
        coords_dict["id"] = id
        coords_dict["latitude"] = latitude
        coords_dict["longitude"] = longitude
        all_coordinates.append(coords_dict)

    return (jsonify(all_coordinates))

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True) 