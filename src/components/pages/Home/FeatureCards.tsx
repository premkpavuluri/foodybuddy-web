// Feature cards component for the home page

import React from 'react';
import Card from '@/components/ui/Card';
import { FEATURE_CARDS } from '@/constants';

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {FEATURE_CARDS.map((feature) => (
        <Card key={feature.id} hover className="text-center">
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCards;
