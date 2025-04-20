# Coffee Tracker

A serverless application built with SST and Next.js to track daily coffee intake. Features include:
- Track coffee consumption in various units (ml, cups, fl oz)
- Switch between metric and imperial measurements
- View history of coffee consumption
- Serverless DynamoDB backend

## Tech Stack
- Next.js (Frontend)
- SST (Infrastructure as Code)
- DynamoDB (Database)
- Material UI (UI Components)
- GitHub Actions (CI/CD)

## Development

### Prerequisites
- Node.js 20+
- AWS Account and configured credentials
- VS Code with Dev Containers extension (recommended)

### Getting Started with Dev Container
1. Clone the repository
2. Open in VS Code
3. When prompted, click "Reopen in Container"
4. Run `npm install`
5. Run `npm run dev` to start the development server

### Local Development without Dev Container
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

### Deployment
The application automatically deploys to AWS when changes are pushed to the main branch.

To deploy manually:
```bash
npx sst deploy --stage prod
```

## Environment Variables
- `COFFEE_INTAKE_TABLE`: DynamoDB table name (set automatically by SST)

## License
MIT
