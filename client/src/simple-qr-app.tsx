import React, { useState } from 'react';
import QRCode from 'qrcode';

const SimpleQRApp = () => {
  const [text, setText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(text);
      setQrCodeDataURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Simple QR Code Generator</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for QR code"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        onClick={generateQRCode}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate QR Code
      </button>
      
      {qrCodeDataURL && (
        <div className="mt-4">
          <img src={qrCodeDataURL} alt="QR Code" className="border p-2" />
        </div>
      )}
    </div>
  );
};

export default SimpleQRApp;