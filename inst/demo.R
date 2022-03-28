library(leaflet)
library(leaflet.super)

map_5m <- leaflet() %>%
  addProviderTiles(provider = providers$CartoDB.DarkMatter) %>%
  addCircleMarkers(
    data = d, ~lon, ~lat, layerId = ~ID, radius = 4, stroke = FALSE,
    fillOpacity = 0.8, label = ~paste("Target: ", geoID, sep = ""),
    popupOptions = popupOptions(closeButton = FALSE),
    clusterOptions = markerClusterOptions()
  )
  # addGlPoints(data = pts, group = "pts", radius = 4) %>%
  # New function using leaflet.super
  # addSupClust(path = "data/big.arrow") %>%
  setView(lng = 0, lat = 0, zoom = 2)
