import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface PredictionResult {
  btc: number;
  eth: number;
  ltc: number;
}

// ML model API endpoint
const ML_API_URL = 'https://crypto-predictor-xxxxx-uc.a.run.app';

async function getPrediction(date: string): Promise<PredictionResult> { 
  const response = await fetch(`${ML_API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get prediction');
  }

  return response.json();
}

export function PredictionForm() {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get prediction from ML model
      const prediction = await getPrediction(date);
      
      // Save prediction to Supabase
      const { error } = await supabase
        .from('predictions')
        .insert([{
          user_id: user.id,
          prediction_date: date,
          btc_price: prediction.btc,
          eth_price: prediction.eth,
          ltc_price: prediction.ltc
        }]);

      if (error) throw error;
      
      setPredictions(prediction);
      toast.success('Prediction generated successfully!');
    } catch (error: any) {
      toast.error('Failed to generate prediction: ' + error.message);
      // Fallback to mock predictions if ML service is unavailable
      const mockPrediction = {
        btc: 48000 + Math.random() * 2000,
        eth: 2800 + Math.random() * 200,
        ltc: 68 + Math.random() * 5
      };
      setPredictions(mockPrediction);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl p-8 bg-black/20 backdrop-blur-lg rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Cryptocurrency Price Prediction
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full pl-12 pr-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <span>Generate Prediction</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {predictions && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(predictions).map(([coin, price]) => (
            <div
              key={coin}
              className="p-6 bg-black/30 rounded-xl border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {coin.toUpperCase()}
              </h3>
              <p className="text-2xl font-bold text-white">
                ${Math.round(price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
