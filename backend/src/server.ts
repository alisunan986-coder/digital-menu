import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import type { NextFunction, Request, Response } from 'express'

/* ────────────────────────────────────────────────────────── */

const prisma = new PrismaClient()
const app = express()
const PORT = Number(process.env.PORT ?? 5000)

app.use(cors())
app.use(express.json())

/** Wraps async route handlers so rejections reach the error middleware. */
const asyncHandler =
  (handler: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res).catch(next)
  }

/* ────────────────────────────────────────────────────────── */
/* Telegram notification via Bot API                         */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim()
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID?.trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || 'taem2026admin'

if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
  console.log(`✅ [telegram] Bot alert configured for Chat ID: ${TELEGRAM_CHAT_ID}`)
} else {
  console.warn(`[telegram] Push alerts disabled — missing credentials in .env`)
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

async function sendTelegramAlert(details: {
  rating: number
  name: string
  comment: string
  receivedAt: Date
}): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return

  const stars = '⭐'.repeat(details.rating) + '☆'.repeat(5 - details.rating)
  const message = [
    `🔔 *New Feedback — Taem Kitchen*`,
    ``,
    `*Rating:* ${stars} (${details.rating}/5)`,
    `*From:* ${escapeMarkdown(details.name)}`,
    `*Comment:* ${escapeMarkdown(details.comment || '—')}`,
    `*Time:* ${details.receivedAt.toUTCString()}`,
  ].join('\n')

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    if (response.ok) {
      console.log(`📱 [telegram] Alert sent to chat ${TELEGRAM_CHAT_ID}`)
    } else {
      const errData = await response.text()
      console.warn('[telegram] failed to send alert:', errData)
    }
  } catch (error) {
    console.warn('[telegram] error:', error instanceof Error ? error.message : error)
  }
}

/* ────────────────────────────────────────────────────────── */
/* Routes                                                     */

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

/** POST /api/admin/verify — verify owner password */
app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body ?? {}
  if (typeof password === 'string' && password.trim() === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Authenticated successfully' })
  } else {
    res.status(401).json({ error: 'Incorrect owner password.' })
  }
})

/** GET /api/menu/:slug — full menu for one restaurant. */
app.get(
  '/api/menu/:slug',
  asyncHandler(async (req, res) => {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: req.params.slug },
      include: {
        categories: {
          orderBy: { createdAt: 'asc' },
          include: {
            menuItems: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    })

    if (!restaurant) {
      res.status(404).json({ error: `No restaurant found for slug "${req.params.slug}"` })
      return
    }

    res.json(restaurant)
  }),
)
/** POST /api/menu/items — create a dish (no id) or update one (id provided). */
app.post(
  '/api/menu/items',
  asyncHandler(async (req, res) => {
    const { id, name, description, price, image, tag, categoryId, categoryName } = (req.body ?? {}) as {
      id?: unknown
      name?: unknown
      description?: unknown
      price?: unknown
      image?: unknown
      tag?: unknown
      categoryId?: unknown
      categoryName?: unknown
    }

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Field "name" is required and must be a non-empty string.' })
      return
    }
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      res.status(400).json({ error: 'Field "price" must be a non-negative number (ETB).' })
      return
    }

    // Auto-resolve categoryId if missing or unlinked
    let resolvedCategoryId: string | null = typeof categoryId === 'string' && categoryId !== '' ? categoryId : null

    if (!resolvedCategoryId) {
      const targetCategoryName = typeof categoryName === 'string' && categoryName.trim() !== '' ? categoryName.trim() : 'General'
      
      let category = await prisma.category.findFirst({
        where: { name: targetCategoryName },
      })

      if (!category) {
        // Find default restaurant or fallback
        const restaurant = await prisma.restaurant.findFirst()
        if (!restaurant) {
          res.status(400).json({ error: 'No restaurant found in database.' })
          return
        }

        category = await prisma.category.create({
          data: {
            name: targetCategoryName,
            restaurantId: restaurant.id,
          },
        })
      }

      resolvedCategoryId = category.id
    }

    const data = {
      name: name.trim(),
      description: typeof description === 'string' ? description : '',
      price,
      image: typeof image === 'string' && image.trim() !== '' ? image : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
      tag: typeof tag === 'string' && tag.trim() !== '' ? tag : null,
      categoryId: resolvedCategoryId,
    }

    const item =
      typeof id === 'string' && id !== ''
        ? await prisma.menuItem.update({ where: { id }, data })
        : await prisma.menuItem.create({ data })

    res.status(typeof id === 'string' && id !== '' ? 200 : 201).json(item)
  }),
)

