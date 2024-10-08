Welcome to sammichfinance, deployed as https://TVLIST.XYZ   ....

Sandwich Finance was a useful tool popular among crypto/ perpetual futures traders used to download .txt file watchlists for all assets on a given exchange. Unfortunately the dev no longer wanted to continue the project, but thats okay, we can make an open source and free version with more features and more exchanges.

Features:
- Download by quote token/ assets per exchange, or all assets per exchange (tradingview only allows lists up to 1000 assets, so it breaks up download into multiple lists if over 1000 assets)
- Calls each exchange's relevant API to get most up to date list. Never needs to be updated manually if new assets or pair types are added.
- Formats API response to proper tradingview format for each exchange
- Allows "MIX AND MATCH" downloads which is any combinatintion of assets from any combination of exchanges.
- Open source

To Deploy locally:
-npm install
-npm run dev

To deploy to Vercel
- should be able to one click deploy from vercel dashboard from github, no environment variables currently needed since it uses public apis rather than ones with keys needed


Feel free to submit a pull request if you want to add anything to the official deployment on TVLIST.XYZ . 





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
