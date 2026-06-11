import React from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  Compass, 
  Shield, 
  Zap, 
  Users, 
  IndianRupee, 
  Eye, 
  Check, 
  Trophy, 
  Star,
  Car
} from 'lucide-react';
import CarCard from '../../components/CarCard';

function ResultsPage({ recommendations, searchPreferences, onReset }) {
  // Format price into Lakhs (e.g. 1100000 -> ₹11.00 Lakhs)
  const formatPrice = (price) => {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  const getNormalizedEfficiency = (car) => {
    const isEV = car.fuelType.toLowerCase() === 'electric';
    return isEV ? (car.mileage / 500) * 100 : (car.mileage / 28) * 100;
  };

  // Compute Winners
  const prices = recommendations.map((c) => c.price);
  const lowestPrice = Math.min(...prices);

  const safeties = recommendations.map((c) => c.safetyRating);
  const highestSafety = Math.max(...safeties);

  const efficiencies = recommendations.map(getNormalizedEfficiency);
  const highestEfficiency = Math.max(...efficiencies);

  const seatingDiffs = recommendations.map(
    (c) => c.seatingCapacity - (searchPreferences?.familySize || 5)
  );
  const minSeatingDiff = Math.min(...seatingDiffs);

  // Helper to render safety stars in table
  const renderStars = (rating) => {
    return (
      <div className="flex items-center justify-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* HEADER SECTION */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Recommendations Computed</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
          Your Top Match Results
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          We checked your budget, fuel preference, seating needs, safety priorities, and mileage parameters to select the top 3 best matching Indian vehicles.
        </p>
      </div>

      {/* MATCH CARS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {recommendations.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* COMPARISON MATRIX SECTION */}
      <div className="glass-card p-6 md:p-8 mt-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-darkbg-border pb-5 gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-extrabold text-white tracking-tight flex items-center space-x-2">
              <Compass className="w-5 h-5 text-brand-300" />
              <span>Side-by-Side Comparison Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Directly compare features, specs, and see which car wins on each preference.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-900/60 border border-darkbg-border px-3 py-1.5 rounded-lg w-fit">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Winner highlighted in green</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-darkbg-border/60">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950/40">
                <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 w-1/4 border-b border-darkbg-border">
                  Specification
                </th>
                {recommendations.map((car, index) => {
                  const isBestValue = car.price === lowestPrice;
                  return (
                    <th key={car.id} className="p-4 text-center border-b border-darkbg-border w-1/4">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-semibold">{car.brand}</div>
                        <div className="text-base font-display font-extrabold text-white tracking-tight">
                          {car.name}
                        </div>
                        <div>
                          {index === 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                              Top Match
                            </span>
                          ) : isBestValue ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              Budget Pick
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-darkbg-border/40 text-sm">
              {/* Match Percentage */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span>Match Score</span>
                </td>
                {recommendations.map((car) => (
                  <td key={car.id} className="p-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <span className="font-extrabold text-brand-300 text-base">
                        {car.matchPercentage}%
                      </span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                          style={{ width: `${car.matchPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <IndianRupee className="w-4 h-4 text-accent" />
                  <span>Price (Ex-Showroom)</span>
                </td>
                {recommendations.map((car) => {
                  const isWinner = car.price === lowestPrice;
                  const priceDiff = (searchPreferences?.budget || 0) - car.price;
                  return (
                    <td key={car.id} className={`p-4 text-center ${isWinner ? 'bg-emerald-950/20' : ''}`}>
                      <div className="space-y-1">
                        <span className={`font-extrabold text-base ${isWinner ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {formatPrice(car.price)}
                        </span>
                        {isWinner && (
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Best Value</span>
                          </div>
                        )}
                        {priceDiff > 0 ? (
                          <div className="text-xs text-slate-400">
                            ₹{(priceDiff / 100000).toFixed(1)}L under budget
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 font-medium text-amber-500/80">At budget limit</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Safety Rating */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Safety NCAP Rating</span>
                </td>
                {recommendations.map((car) => {
                  const isWinner = car.safetyRating === highestSafety;
                  return (
                    <td key={car.id} className={`p-4 text-center ${isWinner ? 'bg-emerald-950/20' : ''}`}>
                      <div className="space-y-1">
                        <div>{renderStars(car.safetyRating)}</div>
                        <div className="text-xs text-slate-200 font-semibold">{car.safetyRating} / 5 Stars</div>
                        {isWinner && car.safetyRating >= 4 && (
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Safety Leader</span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Efficiency / Mileage */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Efficiency & Mileage</span>
                </td>
                {recommendations.map((car) => {
                  const isEV = car.fuelType.toLowerCase() === 'electric';
                  const isWinner = getNormalizedEfficiency(car) === highestEfficiency;
                  return (
                    <td key={car.id} className={`p-4 text-center ${isWinner ? 'bg-emerald-950/20' : ''}`}>
                      <div className="space-y-1">
                        <span className={`font-extrabold ${isWinner ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {car.mileage} {isEV ? 'km range' : 'kmpl'}
                        </span>
                        <div className="text-xs text-slate-400">
                          {isEV ? 'Electric Battery' : 'Fuel Economy'}
                        </div>
                        {isWinner && (
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Efficiency Leader</span>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Seating Capacity */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Seating Capacity</span>
                </td>
                {recommendations.map((car) => {
                  const isPerfectMatch = car.seatingCapacity === (searchPreferences?.familySize || 5);
                  return (
                    <td key={car.id} className="p-4 text-center">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-200">{car.seatingCapacity} Seats</span>
                        {isPerfectMatch ? (
                          <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Perfect Fit</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">
                            +{car.seatingCapacity - (searchPreferences?.familySize || 5)} extra seats
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Fuel Type */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <Car className="w-4 h-4 text-indigo-400" />
                  <span>Fuel & Type</span>
                </td>
                {recommendations.map((car) => (
                  <td key={car.id} className="p-4 text-center">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">
                        {car.fuelType}
                      </span>
                      <div className="text-xs text-slate-400">{car.type}</div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* AI Verdict / Ideal For */}
              <tr className="hover:bg-slate-900/10 transition-colors duration-150">
                <td className="p-4 font-bold text-slate-300 flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-brand-300" />
                  <span>Verdict / Ideal For</span>
                </td>
                {recommendations.map((car) => (
                  <td key={car.id} className="p-4 text-center text-xs text-slate-300 leading-relaxed max-w-xs font-normal">
                    {car.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* TRY AGAIN ACTION */}
        <div className="text-center pt-4">
          <button 
            onClick={onReset}
            className="inline-flex items-center space-x-2 btn-accent py-3.5 px-8 text-sm cursor-pointer hover:bg-slate-800/30 transition duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Compare Different Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;

