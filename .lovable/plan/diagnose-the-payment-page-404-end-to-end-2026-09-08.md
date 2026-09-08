# Diagnose the payment page 404 end to end

Goal: prove whether the "Not Found (#404)" comes from the payment provider or from something on our side, using a brand-new payment link opened immediately.

## What I will do

1. Create a fresh test order through the payment function with the current terminal (1478) and record the exact link the provider returns.
2. Open that link straight away in a real browser (no delay), capture a screenshot of what loads, plus the final address, the page status and any error text.
3. Repeat once with a slightly different setup (different amount/description) to confirm the result is consistent and not order-specific.
4. Compare the provider's returned host and path with what the browser actually requests, so we can see whether the page is served at all.

## Outcome

- If the payment form loads: the problem is intermittent or tied to your session/browser, and I will report what differs.
- If it 404s immediately: the failure is on the provider's checkout page for terminal 1478, and I will compile the evidence (order IDs, exact links, timestamps, responses) that you can send to them.

## Notes

No functional code changes are planned in this step. The `ww.` host stays exactly as the provider returns it, as you confirmed it is correct. If the test reveals something we can fix on our side, I will come back with a follow-up plan before changing anything.
