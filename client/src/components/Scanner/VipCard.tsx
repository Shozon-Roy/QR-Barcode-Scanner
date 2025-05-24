import { Crown, Sparkles, Zap, Unlock } from 'lucide-react';

const VipCard = () => {
  return (
    <div className="vip-card relative overflow-hidden group">
      {/* Animated sparkle effects */}
      <div className="absolute top-1/2 left-1/4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <Sparkles className="text-yellow-400 dark:text-yellow-300 animate-pulse" size={24} />
      </div>
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
        <Sparkles className="text-yellow-400 dark:text-yellow-300 animate-pulse" size={20} />
      </div>
      
      {/* Premium badge */}
      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg shadow-lg z-10">
        PREMIUM
      </div>
      
      {/* Content with gradient background inside */}
      <div className="relative z-0 flex flex-col items-center">
        <div className="w-20 h-20 mb-3 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown className="text-primary w-12 h-12" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Premium Access</h2>
        
        <div className="text-gray-600 dark:text-gray-300 text-sm mb-5 text-center">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap size={16} className="text-primary" />
            <span>Unlock all premium features</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Unlock size={16} className="text-primary" />
            <span>Ad-free experience</span>
          </div>
        </div>
        
        <button 
          type="button" 
          className="vip-button group-hover:scale-105 transition-transform duration-300"
          onClick={() => console.log('Get Premium Access')}
        >
          <Crown size={16} className="mr-1" />
          Upgrade Now
        </button>
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 dark:from-white/5 dark:to-white/10 z-0"></div>
    </div>
  );
};

export default VipCard;
