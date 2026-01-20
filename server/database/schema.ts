import {relations, sql} from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
})

export const advertisements = sqliteTable('advertisements', {
  id: integer('id').primaryKey({ autoIncrement: true }), //auto
  title: text('title').notNull(), //text
  description: text('description').notNull(), //text
  detailDescription: text('detailDescription').notNull(), //text editor
  image: text('image').notNull(), //text - blob image
  price: integer('price').notNull(), //number
  city: text('city').notNull(), //text select
  district: text('district').notNull(), //text-select
  neighborhood: text('neighborhood'), //text-select
  type: text('type').notNull(), //Arsa - Daire
  advertType: integer('advertType').notNull(), //0-1 , Kiralık - Satılık
  status: integer('status').notNull(), //0-1, Yayında - Pasif
  advertNo: integer('advertNo').unique().notNull(), //not editable
  fromSale: text('fromSale'), //text
  createdAt: text('createdAt').default(sql`(CURRENT_TIMESTAMP)`), //auto
  phoneNumber: text('phoneNumber').notNull(), //11 haneli,numeric text

  //if type === 'Arsa'
  islandNo: integer('islandNo'), //number
  parcelNo: integer('parcelNo'), //number
  plotMetreSquare: integer('metreSquare'), //number
  plotMetreSquarePrice: integer('metreSquarePrice'), //number
  zoningStatus: text('zoningStatus'), //İmar D., text

  //if type === 'Daire'
  apartMetreSquareGross: integer('apartMetreSquareGross'), //number
  apartMetreSquareNet: integer('apartMetreSquareNet'), //number
  roomNumber: text('roomNumber'), //4+1, text
  heatingType: text('heatingType'), //text
  locatedFloor: integer('locatedFloor'), //Bulunan kat, number
  numberFloors: integer('numberFloors'), //Bina kat, number
  buildingAge: integer('buildingAge'), //Bina Yaş, number
  kitchen: integer('kitchen'), //0-1, Amerikan - Kapalı
  balcony: integer('balcony'), //0-1, Var - Yok
  elevator: integer('elevator'), //0-1, Var - Yok
  furnished: integer('furnished'), //0-1, Evet - Hayır
  usageStatus: integer('usageStatus'), //0-1, Evet - Hayır
  withinSite: integer('withinSite'), //0-1, Evet - Hayır
  membershipFee: integer('membershipFee'), //number

  titleDeedStatus: text('titleDeedStatus'), //Tapu D., text
  creditEligibility: text('creditEligibility'), //text
  location: text('location'), //google location iframe select
  viewCount: integer('viewCount').default(0).notNull(), //view count
})

export const highlightAdvert = sqliteTable('highlightAdvert', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  advertId: integer('advertId').unique().notNull(),
  order: integer('order').notNull(),
})

export const advertisementViews = sqliteTable('advertisement_views', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  advertId: integer('advertId').notNull(),
  ip: text('ip').notNull(),
  createdAt: text('createdAt').default(sql`(CURRENT_TIMESTAMP)`),
})

export const cities = sqliteTable('cities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
})

export const districts = sqliteTable('districts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  cityId: integer('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
})

export const neighborhoods = sqliteTable('neighborhoods', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  districtId: integer('district_id')
      .notNull()
      .references(() => districts.id, { onDelete: 'cascade' }),
})

export const cityRelations = relations(cities, ({ many }) => ({
  districts: many(districts),
}))

export const districtRelations = relations(districts, ({ many, one }) => ({
  city: one(cities, {
    fields: [districts.cityId],
    references: [cities.id],
  }),
  neighborhoods: many(neighborhoods),
}))