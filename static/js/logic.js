

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


/*********************************************************************/

// Function to give different color to different earthquake magnitudes
function getColor(mag) {
    if (mag <= 0){
        return  '#EEF5DB';
    }
    else if (mag <= 1){
        return  '#B5F44A';
    }
    else if(mag <= 2){
        return '#70EE9C';
    }
    else if(mag <= 3){
        return 'yellow';
    }
    else if(mag <= 4){
        return 'orange';
    }
    else if(mag <= 5){
        return '#DD614A';
    }
    else{
        return 'red';
    }
}



//Function to give different radius to different earthquake magnitudes

function getSize(mag) {
    if (mag <= 0){
        return  2;
    }
    else if (mag <= 1){
        return  4;
    }
    else if(mag <= 2){
        return 6;
    }
    else if(mag <= 3){
        return 8;
    }
    else if(mag <= 4){
        return 10;
    }
    else if(mag <= 5){
        return 12;
    }
    else{
        return 14;
    }
}


/************************************************************/

function createFeatures(earthquakeData) {
    console.log(earthquakeData)
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place +
      "</h2><hr>"+"<h3>Magnitude: "+ feature.properties.mag+"</h3>"+"<p>" + new Date(feature.properties.time) + "</p>");

  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature and pointToLayer function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        console.log(feature.properties.mag)
        return L.circleMarker(latlng, 
            {radius: getSize(feature.properties.mag), 
            fillOpacity: 1, 
            color: 'black', 
            fillColor: getColor(feature.properties.mag), 
            weight: 1,});
    }
  });


    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


/****************************************************************/

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

 
// Adding a Legend
function getLegendColor(d) {
    if (d <= 1){
        return  '#B5F44A';
    }
    else if(d <= 2){
        return '#70EE9C';
    }
    else if(d <= 3){
        return 'yellow';
    }
    else if(d <= 4){
        return 'orange';
    }
    else if(d <= 5){
        return '#DD614A';
    }
    else{
        return 'red';
    }
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        console.log("******************************************");
        console.log(grades[i] + 1);
        div.innerHTML +=
            '<i style="background:' + getLegendColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        console.log("******************************************");
    }

    return div;
};

legend.addTo(myMap);

}
