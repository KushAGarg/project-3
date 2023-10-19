// Plotly visual where you choose a state and the metadata is populated as well as 
// a bar graph of the cities with the most sightings in that state. The metadata can
// contain the most common shape seen, the average/median duration of the encounter,
// the number of sightings in the state from the data, and maybe the oldest and most 
// recent recorded sightings.

//Translate the json to a variable
const url = "http://127.0.0.1:5000/api/v1.0/all_data"

//Fetch the json data in the console
d3.json(url).then(function(data) {
    console.log(data);
});

// Init function
function init() {

}

// barChart function
function barChart(state) {

}

// pieChart function
function pieChart(state) {

}

// metaData function
function metaData(state) {

}

// optionChanged function
function optionChanged(state) {
    
}

//Call the initialize function
// init();