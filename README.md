# Ciergio Admin Tool

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## FEES
BANK_FEE_PERCENT=0.03
BANK_FEE_FIX=7.5
OCI_FEE_PERCENT=0.05

### FOMULAS
Bank_Fee = ADD( MULTIPLY( amount, BANK_FEE_PERCENT), BANK_FEE_FIX )
OCI Fee = MULTIPLY( SUBTRACT(amount, Bank_Fee),OCI_FEE_PERCENT )

### Example
Amount Donated = 500

Bank_Fee(%) : 500 x 0.03 = 15
Final Bank Fee : 15 + 7.5 = 22.5
Amount Remaining : 500 - 22.5 = 477.5

OCI Fee : 477.5 x 0.05 = 23.875 (rounded off to 23.88 in display)

Net Amount : 500 - ( 22.5 + 23.875 ) = 453.625 (rounded off to 453.63 in display)

Test Deployment 1

