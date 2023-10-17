# Import the dependencies.
import numpy as np
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

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

print(Base.classes.keys())

#################################################
# Flask Routes
#################################################
@app.route("/")
def home():
    """How to use API documentation -- home"""
    return ()

@app.route("/api/v1.0/all_locations")
def stations():
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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True) 