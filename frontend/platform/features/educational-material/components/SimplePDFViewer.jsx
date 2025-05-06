import React from 'react';

export function SimplePDFViewer({ url, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Visualizador de PDF</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 w-full h-full">
          <iframe 
            src={`${url}#toolbar=1&navpanes=1`}
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
}