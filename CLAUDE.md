@AGENTS.md

# AGENT – Personal Commercial Portfolio Website

## Project Overview

This is a **full-stack personal website** built with Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.  
The purpose of this website is to **showcase the owner’s portfolio, services, and commercial offerings**, while providing an admin panel to manage content.

---

## Core Features

### 1. Home Page

- Brief introduction of the owner
- Highlights of featured projects
- Quick links to services and contact

### 2. About / Profile Page

- Detailed information about the owner
- Resume / biography
- Skills and expertise

### 3. Projects

- List of projects with:
  - Thumbnail
  - Title
  - Short description
- Each project links to a **Project Detail Page**:
  - Full description
  - Images / media
  - Technologies used
  - Optional links to live demos or downloads

### 4. Services / Plans

- Showcase **different commercial plans** or services
- Pricing table with features
- Call-to-action buttons to contact or purchase

### 5. Contact

- Contact form (name, email, message)
- Social media / portfolio links
- Optional integration with email or CRM

### 6. Admin Panel

- Manage Projects, Services, and Featured Content
- CRUD operations for each section
- Option to toggle featured items on Home Page

### 7. Portfolio / Sample Work

- Gallery or carousel view of portfolio pieces
- Filters by type (e.g., commercial, personal, freelance)

---

## Additional Ideas / Advanced Features (Optional)

- **User interactions**: Visitors can like or bookmark projects
- **Analytics dashboard**: Track views on projects or service interest
- **Blog / News section**: Share updates, tutorials, or insights
- **Subscription or Newsletter signup**
- **Testimonials / Client Feedback section**
- **Dark / Light mode toggle**
- **Animations and micro-interactions** for modern UX

---

## Development Notes for AI Agent

- Build a clean **reusable component structure** (cards, grids, forms)
- Use **placeholder content** initially; UI styling can be improved later
- Ensure **API endpoints** exist for all content that will be managed by Admin Panel
- Use **TypeScript types** for all API responses and database models
- Prioritize **scalability and maintainability** over design perfection
- All pages should be fully **responsive** for mobile and desktop

---

## Tech Stack

- **Frontend & Backend**: Next.js App Router, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Deployment**: Cloud-ready, scalable

---

**Goal for AI Agent**:  
Generate the initial project skeleton with pages, components, API routes, and Drizzle schema for PostgreSQL. Do not implement final UI design. Keep code clean, modular, and ready for developer customization.
