'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, Bell, Globe, ChevronDown, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import LanguageSwitcher from '@/shared/ui/langage-selector';

export default function SettingsPage() {
  const t = useTranslations('settings');

  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Client',
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleNotificationChange = type => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [type]: !userData.notifications[type]
      }
    });
  };

  const handleSave = e => {
    e.preventDefault();
    // Save logic would go here (API call in production)
    alert(t('settingsSaved'));
  };

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>{t('title')}</h1>
      <p className='text-gray-600 mb-8'>{t('description')}</p>

      <div className='flex flex-col md:flex-row gap-8'>
        {/* Settings Navigation */}
        <div className='w-full md:w-1/4'>
          <Card>
            <CardContent className='p-0'>
              <nav>
                <ul>
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center w-full p-4 text-left ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className='h-5 w-5 mr-3' />
                      {t('profileSettings')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`flex items-center w-full p-4 text-left ${
                        activeTab === 'notifications'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Bell className='h-5 w-5 mr-3' />
                      {t('notificationSettings')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('language')}
                      className={`flex items-center w-full p-4 text-left ${
                        activeTab === 'language'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Globe className='h-5 w-5 mr-3' />
                      {t('languageSettings')}
                    </button>
                  </li>
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className='w-full md:w-3/4'>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'profile' && t('profileSettings')}
                {activeTab === 'notifications' && t('notificationSettings')}
                {activeTab === 'language' && t('languageSettings')}
              </CardTitle>
              <CardDescription>
                {activeTab === 'profile' && t('profileSettingsDesc')}
                {activeTab === 'notifications' && t('notificationSettingsDesc')}
                {activeTab === 'language' && t('languageSettingsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSave} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      {t('name')}
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={userData.name}
                      onChange={handleInputChange}
                      className='w-full p-2 border rounded-md'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      {t('email')}
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={userData.email}
                      onChange={handleInputChange}
                      className='w-full p-2 border rounded-md'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      {t('role')}
                    </label>
                    <div className='relative'>
                      <select
                        name='role'
                        value={userData.role}
                        onChange={handleInputChange}
                        className='w-full p-2 border rounded-md appearance-none pr-10'
                      >
                        <option value='Client'>{t('client')}</option>
                        <option value='Professional'>
                          {t('professional')}
                        </option>
                        <option value='Company'>{t('company')}</option>
                      </select>
                      <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    </div>
                  </div>

                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'
                  >
                    <Save className='h-4 w-4 mr-2' />
                    {t('saveChanges')}
                  </button>
                </form>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className='space-y-4'>
                  <div>
                    <label className='flex items-center cursor-pointer'>
                      <div className='relative'>
                        <input
                          type='checkbox'
                          className='sr-only'
                          checked={userData.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                        <div
                          className={`w-10 h-6 rounded-full ${
                            userData.notifications.email
                              ? 'bg-blue-600'
                              : 'bg-gray-200'
                          }`}
                        />
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            userData.notifications.email
                              ? 'transform translate-x-4'
                              : ''
                          }`}
                        />
                      </div>
                      <span className='ml-3 text-gray-700'>
                        {t('emailNotifications')}
                      </span>
                    </label>
                    <p className='text-sm text-gray-500 mt-1 ml-14'>
                      {t('emailNotificationsDesc')}
                    </p>
                  </div>

                  <div>
                    <label className='flex items-center cursor-pointer'>
                      <div className='relative'>
                        <input
                          type='checkbox'
                          className='sr-only'
                          checked={userData.notifications.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                        <div
                          className={`w-10 h-6 rounded-full ${
                            userData.notifications.push
                              ? 'bg-blue-600'
                              : 'bg-gray-200'
                          }`}
                        />
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            userData.notifications.push
                              ? 'transform translate-x-4'
                              : ''
                          }`}
                        />
                      </div>
                      <span className='ml-3 text-gray-700'>
                        {t('pushNotifications')}
                      </span>
                    </label>
                    <p className='text-sm text-gray-500 mt-1 ml-14'>
                      {t('pushNotificationsDesc')}
                    </p>
                  </div>

                  <div>
                    <label className='flex items-center cursor-pointer'>
                      <div className='relative'>
                        <input
                          type='checkbox'
                          className='sr-only'
                          checked={userData.notifications.sms}
                          onChange={() => handleNotificationChange('sms')}
                        />
                        <div
                          className={`w-10 h-6 rounded-full ${
                            userData.notifications.sms
                              ? 'bg-blue-600'
                              : 'bg-gray-200'
                          }`}
                        />
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            userData.notifications.sms
                              ? 'transform translate-x-4'
                              : ''
                          }`}
                        />
                      </div>
                      <span className='ml-3 text-gray-700'>
                        {t('smsNotifications')}
                      </span>
                    </label>
                    <p className='text-sm text-gray-500 mt-1 ml-14'>
                      {t('smsNotificationsDesc')}
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'
                  >
                    <Save className='h-4 w-4 mr-2' />
                    {t('saveChanges')}
                  </button>
                </div>
              )}

              {/* Language Settings */}
              {activeTab === 'language' && (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('selectLanguage')}
                    </label>
                    <div className='w-full max-w-xs'>
                      <LanguageSwitcher />
                    </div>
                    <p className='text-sm text-gray-500 mt-2'>
                      {t('languageChangeInfo')}
                    </p>
                  </div>

                  <div className='mt-6'>
                    <h3 className='text-md font-medium text-gray-800 mb-2'>
                      {t('subtitleLanguageTitle')}
                    </h3>
                    <p className='text-sm text-gray-600 mb-3'>
                      {t('subtitleLanguageDesc')}
                    </p>

                    <div className='space-y-2'>
                      <label className='flex items-center'>
                        <input
                          type='radio'
                          name='subtitles'
                          className='h-4 w-4 text-blue-600'
                          defaultChecked
                        />
                        <span className='ml-2 text-gray-700'>
                          {t('useSelectedLanguage')}
                        </span>
                      </label>
                      <label className='flex items-center'>
                        <input
                          type='radio'
                          name='subtitles'
                          className='h-4 w-4 text-blue-600'
                        />
                        <span className='ml-2 text-gray-700'>
                          {t('alwaysShowSubtitles')}
                        </span>
                      </label>
                      <label className='flex items-center'>
                        <input
                          type='radio'
                          name='subtitles'
                          className='h-4 w-4 text-blue-600'
                        />
                        <span className='ml-2 text-gray-700'>
                          {t('neverShowSubtitles')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
