// src/components/profile/ProfileHeader.js
import React from 'react';
import { Camera, Edit2 } from 'lucide-react';

export const ProfileHeader = ({ user, onEdit }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
    <div className="px-6 pb-6">
      <div className="relative flex items-center">
        <div className="-mt-16">
          <div className="relative">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="ml-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// src/components/profile/ProfileStats.js
export const ProfileStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {stats.map((stat, index) => (
      <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center space-x-3">
          {stat.icon}
          <h3 className="text-lg font-medium text-gray-900">{stat.label}</h3>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</p>
        <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
      </div>
    ))}
  </div>
);

// src/components/profile/ProfileForm.js
export const ProfileForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Add form fields */}
    </form>
  );
};