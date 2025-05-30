# Bitespeed-Backend-Task
Backend API for customer identity reconciliation using Node.js, TypeScript, and Prisma with PostgreSQL.
Live URL
https://bitespeed-backend-task-sf1i.onrender.com/

Clone repo:
```bash
git clone https://github.com/aayushabhatia/Bitespeed-Backend-Task.git
```

Install packages:
```nginx
npm install
```

Set .env with your DATABASE_URL.

Run Prisma commands:
```perl
npx prisma generate
npx prisma db push
```

Start server:
```arduino
npm run dev
Server runs at http://localhost:3000.
```

API
POST /identify
Payload:
```json
{
  "email": "example@example.com",
  "phoneNumber": "+1234567890"
}
```
Response:
```json
{
  "customerId": "abc123",
  "message": "Customer identified successfully"
}
```
