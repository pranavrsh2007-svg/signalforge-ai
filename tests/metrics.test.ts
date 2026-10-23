import { describe, it, expect } from 'vitest';
import {
  calculateMetrics,
  calculateDailyTrends,
  calculateCategoryTrends,
  calculateProductMetrics,
} from '../src/lib/analytics/metrics';
import { DataRow } from '../src/types';

describe('Deterministic Business Metrics Calculation', () => {
  const sampleRows: DataRow[] = [
    {
      date: '2026-09-01',
      order_id: 'O-1',
      category: 'Office',
      product: 'Notebook',
      quantity: 10,
      unit_price: 5,
      unit_cost: 2,
      stock_on_hand: 50,
      revenue: 50,
      cost: 20,
      profit: 30,
      margin: 60,
    },
    {
      date: '2026-09-02',
      order_id: 'O-1', // Same order_id to test distinct order counting
      category: 'Office',
      product: 'Pen',
      quantity: 5,
      unit_price: 10,
      unit_cost: 4,
      stock_on_hand: 100,
      revenue: 50,
      cost: 20,
      profit: 30,
      margin: 60,
    },
    {
      date: '2026-09-03',
      order_id: 'O-2',
      category: 'Home',
      product: 'Lamp',
      quantity: 2,
      unit_price: 25,
      unit_cost: 15,
      stock_on_hand: 10,
      revenue: 50,
      cost: 30,
      profit: 20,
      margin: 40,
    },
  ];

  it('calculates total revenue, orders, and AOV deterministically', () => {
    const summary = calculateMetrics(sampleRows, true);

    expect(summary.totalRevenue).toBe(150); // 50 + 50 + 50
    expect(summary.totalUnitsSold).toBe(17); // 10 + 5 + 2
    expect(summary.totalOrders).toBe(2); // O-1 and O-2 distinct
    expect(summary.averageOrderValue).toBe(75); // 150 / 2
    expect(summary.hasGrossMargin).toBe(true);
    expect(summary.totalGrossProfit).toBe(80); // 30 + 30 + 20
    expect(summary.grossMarginPercent).toBe(53.3); // (80 / 150) * 100 = 53.33%
  });

  it('omits gross margin when unit cost column is missing', () => {
    const summaryNoCost = calculateMetrics(sampleRows, false);

    expect(summaryNoCost.hasGrossMargin).toBe(false);
    expect(summaryNoCost.grossMarginPercent).toBeNull();
    expect(summaryNoCost.totalGrossProfit).toBeNull();
    expect(summaryNoCost.totalRevenue).toBe(150);
  });

  it('aggregates daily trends properly', () => {
    const daily = calculateDailyTrends(sampleRows);

    expect(daily.length).toBe(3);
    expect(daily[0].date).toBe('2026-09-01');
    expect(daily[0].revenue).toBe(50);
    expect(daily[0].units).toBe(10);
  });

  it('aggregates category performance correctly', () => {
    const cat = calculateCategoryTrends(sampleRows, true);

    expect(cat.length).toBe(2);
    const office = cat.find((c) => c.category === 'Office');
    const home = cat.find((c) => c.category === 'Home');

    expect(office?.revenue).toBe(100);
    expect(office?.units).toBe(15);
    expect(home?.revenue).toBe(50);
  });

  it('calculates inventory runway days for products', () => {
    const prod = calculateProductMetrics(sampleRows, true);
    const lamp = prod.find((p) => p.product === 'Lamp');

    expect(lamp).toBeDefined();
    expect(lamp?.stockOnHand).toBe(10);
    // Sold 2 units across 1 active day = 2 units/day. 10 / 2 = 5 days runway
    expect(lamp?.runOutDays).toBe(5);
  });
});
