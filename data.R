# library(leaflet)
# library(leafgl)
# library(leaflet.super)
library(sf)
library(data.table)
library(arrow)
library(tictoc)

options(viewer = NULL) # view in browser

tic()
n_points <- 5*1e6 # 5 million
n_lon <- (180*2/10)+1
n_lat <- (90*2/10)+1
n_grid_10deg <- n_lon*n_lat
mult_5mil <- ceiling(sqrt(n_points/n_grid_10deg))
lon <- seq(-179, 179, length.out = n_lon*mult_5mil)
lat <- seq(-85, 85, length.out = n_lat*mult_5mil)
d_big <- st_as_sf(
  expand.grid(x=lon, y=lat),
  coords = c("x", "y"), crs = 4326
)
d_big$id <- 1:nrow(d_big)
toc()

tic()
n_points <- 5*1e3 # 5,000
n_lon <- (180*2/10)+1
n_lat <- (90*2/10)+1
n_grid_10deg <- n_lon*n_lat
mult_5mil <- ceiling(sqrt(n_points/n_grid_10deg))
lon <- seq(-179, 179, length.out = n_lon*mult_5mil)
lat <- seq(-85, 85, length.out = n_lat*mult_5mil)
d_sml <- st_as_sf(
  expand.grid(x=lon, y=lat),
  coords = c("x", "y"), crs = 4326
)
d_sml$id <- 1:nrow(d_sml)
toc()

tic()
if (! dir.exists('data')) dir.create('data')
sf::write_sf(d_sml, "data/small.json", driver = "GeoJSON")
toc()

tic()
if (! dir.exists('data')) dir.create('data')
sf::write_sf(d_big, "data/big.json", driver = "GeoJSON")
toc()

tic()
if (! dir.exists('data')) dir.create('data')
arrow::write_ipc_stream(d_sml, sink = "data/small.arrows")
toc()

map_5m <- leaflet() %>%
  addProviderTiles(provider = providers$CartoDB.DarkMatter) %>%
  # addGlPoints(data = pts, group = "pts", radius = 4) %>%
  # New function using leaflet.super
  # addSupClust(path = "data/big.json") %>%
  setView(lng = 0, lat = 0, zoom = 2)
