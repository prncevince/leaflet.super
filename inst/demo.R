library(leaflet)
library(leaflet.super)

map_5m <- leaflet() %>%
  addProviderTiles(provider = providers$CartoDB.DarkMatter) %>%
  addSupClust(
    path = "data/big.arrow", ~lon, ~lat, layerId = ~ID, radius = 4, stroke = FALSE,
    fillOpacity = 0.8, label = ~paste("ID: ", ID, sep = ""),
    popupOptions = popupOptions(closeButton = FALSE),
    clusterOptions = markerClusterOptions()
  ) %>%
  setView(lng = 0, lat = 0, zoom = 2)
