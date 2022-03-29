#' Add a supercluster layer
#'
#' @param map a map widget object created from `leaflet::leaflet()`
#' @param path relative path / absolute URL to an Arrow IPC stream file
#' @examples
#' \dontrun{
#' map <- leaflet() %>%
#'   addProviderTiles(provider = providers$CartoDB.DarkMatter) %>%
#'   addSupClust(
#'     path = "data/big.arrow", ~lon, ~lat, layerId = ~ID, radius = 4, stroke = FALSE,
#'     fillOpacity = 0.8, label = ~paste("ID: ", ID, sep = ""),
#'     popupOptions = popupOptions(closeButton = FALSE),
#'     clusterOptions = markerClusterOptions()
#'   ) %>%
#'   setView(lng = 0, lat = 0, zoom = 2)
#' }
#' @export
addSupClust <- function(map, path=""){}
