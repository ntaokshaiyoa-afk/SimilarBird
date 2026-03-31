import geojson from '@/data/lines/武蔵野線.geojson'
import { parseRailwayGeoJSON } from '@/lib/geo/parseRailwayGeoJSON'

export function useRailway() {
  const parsed = parseRailwayGeoJSON(geojson.features)

  return {
    stations: parsed.stations,
    mainLine: parsed.mainLine,
    stationSegments: parsed.stationSegments,
  }
}
