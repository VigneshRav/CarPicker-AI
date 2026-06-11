import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PreferenceForm from './features/form/PreferenceForm';
import ResultsPage from './features/results/ResultsPage';
import { getCarRecommendations } from './services/api';
import { AlertCircle } from 'lucide-react';

function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [searchPreferences, setSearchPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCarRecommendations(formData);
      if (response.success && response.data) {
        setRecommendations(response.data);
        setSearchPreferences(formData);
      } else {
        throw new Error(response.error || 'Invalid recommendations format received');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err.error || 
        (err.errors ? err.errors.join(' | ') : null) || 
        err.message || 
        'Failed to connect to the recommendation server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations(null);
    setSearchPreferences(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-darkbg-deep selection:bg-brand-500/35 selection:text-white">
      {/* Navbar header */}
      <Navbar />

      {/* Main body viewport */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-10 sm:px-6 lg:px-8 flex flex-col justify-center">
        
        {/* Error notification banner */}
        {error && (
          <div className="max-w-xl mx-auto mb-8 w-full p-4 bg-red-950/70 border border-red-800/40 rounded-xl text-red-200 flex items-start space-x-3 shadow-lg animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Failed to Load Matches</h4>
              <p className="text-xs text-red-300/95 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {!recommendations ? (
          <PreferenceForm onSubmit={handleFormSubmit} loading={loading} />
        ) : (
          <ResultsPage 
            recommendations={recommendations} 
            searchPreferences={searchPreferences} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer footer */}
      <Footer />
    </div>
  );
}

export default App;
