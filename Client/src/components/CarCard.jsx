import { Star, IndianRupee, Car } from 'lucide-react';

function CarCard({ car }) {
  // Format price into Lakhs (e.g. 1100000 -> ₹11.0 Lakhs)
  const formatPrice = (price) => {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  // Generate glowing safety stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
          }`}
        />
      );
    }
    return stars;
  };

  // Return badge color based on match percentage
  const getBadgeStyles = (percentage) => {
    if (percentage >= 90) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    if (percentage >= 75) return 'bg-brand-500/10 text-brand-300 border-brand-500/30';
    return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  };

  const isEV = car.fuelType.toLowerCase() === 'electric';

  return (
    <div className="glass-card hover:border-brand-500/40 hover:-translate-y-1 hover:shadow-brand-500/10 duration-300 transition-all flex flex-col justify-between overflow-hidden group">
      {/* CARD IMAGE DECORATION PLACEHOLDER */}
      <div className="h-32 bg-gradient-to-br from-slate-900 via-brand-950/40 to-slate-950 relative border-b border-darkbg-border flex items-center justify-center">
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyles(car.matchPercentage)}`}>
            {car.matchPercentage}% Match
          </span>
        </div>
        
        {/* Car Outline Vector/SVG matching the type */}
        <div className="opacity-20 group-hover:opacity-35 transition-opacity duration-300 text-brand-400">
          <Car className="w-16 h-16" />
        </div>

        {/* Floating Brand Badge */}
        <span className="absolute bottom-3 left-4 text-xs font-semibold px-2 py-1 rounded bg-slate-900/80 border border-slate-700/50 text-slate-300">
          {car.brand}
        </span>
      </div>

      {/* CARD CONTENT */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-display font-extrabold text-white tracking-tight leading-tight group-hover:text-brand-300 transition-colors duration-300">
              {car.name}
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
              {car.fuelType}
            </span>
          </div>

          {/* Pricing formatted in Lakhs */}
          <div className="flex items-center space-x-1 mb-4">
            <IndianRupee className="w-4 h-4 text-accent" />
            <span className="text-xl font-extrabold text-accent tracking-tight">
              {formatPrice(car.price)}
            </span>
            <span className="text-xs text-slate-500">(Ex-showroom)</span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 my-3 border-y border-darkbg-border/60">
            {/* Safety display */}
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Safety Rating</span>
              <div className="flex space-x-0.5 items-center">
                {renderStars(car.safetyRating)}
              </div>
            </div>

            {/* Mileage display */}
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Efficiency</span>
              <span className="text-sm font-bold text-slate-200">
                {car.mileage} {isEV ? 'km range' : 'kmpl'}
              </span>
            </div>
          </div>

          {/* Explanation Text */}
          {car.explanation && (
            <p className="text-xs text-slate-300 leading-relaxed italic bg-brand-500/5 p-3 rounded-lg border border-brand-500/10 mb-4">
              "{car.explanation}"
            </p>
          )}

          {/* Matches reasons list */}
          {car.matchReasons && car.matchReasons.length > 0 && (
            <div className="mt-4 space-y-2.5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-brand-400">Why it matches:</p>
              <ul className="space-y-2">
                {car.matchReasons.map((reason, index) => (
                  <li key={index} className="text-xs text-slate-300 flex items-start space-x-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarCard;
