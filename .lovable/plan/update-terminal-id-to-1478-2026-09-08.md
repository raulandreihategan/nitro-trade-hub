# Update Terminal ID to 1478

## Goal
Replace every hardcoded terminal ID value from `1466` to `1478` across the frontend and edge function so payment orders are sent to the new terminal.

## Files to change
- `src/pages/Checkout.tsx` — line 226, inline order creation payload.
- `src/services/PaymentService.ts` — lines 88–90, assignment + log comment.
- `supabase/functions/moto-payment/index.ts` — lines 126–129, assignment + log comment.

## Approach
1. Use a targeted string replacement to change `1466` → `1478` in each file.
2. Keep related log/comment strings consistent (e.g., `Set terminal_id to 1466` → `Set terminal_id to 1478`).
3. Leave type definitions and `terminal_id` field names unchanged.
4. Verify via build/logs after implementation.
