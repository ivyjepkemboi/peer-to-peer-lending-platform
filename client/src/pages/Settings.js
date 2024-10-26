import { useState } from 'react';
import { 
  Bell, 
  Lock, 
  Globe, 
  CreditCard, 
  Shield,
  Moon,
  Sun,
  ToggleLeft,
  ChevronRight
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      newLoans: true,
      repayments: true,
      marketing: false
    },
    security: {
      twoFactor: false,
      biometric: true,
      loginAlerts: true
    },
    theme: 'light',
    language: 'English'
  });

  const [loading, setLoading] = useState(false);

  const handleSettingChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const SettingToggle = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-lg font-medium text-gray-900 mb-6">
            <Bell className="w-6 h-6" />
            <h2>Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <SettingToggle
              enabled={settings.notifications.email}
              onChange={() => handleSettingChange('notifications', 'email')}
              label="Email Notifications"
              description="Receive updates and alerts via email"
            />
            
            <SettingToggle
              enabled={settings.notifications.push}
              onChange={() => handleSettingChange('notifications', 'push')}
              label="Push Notifications"
              description="Get notifications on your device"
            />
            
            <SettingToggle
              enabled={settings.notifications.sms}
              onChange={() => handleSettingChange('notifications', 'sms')}
              label="SMS Notifications"
              description="Receive text messages for important updates"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-lg font-medium text-gray-900 mb-6">
            <Shield className="w-6 h-6" />
            <h2>Security</h2>
          </div>
          
          <div className="space-y-4">
            <SettingToggle
              enabled={settings.security.twoFactor}
              onChange={() => handleSettingChange('security', 'twoFactor')}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
            
            <SettingToggle
              enabled={settings.security.biometric}
              onChange={() => handleSettingChange('security', 'biometric')}
              label="Biometric Login"
              description="Use fingerprint or face recognition to login"
            />
            
            <SettingToggle
              enabled={settings.security.loginAlerts}
              onChange={() => handleSettingChange('security', 'loginAlerts')}
              label="Login Alerts"
              description="Get notified of new login attempts"
            />
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-lg font-medium text-gray-900 mb-6">
            <Moon className="w-6 h-6" />
            <h2>Appearance</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-900">Theme</label>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                    settings.theme === 'light'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Sun className="w-5 h-5 mr-2" />
                  Light
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                    settings.theme === 'dark'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Moon className="w-5 h-5 mr-2" />
                  Dark
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                    settings.theme === 'system'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ToggleLeft className="w-5 h-5 mr-2" />
                  System
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="mt-3 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 text-lg font-medium text-gray-900 mb-6">
            <CreditCard className="w-6 h-6" />
            <h2>Payment Methods</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                  M-PESA
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">M-PESA</p>
                  <p className="text-sm text-gray-500">Connected</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;