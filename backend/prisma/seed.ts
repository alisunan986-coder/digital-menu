import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a sample restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      slug: 'ayla-restaurant',
      name: 'Ayla Restaurant',
      tagline: 'Taste Worth Waiting For',
      subTagline: 'Patience Meets Perfection',
      hours: JSON.stringify([{ days: 'Monday – Sunday', time: '6:30 AM – 10:00 PM' }]),
      location: 'Bole Road, Addis Ababa, Ethiopia',
    },
  })

  // Create categories
  const breakfastCategory = await prisma.category.create({
    data: { name: 'Breakfast', restaurantId: restaurant.id },
  })

  const lunchCategory = await prisma.category.create({
    data: { name: 'Lunch', restaurantId: restaurant.id },
  })

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Traditional Firfir',
        description: 'Torn injera simmered in a spiced berbere sauce with clarified butter.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        tag: 'Bestseller',
        categoryId: breakfastCategory.id,
      },
      {
        name: 'Doro Wat Special',
        description: 'Slow-cooked chicken stew in rich berbere sauce, served with hard-boiled egg.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        tag: "Chef's Choice",
        categoryId: lunchCategory.id,
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
