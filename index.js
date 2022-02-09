//import L from 'leaflet'
//import Supercluster from 'supercluster'
//import Arrow from 'apache-arrow'

var map = L.map('map').setView([0, 0], 0);

// Empty Layer Group that will receive the clusters data on the fly.
var markers = L.geoJSON(null, {
  pointToLayer: createClusterIcon
}).addTo(map);

// Update the displayed clusters after user pan / zoom.
map.on('moveend', update);

function update() {
  if (!ready) return;
  var bounds = map.getBounds();
  var bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
  var zoom = map.getZoom();
  var clusters = index.getClusters(bbox, zoom);
  markers.clearLayers();
  markers.addData(clusters);
}

// Zoom to expand the cluster clicked by user.
markers.on('click', function(e) {
  var clusterId = e.layer.feature.properties.cluster_id;
  var center = e.latlng;
  var expansionZoom;
  if (clusterId) {
    expansionZoom = index.getClusterExpansionZoom(clusterId);
    map.flyTo(center, expansionZoom);
  }
});

// Retrieve Points data.
var placesUrl = './data/small.arrow';
var index;
var ready = false;

function getPoints(x) {
  return new Promise(resolve => {
    jQuery.getJSON(x, (geojson) => resolve(geojson))
  }).then(
    (geojson) => geojson,
    (e) => console.log(e)
  )
}

function getTable(x) {
  return Arrow.tableFromIPC(fetch(x))
}


function arrowTableToGeojson(table) {
  var geojson = GeoJSON.parse(table.toArray(), {Point: ['y', 'x']})
  return geojson
}

//var table;
//var geojson;
// declaring with var in the async function keeps variables local
async function loadPoints() {
  try {
    //var geojson = await getPoints(placesUrl)
    var table = await getTable(placesUrl)
    var geojson = arrowTableToGeojson(table)
    console.log('here I am')
    index = new Supercluster({
      radius: 60,
      extent: 256,
      maxZoom: 18
    }).load(geojson.features); // Expects an array of Features.
    ready = true;
    update();
  } catch(e) {
    console.log(e);
  }
}

loadPoints();

function createClusterIcon(feature, latlng) {
  // ran after reached max zoom :) 
  if (!feature.properties.cluster) return L.marker(latlng);

  var count = feature.properties.point_count;
  var size =
    count < 100 ? 'small' :
    count < 1000 ? 'medium' : 'large';
  var icon = L.divIcon({
    html: '<div><span>' + feature.properties.point_count_abbreviated + '</span></div>',
    className: 'marker-cluster marker-cluster-' + size,
    iconSize: L.point(40, 40)
  });

  return L.marker(latlng, {
    icon: icon,
    title: count
  });
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
