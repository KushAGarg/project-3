// Plotly visual where you choose a state and the metadata is populated as well as 
// a bar graph of the cities with the most sightings in that state. The metadata can
// contain the most common shape seen, the average/median duration of the encounter,
// the number of sightings in the state from the data, and maybe the oldest and most 
// recent recorded sightings.

//Translate the json to a variable
const url = "FLASK ROUTE HERE. JSONIFY ALL DATA."

//Fetch the json data in the console
d3.json(url).then(function(data) {
    console.log(data);
});

// Init function

// barChart function

// pieChart function

// metaData function

// optionChanged function

//Call the initialize function
// init();