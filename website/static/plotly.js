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
    console.log(data[1])
});

// Init function
function init() {

    //Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
        
    let states = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
        "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
        "DC", "PR"
    ];
    
    //Add values to the dropdown menu
    states.forEach((state) => {
        dropdownMenu.append("option")
        .text(state).property("value", state);
    });

    // Set the default state.
    let defaultState = states[0];
    console.log(defaultState);

    //Build the initial plots here
    barChart(defaultState);
    pieChart(defaultState);
    metaData(defaultState);

}

// barChart function
function barChart(state) {
// Bar chart that shows the top 10 cities in the state where there were sightings.

    lowercase_state = state.toLowerCase();

    d3.json(url).then((data) => {
    
        // Filter the data by the given state.
        let stateData = data.filter(result => result.state == lowercase_state);

        // Find the top 10 cities represented in the newly-filtered data.
        let stateCities = [];

        stateData.forEach((elt) => {
            // Check if the city is already in state_cities
            const cityIndex = stateCities.findIndex((city) => city[0] === elt.city);

            if (cityIndex === -1) {
                // If the city is not in state_cities, add it with a count of 1
                stateCities.push([elt.city, 1]);
            } else {
                // If the city is already in state_cities, increment its count
                stateCities[cityIndex][1] += 1;
            }
        });

        // Sort the state_cities based on the highest counts. 
        stateCities.sort((a, b) => b[1] - a[1]);
        console.log(stateCities);

        const top10Cities = stateCities.slice(0, 10);
        const cities = top10Cities.map(cityData => cityData[0]).reverse();
        const counts = top10Cities.map(cityData => cityData[1]).reverse();

        // Plot
        let trace = {
            x: counts,
            y: cities,
            type: "bar",
            orientation: "h"
        }
        
        // Create the data array and layout
        let bar_data = [trace];
        let layout = {
            title: `Top 10 Cities in ${state} with UFO Sightings`
        };

        // Plot the bar chart
        Plotly.newPlot("bar", bar_data, layout);

    })

}

// pieChart function
function pieChart(state) {
// Pie chart that shows the descriptors (shapes) in the state where there were sightings.

lowercase_state = state.toLowerCase();

    d3.json(url).then((data) => {

        // Filter the data by the given state.
        let stateData = data.filter(result => result.state == lowercase_state);

        // Find the shapes represented in the newly-filtered data.
        let stateShapes = [];

        stateData.forEach((elt) => {
            // Check if the shape is already in state_shapes
            const shapeIndex = stateShapes.findIndex((shape) => shape[0] === elt.shape);

            if (shapeIndex === -1) {
                // If the city is not in state_cities, add it with a count of 1
                stateShapes.push([elt.shape, 1]);
            } else {
                // If the city is already in state_cities, increment its count
                stateShapes[shapeIndex][1] += 1;
            }
        });

        // Get rid of null (NULL IS STILL APPEARING)
        let newStateShapes = stateShapes.filter(item => item !== null && item !== undefined && item !== "" && item !== "null");

        // Sort the state_cities based on the highest counts.
        newStateShapes.sort((a, b) => b[1] - a[1]);

        const top10Shapes = newStateShapes.slice(0, 20);

        // Sum the counts of all items beyond the first 10
        const otherCount = newStateShapes.slice(10).reduce((total, item) => total + item[1], 0);

        // Create a new array combining the top 10 and "other" category
        const combinedData = [
            ...top10Shapes,
            ["Other", otherCount]
        ];
        console.log(combinedData);

        // Extract labels and values from combinedData
        const labels = combinedData.map(data => data[0]);
        const values = combinedData.map(data => data[1]);

        // Define the data trace for the pie chart
        const pie_data = [
            {
                labels: labels,
                values: values,
                type: "pie"
            }
        ];

        // Define the layout options (optional)
        const layout = {
            title: "State sightings by primary descriptor",
            // Add other layout options here
        };

        // Create the pie chart
        Plotly.newPlot("pie", pie_data, layout);

    })

}

// metaData function
function metaData(state) {
// The metadata should have the number of sightings in the state (of the total), the median duration of the encounter,
// the most common shape seen, the oldest sighting, and the most recent sighting from the data.

    lowercase_state = state.toLowerCase();

    d3.json(url).then((data) => {

        // Filter the data by the given state.
        let stateData = data.filter(result => result.state == lowercase_state);

        // Number of sightings
        const sightings = stateData.length;

        // Median duration
        const medianDuration = 0;

        // Most common shape
        const commonShape = "n/a";

        // Oldest sighting
        const oldestSighting = "YYYY-MM-DD";

        // Most recent sighting
        const newestSighting = "YYYY-MM-DD";

        // Populate metadata
        d3.select("#sample-metadata").append("h5").html(
            `Sightings: ${sightings}/65113 (${Math.round(sightings/65113 * 100, 2)}%)<br/>Median duration: ${medianDuration}<br/>\
            Popular descriptor: ${commonShape}<br/>Oldest sighting: ${oldestSighting}<br/>Most recent sighting: ${newestSighting}`
        );

    })

}

// optionChanged function
function optionChanged(state) {
    
    //Log new value
    console.log(state);

    //Call all functions
    barChart(state);
    pieChart(state);
    metaData(state);

}

//Call the initialize function
init();