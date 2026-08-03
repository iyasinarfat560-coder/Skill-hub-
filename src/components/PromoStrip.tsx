import React from 'react';
import { Zap, Award, ShieldCheck, Headphones } from 'lucide-react';

export const PromoStrip: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: 'Instant Delivery',
      subtitle: 'Get your products instantly',
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: 'Premium Quality',
      subtitle: 'Highest quality content',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: 'Secure Payment',
      subtitle: '100% secure payment',
    },
    {
      icon: <Headphones className="w-6 h-6 text-white" />,
      title: '24/7 Support',
      subtitle: 'We are here to help',
    },
  ];

  return (
    <section className="my-10 bg-gradient-to-r from-purple-800 via-purple-700 to-pink-600 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 border border-white/20">
              {feat.icon}
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg leading-tight">
                {feat.title}
              </h4>
              <p className="text-xs text-purple-100 mt-0.5 font-medium">
                {feat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
