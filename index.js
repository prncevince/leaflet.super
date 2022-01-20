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
var placesUrl = './data/small.json';
//var placesUrl = './data/big.json';
// var placesUrl = 'https://cdn.rawgit.com/mapbox/supercluster/v4.0.1/test/fixtures/places.json';
var index;
var ready = false;

function getPoints(x) {
  return new Promise(resolve => {
    jQuery.getJSON(x, (geojson) => resolve(geojson))
    //d3.json(x).then((geojson) => resolve(geojson), (e) => console.log(e))
  }).then(
    (geojson) => geojson,
    (e) => console.log(e)
  )
}

async function loadPoints() {
  try {
    var geojson = await getPoints(placesUrl)
    //var geojson = getPoints(placesUrl);
    console.log('here I am')
    index = supercluster({
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

//Promise.resolve(jQuery.getJSON(placesUrl, function(geojson) {
//  // Initialize the supercluster index.
//  index = supercluster({
//    radius: 60,
//    extent: 256,
//    maxZoom: 18
//  }).load(geojson.features); // Expects an array of Features.
//  //ready = true;
//  //update();
//}
////).done(
////  function(){
////    console.log("complete!")
////    ready = true;
////    update();
////  }
//).fail(function(geojson){
//  console.log("error")
//  // Initialize the supercluster index.
//  index = supercluster({
//    radius: 60,
//    extent: 256,
//    maxZoom: 18
//  }).load(geojson.features); // Expects an array of Features.
//}).always(function(){
//  console.log("always.")
//})).then(
//  function(){
//    console.log("complete!")
//    ready = true;
//    update();
//  },
//  function(){
//    console.log("errored!")
//    ready = true;
//    update();
//  }
//)

function createClusterIcon(feature, latlng) {
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
    icon: icon
  });
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
