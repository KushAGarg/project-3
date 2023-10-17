// Flask App necessary first in order to use SQL data to make Leaflet map
// Flask App will utilize the SQL database to jsonify the necessary elements (latitude and longitude)
// JSON data from Flask App will then be available for use by Leaflet

// UFO coordinates
let queryUrl = "http://127.0.0.1:5000/api/v1.0/all_locations";

d3.json(queryUrl).then(function(data) {
    console.log(data);
    createFeatures(data);
});

function createMap(ufos) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Night Map": dark,
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Ufos: ufos
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [dark, ufos]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    // Create a legend to display information about our map.
    let legend = L.control({
      position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "legend");

      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = ["green", "yellowgreen", "yellow", "orange", "orangered","red"]

      //Assistance
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'>&nbsp;</i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };

    // Add the info legend to the map.
    legend.addTo(myMap);
}

function createFeatures(ufoData) {
  
    function createCircleMarker(coord) {
      let options = {
        radius: 1,
        fillOpacity: 0.75,
        color: "black"
      }
      return L.circleMarker(coord, options);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    
    // EASIER TO AVOID USING GEOJSON IF YOU CAN MAKE CIRCLE MARKERS WITHOUT USING GEOJSON.
    let ufos = L.geoJSON(ufoData, {
      pointToLayer: createCircleMarker
    });

    // Send our earthquakes layer to the createMap function/
    createMap(ufos);
}