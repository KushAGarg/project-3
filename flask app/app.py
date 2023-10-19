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
    return (
        f"<b>Hawaii Climate API - Module 10 Challenge</b> <br/>"
        f"-----------------------------------------<br/>"
        f"<i>API DOCUMENTATION</i><br/>Available routes: <br/>"
        f"<br/>"
        f"To return a JSON dictionary of the last 12 months of precipitation data, use this path:<br/>"
        f"/api/v1.0/precipitation <br/>"
        f"<br/>"
        f"To return a JSON dictionary of all the stations included in the data set, use this path:<br/>"
        f"/api/v1.0/stations <br/>"
        f"<br/>"
        f"To return a JSON list of temperature observations for the previous year for the most-active station, use this path:<br/>"
        f"/api/v1.0/tobs <br/>"
        f"<br/>"
        f"The following paths will return the minimum, maximum, and average temperature over the given interval, \
            through the end of the dataset if a specified end-date is not included.<br/>"
        f"<br/>"
        f"/api/v1.0/start-date (Enter as format YYYY-MM-DD) <br/>"
        f"/api/v1.0/start-date/end-date (Enter as format YYYY-MM-DD/YYYY-MM-DD) <br/>"
        f"<br/>"
        f"<br/>"
        f"API by Andrew Prozorovsky"
    )

@app.route("/api/v1.0/all_data")
def all_data():
    """Return a JSON list of the dataset"""
    data = session.query(Ufos.id, Ufos.datetime, Ufos.city, Ufos.state, Ufos.shape, \
                         Ufos.duration_seconds, Ufos.latitude, Ufos.longitude).all()

    session.close()
    
    all_data = []
    for id, datetime, city, state, shape, duration_seconds, latitude, longitude in data:
        data_dict = {}
        data_dict["id"] = id
        data_dict["datetime"] = datetime
        data_dict["city"] = city
        data_dict["state"] = state
        data_dict["shape"] = shape
        data_dict["duration_seconds"] = duration_seconds
        data_dict["latitude"] = latitude
        data_dict["longitude"] = longitude
        all_data.append(data_dict)

    return (jsonify(all_data))

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

@app.route("/api/v1.0/<id>")
def call_id(id):
    """Return the JSON entry by its entered ID"""
    
    data = session.query(Ufos.id, Ufos.datetime, Ufos.city, Ufos.state, Ufos.shape, \
                         Ufos.duration_seconds, Ufos.latitude, Ufos.longitude)\
                            .filter(Ufos.id == id).all()

    session.close()

    sighting = []
    for id, datetime, city, state, shape, duration_seconds, latitude, longitude in data:
        data_dict = {}
        data_dict["id"] = id
        data_dict["datetime"] = datetime
        data_dict["city"] = city
        data_dict["state"] = state
        data_dict["shape"] = shape
        data_dict["duration_seconds"] = duration_seconds
        data_dict["latitude"] = latitude
        data_dict["longitude"] = longitude
        sighting.append(data_dict)

    return (jsonify(sighting))


## Routes needed:
# UPDATE HOME ROUTE -- incorrect
# Route to return JSON by state, average duration, number of entries, and the most common shape
# Route to return JSON by year
# Route to return JSON between given time period
# Route to return JSON above or below duration input
# Route to return JSON by shape

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True) 