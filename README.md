# TaskFlow - Complete Task Platform

A full-stack web platform where users complete video tasks to earn monetary rewards. Features user authentication, task management, withdrawal requests, and admin controls.

## Features

### User Features
- **Authentication**: Secure login with JWT tokens and password hashing
- **Task Dashboard**: Complete 3 sequential video tasks
- **Progress Tracking**: Real-time balance and progress bar (0/3, 1/3, 2/3, 3/3)
- **Rewards**: Earn $12, $15, and $18 per task (up to $45 total)
- **Withdrawals**: Request bank transfers after completing all tasks
- **Email Integration**: Welcome emails with login credentials

### Admin Features
- **User Management**: Create users, view progress, activate/deactivate accounts
- **Task Management**: Edit video URLs, questions, answers, and rewards
- **Withdrawal Management**: Review and approve/reject withdrawal requests
- **Admin Dashboard**: Comprehensive analytics and control panel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT + bcryptjs
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **Email**: Ready for Resend/SendGrid integration
- **Payments**: Stripe webhook support

## Getting Started

### 1. Setup Database

\`\`\`bash
# Create PostgreSQL database
createdb taskflow

# Set DATABASE_URL in .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow

# Run migrations
npx prisma migrate dev

# Seed database with default tasks and admin user
npx prisma db seed
\`\`\`

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

\`\`\`env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_URL=http://localhost:3000

# Optional: Email & Payments
RESEND_API_KEY=re_xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PUBLISHABLE_KEY=pk_xxx
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Default Accounts

### Admin Account
- **Email**: admin@taskflow.com
- **Password**: admin123

### Test User (via API)
\`\`\`bash
curl -X POST http://localhost:3000/api/create-paid-user \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"user@example.com"}'
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `POST /api/password-reset/request` - Request password reset
- `POST /api/password-reset/verify` - Reset password with token

### User
- `GET /api/user/completions` - Get user's task completions
- `POST /api/tasks/submit-answer` - Submit task answer

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/create-paid-user` - Create user after payment

### Admin
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/[id]` - Update user status
- `PATCH /api/admin/tasks/[id]` - Edit task details
- `GET /api/admin/withdrawals` - List withdrawals
- `PATCH /api/admin/withdrawals/[id]` - Approve/reject withdrawal

## Routes

### Public
- `/login` - Login page
- `/checkout` - Payment page
- `/success` - Payment success
- `/cancel` - Payment cancelled

### Protected
- `/dashboard` - User dashboard
- `/dashboard/task/[id]` - Task detail page
- `/dashboard/withdraw` - Withdrawal form
- `/admin` - Admin panel

## Customization

### Edit Tasks
1. Login as admin (admin@taskflow.com)
2. Go to Admin Panel > Tasks
3. Click "Edit Task" to modify video URLs, questions, and rewards

### Change Rewards
Edit in Admin Panel - minimum $10 per task enforced

### Add More Tasks
Edit `prisma/seed.ts` and re-run seeding

## Deployment

### Deploy to Vercel

\`\`\`bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Import in Vercel
# Set environment variables in Vercel dashboard
# Database URL, JWT_SECRET, Stripe keys, etc.

# Deploy
vercel
\`\`\`

### Production Checklist

- [ ] Update `NEXT_PUBLIC_URL` environment variable
- [ ] Configure Stripe keys for production
- [ ] Setup email service (Resend/SendGrid)
- [ ] Update admin email
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure CORS for API endpoints
- [ ] Review security headers

## Security Notes

- All passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire after 7 days
- Admin routes require isAdmin flag
- Middleware protects all routes
- Row-level security recommended for production
- Use HTTPS in production
- Validate all inputs on server-side
- Keep JWT_SECRET and API keys secure

## Email Integration

Currently configured for Resend. To enable:

1. Get API key from resend.com
2. Add `RESEND_API_KEY` to environment
3. Uncomment email sending in `lib/email.ts`

## Payment Integration

Stripe webhooks are configured. To enable:

1. Get Stripe keys
2. Add keys to environment
3. Configure webhook in Stripe dashboard
4. Uncomment Stripe code in `app/api/create-checkout-session/route.ts`

## Database Schema

### Users
- id, email, name, password, balance, isActive, isAdmin, createdAt, updatedAt

### Tasks
- id, videoUrl, question, options, correctAnswer, rewardAmount, order, createdAt, updatedAt

### TaskCompletions
- id, userId, taskId, userAnswer, isCorrect, completedAt

### Withdrawals
- id, userId, fullName, country, bankName, accountNumber, swiftBic, email, amount, status, createdAt, updatedAt

### PasswordResets
- id, userId, token, expiresAt, createdAt

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists

### JWT Errors
- Verify JWT_SECRET matches between requests
- Check token hasn't expired
- Clear browser cookies if issues persist

### Admin Panel Not Accessible
- Verify user has isAdmin flag set
- Check JWT token is valid
- Ensure user is logged in

## Support

For issues or questions, check the documentation or open an issue on GitHub.

## License

MIT
