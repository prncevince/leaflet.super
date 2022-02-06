library(leaflet)
library(leafgl)
library(leaflet.super)

map_5m <- leaflet() %>%
  addProviderTiles(provider = providers$CartoDB.DarkMatter) %>%
  # addGlPoints(data = pts, group = "pts", radius = 4) %>%
  # New function using leaflet.super
  # addSupClust(path = "data/big.json") %>%
  setView(lng = 0, lat = 0, zoom = 2)
