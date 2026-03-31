export type Station = {
  name: string
  coord: [number, number]
  uri?: string
}

export function parseRailwayGeoJSON(features: GeoJSON.Feature[]) {
  const stations = new Map<string, Station>()
  const stationSegments: [number, number][][] = []
  let mainLine: [number, number][][] = []

  for (const f of features) {
    const g = f.geometry
    const p = f.properties as any

    if (!g) continue

    if (g.type === 'Point') {
      stations.set(p.name, {
        name: p.name,
        coord: g.coordinates as [number, number],
        uri: p.uri,
      })
    }

    if (g.type === 'LineString') {
      stationSegments.push(g.coordinates as [number, number][])
    }

    if (g.type === 'MultiLineString') {
      mainLine = g.coordinates as [number, number][][]
    }
  }

  return {
    stations: Array.from(stations.values()),
    mainLine,
    stationSegments,
  }
}
