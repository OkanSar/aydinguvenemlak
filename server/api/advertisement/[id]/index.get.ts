export default defineEventHandler(async (event) => {
   try {
      const { id } = event.context.params as { id: string }
      if (!id) return "İlan bulunamadı"

      const ad = await useDrizzle()
          .select()
          .from(tables.advertisements)
          .where(eq(tables.advertisements.id, Number(id))).all()

      const formattedAds = ad.map(ads => ({
         ...ads,
         images: ads.image
             ? ads.image.split('##').filter(Boolean)
             : []
      }))
      return {
         success: true,
         data: formattedAds
      }
   }  catch (err) {
      return {
         success: false,
         message: 'İlan bulunamadı'
      }
   }
});