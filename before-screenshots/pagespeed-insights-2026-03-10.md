# PageSpeed Insights — dartsiderentals.com
## Date: March 10, 2026 (launch day, post-performance fixes)

### Mobile
| Category | Score |
|---|---|
| Performance | 75 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

**Core Web Vitals (Mobile):**
- First Contentful Paint: 2.6s
- Largest Contentful Paint: 4.9s
- Total Blocking Time: 20ms
- Cumulative Layout Shift: 0
- Speed Index: 5.1s

**Key Issues:**
- Image delivery: Est savings of 3,522 KiB (gallery images still large on simulated slow 4G)
- Enormous network payloads: Total size 3,997 KiB
- LCP 4.9s: Hero image is the LCP element, slow on throttled 4G
- 15 non-composited animations found
- 1 long main-thread task

**What's working well:**
- Accessibility: 100 (contrast fix worked)
- Best Practices: 100
- SEO: 100
- CLS: 0 (no layout shift)
- TBT: 20ms (minimal blocking)