/** DELETE /api/menu/items/:id — delete a dish from the menu */
app.delete(
  '/api/menu/items/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ error: 'Item ID is required.' })
      return
    }

    try {
      await prisma.menuItem.delete({ where: { id } })
      res.json({ success: true, message: 'Item deleted successfully.' })
    } catch {
      res.status(404).json({ error: 'Item not found in database.' })
    }
  }),
)

/** POST /api/feedback — store a 5-star review + Telegram push alert. */
app.post(
  '/api/feedback',
  asyncHandler(async (req, res) => {
    const { rating, customerName, comment, restaurantId, restaurantSlug } = (req.body ?? {}) as {
      rating?: unknown
      customerName?: unknown
      comment?: unknown
      restaurantId?: unknown
      restaurantSlug?: unknown
    }

    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Field "rating" must be an integer between 1 and 5.' })
      return
    }
    if (comment !== undefined && typeof comment !== 'string') {
      res.status(400).json({ error: 'Field "comment" must be a string.' })
      return
    }
    if (customerName !== undefined && typeof customerName !== 'string') {
      res.status(400).json({ error: 'Field "customerName" must be a string.' })
      return
    }

    let resolvedId: string | null = null
    if (typeof restaurantId === 'string' && restaurantId !== '') {
      resolvedId = restaurantId
    } else if (typeof restaurantSlug === 'string' && restaurantSlug !== '') {
      const restaurant = await prisma.restaurant.findUnique({
        where: { slug: restaurantSlug },
        select: { id: true },
      })
      if (!restaurant) {
        res.status(404).json({ error: `No restaurant found for slug "${restaurantSlug}"` })
        return
      }
      resolvedId = restaurant.id
    } else {
      const defaultRestaurant = await prisma.restaurant.findFirst({
        select: { id: true },
      })
      if (!defaultRestaurant) {
        res.status(400).json({ error: 'No restaurant found in database to attach feedback to.' })
        return
      }
      resolvedId = defaultRestaurant.id
    }

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        customerName: typeof customerName === 'string' ? customerName.trim() || null : null,
        comment: typeof comment === 'string' ? comment : '',
        restaurantId: resolvedId,
      },
    })

    void sendTelegramAlert({
      rating,
      name: feedback.customerName ?? 'Anonymous',
      comment: feedback.comment,
      receivedAt: feedback.createdAt,
    })

    res.status(201).json(feedback)
  }),
)

/* ────────────────────────────────────────────────────────── */
/* Fallback + error middleware                                */

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const prismaError = error as { code?: string; message?: string }

  if (prismaError?.code === 'P2025') {
    res.status(404).json({ error: 'Record not found (nothing to update).' })
    return
  }
  if (prismaError?.code === 'P2003') {
    res.status(400).json({ error: 'Related record does not exist (foreign key violation).' })
    return
  }

  console.error('[api] unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

/* ────────────────────────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`✅ API server listening on http://localhost:${PORT}`)
  console.log(`   POST /api/admin/verify — verify owner passcode`)
  console.log(`   GET  /api/menu/:slug   — fetch full menu`)
  console.log(`   POST /api/menu/items   — add or update a dish`)
  console.log(`   DELETE /api/menu/items/:id — delete a dish`)
  console.log(`   POST /api/feedback     — store a review + Telegram alert`)
})