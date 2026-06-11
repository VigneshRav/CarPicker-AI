import React, { useState } from 'react';
import { 
  Fuel, 
  Users, 
  Car, 
  Shield, 
  Zap, 
  Gauge, 
  Navigation,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import FormField from '../../components/FormField';

function PreferenceForm({ onSubmit, loading }) {
  const [budget, setBudget] = useState(1500000); // Default 15 Lakhs (₹15,00,000)
  const [fuelType, setFuelType] = useState('any');
  const [familySize, setFamilySize] = useState(5);
  const [usage, setUsage] = useState('daily-commute');
  const [safetyValue, setSafetyValue] = useState(2); // Maps to 'medium'
  const [mileageValue, setMileageValue] = useState(2); // Maps to 'medium'

  const priorityMap = {
    1: 'low',
    2: 'medium',
    3: 'high'
  };

  const fuelTypes = [
    { id: 'any', label: 'Any Fuel' },
    { id: 'petrol', label: 'Petrol' },
    { id: 'diesel', label: 'Diesel' },
    { id: 'cng', label: 'CNG' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'electric', label: 'Electric' }
  ];

  const usageProfiles = [
    { 
      id: 'daily-commute', 
      label: 'Daily Commute', 
      desc: 'City traffic, bumper-to-bumper driving, runs to office/school' 
    },
    { 
      id: 'highway-cruising', 
      label: 'Highway Cruising', 
      desc: 'Long distance travel, interstate roads, stable high speeds' 
    },
    { 
      id: 'family-trips', 
      label: 'Family Trips', 
      desc: 'Full family travel, cabin room, comfort focus' 
    },
    { 
      id: 'off-roading', 
      label: 'Off-Roading', 
      desc: 'Rugged terrain, mud, hills, bad roads, adventurous paths' 
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      budget,
      fuelType,
      familySize,
      usage,
      safetyPriority: priorityMap[safetyValue],
      mileagePriority: priorityMap[mileageValue]
    });
  };

  // Convert number to Lakhs label
  const formatLakhs = (val) => {
    const lakhs = val / 100000;
    return `₹${lakhs.toFixed(1)} Lakh${lakhs !== 1 ? 's' : ''}`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold text-white tracking-tight mb-3">
          Find Your Perfect Match
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Answer a few questions about your driving needs, and our AI matching engine will recommend the best fit.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 space-y-8 shadow-2xl">
        {/* BUDGET FIELD */}
        <FormField 
          label="Maximum Budget" 
          description="Slide to set the absolute maximum purchase price you want to recommend."
        >
          <div className="flex flex-col space-y-4">
            <input 
              type="range" 
              min="500000" 
              max="3000000" 
              step="50000"
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:accent-brand-400 focus:outline-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">₹5.0 Lakhs</span>
              <span className="text-brand-300 font-display font-extrabold text-2xl px-4 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 shadow-inner">
                {formatLakhs(budget)}
              </span>
              <span className="text-xs font-semibold text-slate-500">₹30.0 Lakhs</span>
            </div>
          </div>
        </FormField>

        {/* FUEL PREFERENCE */}
        <FormField 
          label="Fuel Preference" 
          description="Choose your preferred engine fuel type."
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {fuelTypes.map((fuel) => (
              <button
                key={fuel.id}
                type="button"
                onClick={() => setFuelType(fuel.id)}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all duration-200 cursor-pointer ${
                  fuelType === fuel.id 
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-semibold shadow-md shadow-brand-500/5' 
                    : 'border-darkbg-border bg-slate-900/50 hover:bg-slate-800/50 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Fuel className="w-5 h-5 opacity-80" />
                <span className="text-xs">{fuel.label}</span>
              </button>
            ))}
          </div>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FAMILY SIZE */}
          <FormField 
            label="Family Size / Seats" 
            description="How many seats do you need?"
            className="md:col-span-1"
          >
            <div className="grid grid-cols-4 gap-2">
              {[4, 5, 7, 8].map((seats) => (
                <button
                  key={seats}
                  type="button"
                  onClick={() => setFamilySize(seats)}
                  className={`py-3.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                    familySize === seats
                      ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold'
                      : 'border-darkbg-border bg-slate-900/50 hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <Users className="w-5 h-5 mb-1 opacity-80" />
                  <span className="text-sm font-semibold">{seats} Seats</span>
                </button>
              ))}
            </div>
          </FormField>

          {/* SAFETY PRIORITY SLIDER */}
          <FormField 
            label="Safety Priority" 
            description="Safety NCAP ratings focus"
            className="md:col-span-1"
          >
            <div className="flex flex-col space-y-3 px-1">
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                value={safetyValue} 
                onChange={(e) => setSafetyValue(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent hover:accent-accent-light focus:outline-none"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className={safetyValue === 1 ? 'text-accent' : ''}>Low</span>
                <span className={safetyValue === 2 ? 'text-accent' : ''}>Medium</span>
                <span className={safetyValue === 3 ? 'text-accent' : ''}>High</span>
              </div>
            </div>
          </FormField>

          {/* MILEAGE PRIORITY SLIDER */}
          <FormField 
            label="Mileage Priority" 
            description="Fuel economy & efficiency focus"
            className="md:col-span-1"
          >
            <div className="flex flex-col space-y-3 px-1">
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                value={mileageValue} 
                onChange={(e) => setMileageValue(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent hover:accent-accent-light focus:outline-none"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className={mileageValue === 1 ? 'text-accent' : ''}>Low</span>
                <span className={mileageValue === 2 ? 'text-accent' : ''}>Medium</span>
                <span className={mileageValue === 3 ? 'text-accent' : ''}>High</span>
              </div>
            </div>
          </FormField>
        </div>

        {/* PRIMARY USAGE */}
        <FormField 
          label="Primary Vehicle Usage" 
          description="Select the scenario that matches your typical driving pattern."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usageProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => setUsage(profile.id)}
                className={`p-4 rounded-xl border flex items-start space-x-3 transition-all duration-200 cursor-pointer select-none ${
                  usage === profile.id 
                    ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/30' 
                    : 'border-darkbg-border bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${
                  usage === profile.id ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {profile.id === 'daily-commute' && <Zap className="w-5 h-5" />}
                  {profile.id === 'highway-cruising' && <Gauge className="w-5 h-5" />}
                  {profile.id === 'family-trips' && <Users className="w-5 h-5" />}
                  {profile.id === 'off-roading' && <Navigation className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${
                    usage === profile.id ? 'text-brand-300' : 'text-slate-200'
                  }`}>
                    {profile.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {profile.desc}
                  </p>
                </div>
                {usage === profile.id && (
                  <CheckCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </FormField>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-darkbg-border/60">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 text-base cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing Matching Profiles...</span>
              </>
            ) : (
              <span>Find My Perfect Match</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PreferenceForm;
