import React, { useState, useEffect } from 'react';

const SupportTabs = ({ children, defaultTab = 0, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Cuando cambia defaultTab externamente, actualizar el estado interno
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Ensure children is an array
  const childrenArray = React.Children.toArray(children);

  // Función para cambiar de pestaña
  const handleTabChange = index => {
    setActiveTab(index);
    // Notificar al componente padre si se proporcionó onTabChange
    if (onTabChange && typeof onTabChange === 'function') {
      onTabChange(index);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex border-b-0'>
        {childrenArray.map((child, index) => (
          <button
            key={index}
            className={`flex-1 px-2 md:px-6 py-2 md:py-3 font-medium text-xs md:text-sm text-center ${
              activeTab === index
                ? 'text-white bg-purple-900 hover:bg-purple-800'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleTabChange(index)}
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
  return <div className='p-2 md:p-4'>{children}</div>;
};

SupportTabs.TabPanel = TabPanel;

export default SupportTabs;
