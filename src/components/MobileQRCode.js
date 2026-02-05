import React, { useState, useEffect } from 'react';
import './MobileQRCode.css';

const MobileQRCode = () => {
  const [qrCode, setQrCode] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code for mobile connection
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      // Try to get the actual IP address
      const response = await fetch('https://api.ipify.org?format=json');
      let ip = 'localhost';
      
      if (response.ok) {
        const data = await response.json();
        ip = data.ip;
      } else {
        // Fallback to getting IP from window location
        ip = window.location.hostname || 'localhost';
      }

      const port = window.location.port || '3000';
      const appUrl = `http://${ip}:${port}`;
      
      setIpAddress(appUrl);

      // Generate QR code using a free API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}`;
      setQrCode(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      const appUrl = `http://localhost:${window.location.port || 3000}`;
      setIpAddress(appUrl);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}`;
      setQrCode(qrUrl);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ipAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'business-online-qr.png';
    link.click();
  };

  return (
    <div className="mobile-qr-container">
      <div className="qr-card">
        {/* Header */}
        <div className="qr-header">
          <h1>📱 Connect to Mobile</h1>
          <p>Scan the QR code or use the link below to access Business Online on your phone</p>
        </div>

        {/* QR Code Section */}
        <div className="qr-section">
          <h2>📲 Scan with Your Phone</h2>
          
          {qrCode && (
            <div className="qr-code-wrapper">
              <img src={qrCode} alt="QR Code" className="qr-code-image" />
              <p className="qr-instructions">
                📸 Point your phone camera at this QR code
              </p>
            </div>
          )}

          <button className="btn-refresh" onClick={generateQRCode}>
            🔄 Refresh QR Code
          </button>

          <button className="btn-download" onClick={downloadQRCode}>
            ⬇️ Download QR Code
          </button>
        </div>

        {/* Link Section */}
        <div className="link-section">
          <h2>🔗 Or Use This Link</h2>
          <div className="link-container">
            <input 
              type="text" 
              value={ipAddress} 
              readOnly 
              className="link-input"
            />
            <button className="btn-copy" onClick={copyToClipboard}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <p className="link-instructions">
            🌐 Open this link in your phone's browser
          </p>
        </div>

        {/* Instructions Section */}
        <div className="instructions-section">
          <h2>📋 How to Connect</h2>
          
          <div className="instruction-step">
            <div className="step-number">1️⃣</div>
            <div className="step-content">
              <h3>Make Sure Phone & Computer Are on Same WiFi</h3>
              <p>Both devices must be connected to the same WiFi network</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">2️⃣</div>
            <div className="step-content">
              <h3>Option A: Scan the QR Code</h3>
              <p>Open your phone's camera and point it at the QR code above. Tap the notification that appears.</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">3️⃣</div>
            <div className="step-content">
              <h3>Option B: Enter the Link Manually</h3>
              <p>Copy the link above and paste it into your phone's browser address bar</p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">4️⃣</div>
            <div className="step-content">
              <h3>Login & Enjoy!</h3>
              <p>Login with your credentials and start managing your business on mobile!</p>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="device-info">
          <h3>📍 Connection Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Your IP:</label>
              <span>{ipAddress.split('//')[1]?.split(':')[0] || 'localhost'}</span>
            </div>
            <div className="info-item">
              <label>Port:</label>
              <span>{window.location.port || '3000'}</span>
            </div>
            <div className="info-item">
              <label>Protocol:</label>
              <span>HTTP</span>
            </div>
            <div className="info-item">
              <label>Full URL:</label>
              <span style={{wordBreak: 'break-all', fontSize: '12px'}}>{ipAddress}</span>
            </div>
          </div>
          <p className="info-warning">
            ⚠️ <strong>Important:</strong> Make sure your development server is running on this computer!
          </p>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <h2>✨ What You Get on Mobile</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span>📦</span>
              <h4>Admin Panel</h4>
              <p>Full CRUD management</p>
            </div>
            <div className="benefit-card">
              <span>🔍</span>
              <h4>Search & Filter</h4>
              <p>Find anything instantly</p>
            </div>
            <div className="benefit-card">
              <span>📱</span>
              <h4>Responsive</h4>
              <p>Perfect mobile design</p>
            </div>
            <div className="benefit-card">
              <span>⚡</span>
              <h4>Fast</h4>
              <p>Optimized performance</p>
            </div>
            <div className="benefit-card">
              <span>🔒</span>
              <h4>Secure</h4>
              <p>Same authentication</p>
            </div>
            <div className="benefit-card">
              <span>🌐</span>
              <h4>Complete</h4>
              <p>All features available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileQRCode;
