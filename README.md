# SafeLink
SafeLink is a link checker powered by Cloudflare 1.1.1.1 via DNS over HTTPS (DoH). It provides a quick check if the link you are about to visit is safe for browsing.

SafeLink prevents you from dangerous sites or downloads dangerous files by showing warnings to users. It also shows an admonition statement if you are about to see possible adult content on that link.

## Website
Visit at [`safelink.one`](https://safelink.one/)

## Why SafeLink?
I built this weekend project to contribute and make the Internet safer for everyone and also to submit my entry at the 2021 Cloudflare Summer Developer Challenge. Despite little time to build and enhance this prototype, I was looking forward to seeing how SafeLink could make help you browse the internet with safer links one link at a time.

## Getting started
This is running on Cloudflare Workers and Cloudflare KV.

1. Configure wrangler.toml

1. Deploy the Cloudflare worker with:
```console
npm run test && wrangler publish
```

## Bugs and Issues
I built this over the weekend quickly so for sure there are bugs. Open an issue via GitHub and I'll try to fix it soon when I got my fingers on my keyboard.
