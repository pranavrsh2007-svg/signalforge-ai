import { DataRow, MetricSummary, DailyTrend, CategoryTrend, ProductMetric } from '../../types';

export function calculateMetrics(rows: DataRow[], hasCostColumn: boolean): MetricSummary {
  if (rows.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalUnitsSold: 0,
      averageOrderValue: 0,
      hasGrossMargin: false,
      grossMarginPercent: null,
      totalGrossProfit: null,
      dateRange: { start: '', end: '' },
      uniqueCategories: [],
      uniqueProducts: [],
    };
  }

  let totalRevenue = 0;
  let totalUnitsSold = 0;
  let totalGrossProfit: number | null = hasCostColumn ? 0 : null;
  const orderIds = new Set<string>();
  const categories = new Set<string>();
  const products = new Set<string>();

  let minDate = rows[0].date;
  let maxDate = rows[0].date;

  for (const row of rows) {
    totalRevenue += row.revenue;
    totalUnitsSold += row.quantity;
    orderIds.add(row.order_id);
    categories.add(row.category);
    products.add(row.product);

    if (row.date < minDate) minDate = row.date;
    if (row.date > maxDate) maxDate = row.date;

    if (hasCostColumn && row.profit !== null && row.profit !== undefined && totalGrossProfit !== null) {
      totalGrossProfit += row.profit;
    }
  }

  const totalOrders = orderIds.size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  const hasGrossMargin = hasCostColumn && totalGrossProfit !== null;
  const grossMarginPercent =
    hasGrossMargin && totalRevenue > 0 && totalGrossProfit !== null
      ? (totalGrossProfit / totalRevenue) * 100
      : null;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    totalUnitsSold,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    hasGrossMargin,
    grossMarginPercent: grossMarginPercent !== null ? Math.round(grossMarginPercent * 10) / 10 : null,
    totalGrossProfit: totalGrossProfit !== null ? Math.round(totalGrossProfit * 100) / 100 : null,
    dateRange: { start: minDate, end: maxDate },
    uniqueCategories: Array.from(categories).sort(),
    uniqueProducts: Array.from(products).sort(),
  };
}

export function calculateDailyTrends(rows: DataRow[]): DailyTrend[] {
  const map = new Map<string, { revenue: number; orders: Set<string>; units: number; profit: number | null }>();

  for (const row of rows) {
    const existing = map.get(row.date) || {
      revenue: 0,
      orders: new Set<string>(),
      units: 0,
      profit: row.profit !== null && row.profit !== undefined ? 0 : null,
    };

    existing.revenue += row.revenue;
    existing.orders.add(row.order_id);
    existing.units += row.quantity;
    if (existing.profit !== null && row.profit !== null && row.profit !== undefined) {
      existing.profit += row.profit;
    }

    map.set(row.date, existing);
  }

  const sortedDates = Array.from(map.keys()).sort();
  return sortedDates.map((date) => {
    const data = map.get(date)!;
    return {
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders.size,
      units: data.units,
      profit: data.profit !== null ? Math.round(data.profit * 100) / 100 : null,
    };
  });
}

export function calculateCategoryTrends(rows: DataRow[], hasCostColumn: boolean): CategoryTrend[] {
  const map = new Map<
    string,
    { revenue: number; units: number; orders: Set<string>; profit: number | null }
  >();

  for (const row of rows) {
    const cat = row.category;
    const existing = map.get(cat) || {
      revenue: 0,
      units: 0,
      orders: new Set<string>(),
      profit: hasCostColumn ? 0 : null,
    };

    existing.revenue += row.revenue;
    existing.units += row.quantity;
    existing.orders.add(row.order_id);
    if (hasCostColumn && row.profit !== null && row.profit !== undefined && existing.profit !== null) {
      existing.profit += row.profit;
    }

    map.set(cat, existing);
  }

  return Array.from(map.entries())
    .map(([category, data]) => {
      const margin =
        hasCostColumn && data.profit !== null && data.revenue > 0
          ? Math.round((data.profit / data.revenue) * 1000) / 10
          : null;

      return {
        category,
        revenue: Math.round(data.revenue * 100) / 100,
        units: data.units,
        orders: data.orders.size,
        profit: data.profit !== null ? Math.round(data.profit * 100) / 100 : null,
        margin,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export function calculateProductMetrics(rows: DataRow[], hasStockColumn: boolean): ProductMetric[] {
  const map = new Map<
    string,
    {
      category: string;
      unitsSold: number;
      revenue: number;
      stockOnHand?: number | null;
      distinctDays: Set<string>;
    }
  >();

  for (const row of rows) {
    const prod = row.product;
    const existing = map.get(prod) || {
      category: row.category,
      unitsSold: 0,
      revenue: 0,
      stockOnHand: null,
      distinctDays: new Set<string>(),
    };

    existing.unitsSold += row.quantity;
    existing.revenue += row.revenue;
    existing.distinctDays.add(row.date);

    // Keep the latest stock value encountered in sorted order
    if (hasStockColumn && row.stock_on_hand !== null && row.stock_on_hand !== undefined) {
      existing.stockOnHand = row.stock_on_hand;
    }

    map.set(prod, existing);
  }

  return Array.from(map.entries()).map(([product, data]) => {
    let runOutDays: number | null = null;
    if (data.stockOnHand !== null && data.stockOnHand !== undefined && data.distinctDays.size > 0) {
      const avgDailySales = data.unitsSold / data.distinctDays.size;
      if (avgDailySales > 0) {
        runOutDays = Math.round((data.stockOnHand / avgDailySales) * 10) / 10;
      }
    }

    return {
      product,
      category: data.category,
      unitsSold: data.unitsSold,
      revenue: Math.round(data.revenue * 100) / 100,
      stockOnHand: data.stockOnHand,
      runOutDays,
    };
  });
}
