// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);

  //Create function for circle markers based on magnitude, with stylization
  function CircleMarker(feature,latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: "grey",
        weight: 1.2,
        opacity: 2,
        fillOpacity: 0.5
    }
    return L.circleMarker( latlng, options );
}

function createFeatures(earthquakeData) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
     onEachFeature: function(feature,layer){
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + "Magnitude: " + (feature.properties.mag) + "</p>");
  },
      pointToLayer: CircleMarker
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define lightmap layer
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": dark,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
    // ***** Put heatmap legend here? *****
  };

  // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //Legend
  var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4>Magnitude</h4>"

         for (var i = 0; i < magnitude.length; i++) {
             div.innerHTML +=
             '<i style="background:' + chooseColor(magnitude[i] + 1) + '"></i>'
             + magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);

  }

// Magnitude Colors
function chooseColor(mag){
    if (mag <= 1) {
        return "#33cc33";}

        else if (mag <= 2){
            return "#c2f0c2";}
            
        else if (mag <= 3){
            return "#ffcc00";}

        else if (mag <= 4){
            return "#e68a00";}
                
        else if (mag <= 5){
            return "#e65c00";}
                    
        else {
            return "#cc0000";}
    };
})
