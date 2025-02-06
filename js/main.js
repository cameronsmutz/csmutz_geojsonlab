// set mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiY3NtdXR6eSIsImEiOiJjbTFqamx6YjMxMHUwMmpweHFodGljY2J1In0.HMxiHUZ8QXW-J1rPNZgzPg';

// create map object
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    zoom: 4.4, // starting zoom
    center: [104, 48] // starting center
});

// Load GeoJSON
async function geojsonFetch() { 
    let response, parks, aimags, table;
    response = await fetch('assets/parks.geojson');
    parks = await response.json();
    response = await fetch('assets/aimags.geojson');
    aimags = await response.json();
    
    //load data to the map as new layers and table on the side.
    map.on('load', function loadingData() {

        map.addSource('parks', {
            type: 'geojson',
         data: parks
        });

        map.addLayer({
            'id': 'parks-layer',
            'type': 'fill',
            'source': 'parks',
            'paint': {
                'fill-color': 'green',
                'fill-opacity': 0.5
            }
        });


        map.addSource('aimags', {
            type: 'geojson',
            data: aimags
        });

        map.addLayer({
            'id': 'aimags-layer',
            'type': 'line',
            'source': 'aimags',
            'paint': {
                'line-color': 'black',
                'line-width': 3
            }
        });

        map.addLayer({
            'id': 'aimags-labels',
            'type': 'symbol',
            'source': 'aimags',
            'layout': {
                'text-field': ['get', 'NAME'],
                'text-size': 14,
                'text-anchor': 'center'
            },
            'paint': {
                'text-color': 'black'
            }
        });

        // Add click event for parks layer
        map.on('click', 'parks-layer', function (e) {
            let coordinates = e.lngLat;
            let name = e.features[0].properties.NAME;

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<strong>${name}</strong>`)
                .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the parks layer
        map.on('mouseenter', 'parks-layer', function () {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves
        map.on('mouseleave', 'parks-layer', function () {
            map.getCanvas().style.cursor = '';
        });

    });

table = document.getElementsByTagName("table")[0];
let row, cell1, cell2, cell3;
for (let i = 0; i < parks.features.length; i++) {
    // Create an empty <tr> element and add it to the 1st position of the table:
    row = table.insertRow(-1);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell1.innerHTML = parks.features[i].properties.NAME;
    cell2.innerHTML = parks.features[i].properties.DESIG;
    cell3.innerHTML = parks.features[i].properties.STATUS_YR;
}

 };

geojsonFetch();

let btnSortByDesignation = document.getElementsByTagName("button")[0];
let btnSortAlphabetically = document.getElementsByTagName("button")[1];

btnSortByDesignation.addEventListener('click', sortTableByDesignation);
btnSortAlphabetically.addEventListener('click', sortTableAlphabetically);

// define the function to sort table BY DESIGNATION
function sortTableByDesignation(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("td")[1].innerHTML.toLowerCase();
            y = rows[i + 1].getElementsByTagName("td")[1].innerHTML.toLowerCase();
            //check if the two rows should switch place:
            if (x > y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

// define the function to sort table ALPHABETICALLY BY NAME
function sortTableAlphabetically(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("td")[0].innerHTML.toLowerCase();
            y = rows[i + 1].getElementsByTagName("td")[0].innerHTML.toLowerCase();
            //check if the two rows should switch place:
            if (x > y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
