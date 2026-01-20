import { eq } from 'drizzle-orm'
import { cities, districts, neighborhoods } from '~~/server/database/schema'

export default defineEventHandler(async () => {
    const rows = await useDrizzle()
        .select()
        .from(cities)
        .leftJoin(districts, eq(cities.id, districts.cityId))
        .leftJoin(neighborhoods, eq(districts.id, neighborhoods.districtId))

    const result = []

    for (const row of rows) {
        const city = row.cities
        const district = row.districts
        const neighborhood = row.neighborhoods

        // CITY
        let cityItem = result.find(c => c.id === city.id)
        if (!cityItem) {
            cityItem = {
                id: city.id,
                name: city.name,
                districts: [],
            }
            result.push(cityItem)
        }

        // DISTRICT
        if (district) {
            let districtItem = cityItem.districts.find(d => d.id === district.id)
            if (!districtItem) {
                districtItem = {
                    id: district.id,
                    name: district.name,
                    neighborhoods: [],
                }
                cityItem.districts.push(districtItem)
            }

            // NEIGHBORHOOD
            if (neighborhood) {
                const exists = districtItem.neighborhoods.some(
                    n => n.id === neighborhood.id,
                )
                if (!exists) {
                    districtItem.neighborhoods.push({
                        id: neighborhood.id,
                        name: neighborhood.name,
                    })
                }
            }
        }
    }

    return result
})
