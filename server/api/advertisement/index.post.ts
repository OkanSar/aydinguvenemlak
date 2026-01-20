import {desc} from "drizzle-orm";

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        const form = await readFormData(event)

        const generateAdvertNo = async () => {
            const now = new Date()

            const yy = String(now.getFullYear()).slice(-2)
            const mm = String(now.getMonth() + 1).padStart(2, '0')
            const dd = String(now.getDate()).padStart(2, '0')

            const datePrefix = `${yy}${mm}${dd}` // örn: 250115

            // Aynı günün son ilanını bul
            const lastAdvert = await useDrizzle()
                .select({ advertNo: tables.advertisements.advertNo })
                .from(tables.advertisements)
                .where(sql`CAST(advertNo AS TEXT) LIKE ${datePrefix + '%'}`)
                .orderBy(desc(tables.advertisements.advertNo))
                .limit(1)

            let sequence = 1

            if (lastAdvert.length > 0) {
                const lastNo = String(lastAdvert[0].advertNo)
                sequence = Number(lastNo.slice(-2)) + 1
            }

            if (sequence > 99) {
                throw new Error('Günlük ilan limiti (99) aşıldı')
            }

            return Number(`${datePrefix}${String(sequence).padStart(2, '0')}`)
        }

        const data: Record<string, any> = {}
        const files: File[] = []

        /* ---------- FORM AYRIŞTIR ---------- */
        for (const [key, value] of form.entries()) {
            if (value instanceof File) {
                if (value.size > 0) {
                    files.push(value)
                }
            } else {
                data[key] = value
            }
        }

        /* ---------- IMAGE UPLOAD ---------- */
        const uploadedUrls: string[] = []

        for (const file of files) {
            ensureBlob(file, { types: ['image'] })

            const safeName = file.name
                .toLowerCase()
                .replaceAll(' ', '-')
                .replace(/[^a-z0-9.\-_]/g, '')

            const blob = await hubBlob().put(
                safeName,
                file,
                {
                    prefix: 'advertisements',
                    addRandomSuffix: true,
                }
            )

            const url = `${blob.pathname}`
            uploadedUrls.push(url)
        }

        const imageField = uploadedUrls.join('##')
        const advertNo = await generateAdvertNo()
        /* ---------- DB INSERT ---------- */
        const inserted = await useDrizzle()
            .insert(tables.advertisements)
            .values({
                title: data.title,
                description: data.description,
                detailDescription: data.detailDescription,
                image: imageField,

                price: Number(data.price),
                city: data.city,
                district: data.district,
                neighborhood: data.neighborhood,

                type: data.type,
                advertType: Number(data.advertType),
                status: Number(data.status),
                advertNo: advertNo,
                fromSale: data.fromSale || '',
                phoneNumber: data.phoneNumber,

                islandNo: data.islandNo ? Number(data.islandNo) : null,
                parcelNo: data.parcelNo ? Number(data.parcelNo) : null,
                plotMetreSquare: data.plotMetreSquare
                    ? Number(data.plotMetreSquare)
                    : null,
                plotMetreSquarePrice: data.plotMetreSquarePrice
                    ? Number(data.plotMetreSquarePrice)
                    : null,
                zoningStatus: data.zoningStatus,
                titleDeedStatus: data.titleDeedStatus,

                apartMetreSquareGross: data.apartMetreSquareGross ? Number(data.apartMetreSquareGross) : null,
                apartMetreSquareNet: data.apartMetreSquareNet ? Number(data.apartMetreSquareNet) : null,
                roomNumber: data.roomNumber,
                heatingType: data.heatingType,
                locatedFloor: data.locatedFloor ? Number(data.locatedFloor) : null,
                numberFloors: data.numberFloors ? Number(data.numberFloors) : null,
                buildingAge: data.buildingAge ? Number(data.buildingAge) : null,

                kitchen: data.kitchen ? Number(data.kitchen) : null,
                balcony: data.balcony ? Number(data.balcony) : null,
                elevator: data.elevator ? Number(data.elevator) : null,
                furnished: data.furnished ? Number(data.furnished) : null,
                usageStatus: data.usageStatus ? Number(data.usageStatus) : null,
                withinSite: data.withinSite ? Number(data.withinSite) : null,
                membershipFee: data.membershipFee ? Number(data.membershipFee) : null,
                creditEligibility: data.creditEligibility,
                location: data.location,
            })
            .returning()

        return { success: true, data: inserted }

    } catch (err: any) {
        console.error(err)
        return {
            success: false,
            message: err.message || 'İlan kaydı sırasında hata oluştu',
        }
    }
})


