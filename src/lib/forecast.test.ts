import { describe, expect, test } from "bun:test";
import { forecast } from "./forecast";

const base = { format: 'Panel', rsvps: 100, day: 'Tue', time: 'After Work', isFree: true, hasFood: false, hasCohost: false, competing: 0, weather: 'normal' } as const;

describe("forecast", () => {
  test("panel on a free Tuesday after work keeps the 55% base rate", () => {
    expect(forecast(base).showRate).toBeCloseTo(0.55);
    expect(forecast(base).attendees).toBe(55);
  });
  test("rainy Friday lowers the rate by 0.85 × 0.90", () => {
    expect(forecast({ ...base, day: 'Fri', weather: 'rainy' }).showRate).toBeCloseTo(0.55 * 0.85 * 0.9);
  });
  test("competing events stop counting after 3", () => {
    expect(forecast({ ...base, competing: 10 }).showRate).toBeCloseTo(0.55 * 0.95 ** 3);
  });
  test("rate is capped at 95%", () => {
    expect(forecast({ ...base, format: 'Dinner', isFree: false, hasFood: true, hasCohost: true, weather: 'sunny' }).showRate).toBe(0.95);
  });
  test("rate never drops below 25%", () => {
    expect(forecast({ ...base, format: 'Mixer', day: 'Sun', time: 'Morning', weather: 'rainy', competing: 3 }).showRate).toBe(0.25);
  });
});
