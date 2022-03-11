
/* ********************************************************************************************* */
// Set color of the marker based on magnitude's values  https://www.w3schools.com/colors/colors_names.asp
/* ********************************************************************************************* */
function markerColor(magnitude) {
    switch(true) {
        case (magnitude > 5): return 'Red'; break;
        case (magnitude > 4): return 'Orange'; break;
        case (magnitude > 3): return 'Yellow'; break;
        case (magnitude > 2): return 'Lime'; break;
        case (magnitude > 1): return 'YellowGreen'; break;
        case (magnitude <= 1): return 'DarkGreen'; break; 
    }
};


/* ********************************************************************************************* */
// Create earthquake overlay layer for the map with popups for onEachFeature event
/* ********************************************************************************************* */

// Store API endpoint inside urlEarthquakes
var urlEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Initialise new overlay earthquakes layer
var earthquakes = new L.LayerGroup();

// Pull earthquakeData via API call
d3.json(urlEarthquakes, function (earthquakeData) {
    
    // Check whether data had been read in this function
    console.log("earthquakeData: ", earthquakeData)

    // Define a function to run for each feature in the features array
    // Give each feature a popup describing the place, date & time, magnitude & category of the earthquake
    function createPopups(feature, layer) {
        
        // Define earthquake categories for the popups
        switch(true) {
        case (feature.properties.mag <= 2.9): quakeCat = "Micro"; break;
        case (feature.properties.mag <= 3.9): quakeCat = "Minor"; break;
        case (feature.properties.mag <= 4.9): quakeCat = "Light"; break;
        case (feature.properties.mag <= 5.9): quakeCat = "Moderate"; break;
        case (feature.properties.mag <= 6.9): quakeCat = "Strong"; break;
        case (feature.properties.mag <= 7.9): quakeCat = "Major"; break;
        case (feature.properties.mag >= 8 ): quakeCat = "Great"; break;
        };

        layer.bindPopup("<b><u>Location:</b></u> " + feature.properties.place 
                        + "<hr><b><u>Local Date & Time:</b></u> " + new Date(feature.properties.time)
                        + "<hr><b><u>Earthquake Magnitude:</b></u> " + feature.properties.mag 
                        + "<hr><b><u>Earthquake Category:</b></u> " + quakeCat);
    }

    // Create a GeoJSON layer for earthquakes containing the features array of the earthquakeData object
    var earthQuakeLayer = L.geoJSON(earthquakeData, {
        pointToLayer: function (geoJsonPoint, latlng) {
            // Set the marker's circle radius with scaled x4 magnitude's value
            return L.circleMarker(latlng, { radius: geoJsonPoint.properties.mag * 4 });
        },

        // Format the magnitude markers
        style: function (marker) {  
            return {
                fillColor: markerColor(marker.properties.mag),
                fillOpacity: 0.7,
                weight: 0.2,
                color: 'black'
            }
        },

        // Run leaflet built-in onEachFeature function once for each piece of earthquakes data in the array
        // Call function createPopups to add popup box on the map
        onEachFeature: createPopups
   
    });

    // Check earthquake overlay layer
    console.log("earthquake layer: ", earthQuakeLayer);

    // Update the new earthquakes overlay layer group with earthquakes data
    earthQuakeLayer.addTo(earthquakes);
    
    // Sending earthquakes overlay layer to createMap function to generate map
    createMap(earthquakes);
})


/* ********************************************************************************************* */
// Create tectonicplate overlay layer for the map
/* ********************************************************************************************* */

// Store API endpoint inside urlTectonicplates
var urlTectonicplates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Initialise new tectonicPlate overlay layer
var tectonicPlates = new L.LayerGroup();

// Create boundary plates and add to tectonicPlates map layer
d3.json(urlTectonicplates, function (platesData) {

    // Check whether tectonic plates data had been read
    console.log("tectonic platesData: ", platesData)

    // Draw plates boundary from tectonic plates data
    L.geoJSON(platesData.features, {
        style: function (drawBoundary) {
            return {
                weight: 2,
                color: 'Brown'
            }
        },

    // Update the new tectonicPlates overlay layer group with tectonicplates data
    }).addTo(tectonicPlates);

    // Check tectonitPlates overlay layer
    console.log("tectonicPlates layer - tectonicPlates: ", tectonicPlates);
})


/* ********************************************************************************************* */
// Create map with all layers and magnitude marker's legend
// https://docs.mapbox.com/mapbox-gl-js/example/setstyle/
/* ********************************************************************************************* */

function createMap(earthquakes) {
    
    // Define basemap satellite layer
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    // Define basemap dark layer
    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define basemap grayscale layer 
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Define basemap outdoor layer
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 20,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold all basemap layers
    var baseMaps = {
        "Satellite": satellite,
        "Dark Mode": dark,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    // Create overlay object to hold all the overlay layers by calling function earthquakes & tectonicPlates
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": tectonicPlates
    };

    // Create default map layers (upon page refresh/load) with satellite, earthquakes and tectonicPlates
    // Use div "map" element in the index.html to display map
    var myMap = L.map("map", {
        center: [10, -10],
        zoom: 2,
        layers: [satellite, earthquakes, tectonicPlates]
    });
    

    // Create magnitude's heatmap legend by using built-in leaflet-control function (L.control), 
    // position it at the bottom right corner of the map
    var mapLegend = L.control({ position: 'bottomright' });
    mapLegend.onAdd = function () {

        // Create and insert new "div" element in html class "leaflet-control" for displaying marker's legend
        var newHTMLdiv = L.DomUtil.create('div', 'legend'),

        // Set map legend scale from 0 to 5
        magScale = [0, 1, 2, 3, 4, 5];

        // Under div "legend", insert html tag for formating the legend heading
        newHTMLdiv.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>";
        
        // Under div "legend", create new customised html tags <grp> to hold the color code of the magnitude's marker size based on magScale
        for (var index = 0; index < magScale.length; index++) {
            newHTMLdiv.innerHTML += '<grp style="background:' + markerColor(magScale[index] + 1) + '"></grp> '
                                    + magScale[index] + (magScale[index + 1] ? '&ndash;' + magScale[index + 1] + '<br>' : '+');
        }
        return newHTMLdiv;
    };

    // Add heatmap legend to the map
    mapLegend.addTo(myMap);

    // Add control box to the map with all possible layers & overlays
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

}
/* ********************************************************************************************* */

