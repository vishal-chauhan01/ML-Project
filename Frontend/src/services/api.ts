import type { Stock } from '../types/stock';

const FASTAPI_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiService = {
  async getStocks(modelType: string = 'linear'): Promise<Stock[]> {
    try {
      const res = await fetch(
        `${FASTAPI_URL}/stocks?model_type=${modelType}`
      );

      if (res.ok) {
        const json = await res.json();

        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }

    return [];
  },

  async toggleWatchlist(stockId: string): Promise<boolean> {
    try {
      const res = await fetch(`${FASTAPI_URL}/watchlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stockId }),
      });

      if (!res.ok) {
        throw new Error('Watchlist toggle API error');
      }

      const json = await res.json();

      return !!json.isSavedToWatchlist;
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      return false;
    }
  },

  async getMarketInsights(modelType: string = 'linear') {
    try {
      const res = await fetch(
        `${FASTAPI_URL}/market-insights?model_type=${modelType}`
      );

      if (res.ok) {
        const json = await res.json();

        if (json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.error('Error fetching market insights:', err);
    }

    return {
      macroSummary: 'Market insights currently unavailable.',
      sectorHeatmap: [],
      deepDives: [],
    };
  },

  async getModels() {
    try {
      const res = await fetch(`${FASTAPI_URL}/models`);

      if (res.ok) {
        const json = await res.json();

        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.error('Error fetching models:', err);
    }

    return [];
  },

  async runPrediction(
    stockId: string,
    modelId: string,
    timeframe: string
  ) {
    try {
      const res = await fetch(`${FASTAPI_URL}/models/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockId,
          modelId,
          timeframe,
        }),
      });

      if (res.ok) {
        const json = await res.json();

        if (json.inference) {
          return json.inference;
        }
      }
    } catch (err) {
      console.error('Error running prediction:', err);
    }

    return null;
  },
};
