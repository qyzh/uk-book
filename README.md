# UK Book Tracker

A modern book tracking application built with Next.js 16, Supabase, and Tailwind CSS.

## Features

- 📚 **Book Management** - Add, edit, and track books
- 📖 **Reading Progress** - Track current page and reading status
- 🏷️ **Classification** - Organize by genre, language, and author
- 📝 **Book Summaries** - Store and view book descriptions
- 💬 **Quotes** - Save your favorite quotes from books
- 🎯 **Reading Status** - Track with status (to-read, reading, completed, wishlist)
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔐 **Admin Dashboard** - Secure book management interface

## Tech Stack

- **Framework**: Next.js 16.2.3
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Language**: TypeScript
- **Runtime**: Node.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd uk-book

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Running Locally

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── admin/              # Admin dashboard for book management
├── api/                # API routes (books, authors, quotes)
├── books/              # Book detail and add pages
├── browse/             # Library browsing with filters
├── components/         # Reusable components
├── page.tsx            # Home page
└── layout.tsx          # Root layout

lib/
├── supabase.ts         # Supabase client
└── auth-context.tsx    # Authentication context
```

## Routes

### Public Pages
- `/` - Home (currently reading showcase)
- `/browse` - Browse library with filters
- `/browse/[category]` - Browse by status/genre
- `/books/[id]` - Book detail page

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/login` - Admin login

### API Endpoints
- `GET/POST /api/books` - All books
- `GET/PUT/DELETE /api/books/[id]` - Single book
- `GET /api/authors` - Authors
- `GET /api/quotes` - Quotes
- `GET /api/quotes/[id]` - Single quote

## Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Documentation

For detailed setup and implementation notes, see the `/docs` folder.

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
