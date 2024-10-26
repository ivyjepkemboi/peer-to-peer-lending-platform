import { useState, useEffect } from 'react';
import { 
  User,
  Mail, 
  Phone, 
  Shield,
  CreditCard,
  Camera,
  Edit2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setUser(data.user);
      setEditedUser(data.user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const data = await response.json();
      setUser(data.user);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <XCircle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
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
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </p>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Profile Information
        </h2>
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </div>
              {editing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.email}</p>
              )}
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </div>
              {editing ? (
                <input
                  type="tel"
                  value={editedUser.phone_number}
                  onChange={(e) => setEditedUser({...editedUser, phone_number: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user.phone_number}</p>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Account Status
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${user.is_verified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-sm text-gray-900">
                  {user.is_verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              {user.is_verified && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Verified Account</span>
                </div>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Loan Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-indigo-600 mr-3" />
                <span className="text-sm text-gray-500">Total Loans</span>
              </div>
              <span className="text-lg font-medium text-gray-900">
                {user.total_loans || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-500">Active Loans</span>
              </div>
              <span className="text-lg font-medium text-gray-900">
                {user.active_loans || 0}
              </span>
            </div>
            {user.role === 'lender' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-500">Total Invested</span>
                </div>
                <span className="text-lg font-medium text-gray-900">
                  ${user.total_invested?.toLocaleString() || 0}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {user.recent_activity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-50 rounded-full">
                  <activity.icon className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;