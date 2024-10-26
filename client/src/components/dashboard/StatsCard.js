// src/components/dashboard/StatsCard.js
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const StatsCard = ({ title, value, icon, change, changeType }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {change && (
          <div className={`flex items-center mt-2 ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? 
              <ArrowUp className="w-4 h-4 mr-1" /> : 
              <ArrowDown className="w-4 h-4 mr-1" />
            }
            <span className="text-sm font-medium">{change}%</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-indigo-50 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

// src/components/dashboard/ActivityFeed.js
export const ActivityFeed = ({ activities }) => (
  <div className="space-y-4">
    {activities.map((activity, index) => (
      <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
        <div className="p-2 bg-indigo-50 rounded-full">
          {activity.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
        </div>
        <div className="text-sm text-gray-500">
          {activity.time}
        </div>
      </div>
    ))}
  </div>
);

// src/components/dashboard/ChartCard.js
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ChartCard = ({ title, data, dataKey, color = '#4f46e5' }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={`${color}20`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);