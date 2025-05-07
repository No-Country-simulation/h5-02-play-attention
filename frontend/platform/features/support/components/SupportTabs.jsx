import React, { useState } from 'react';

const SupportTabs = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Ensure children is an array
  const childrenArray = React.Children.toArray(children);

  return (
    <div className='w-full'>
      <div className='flex border-b-0'>
        {childrenArray.map((child, index) => (
          <button
            key={index}
            className={`flex-1 px-6 py-3 font-medium text-sm text-center ${
              activeTab === index
                ? 'text-white bg-purple-900 hover:bg-purple-800'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      <div className='border border-gray-200 rounded-md'>
        {childrenArray[activeTab]}
      </div>
    </div>
  );
};

const TabPanel = ({ children }) => {
  return <div className='p-4'>{children}</div>;
};

SupportTabs.TabPanel = TabPanel;

export default SupportTabs;
