const Donate = () => {
  const upiId = '8081704559@ptyes';

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">💚 Support Greenify</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Greenify is a student-built, open initiative. Your support helps us keep the platform running and ad-free. Every contribution counts!
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center gap-6">

        <div>
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Scan QR to Donate</p>
          <div className="rounded-2xl overflow-hidden border-4 border-cyan-400 shadow-lg w-64 h-64 mx-auto">
            <img
              src="/donate_qr.png"
              alt="UPI QR Code for 8081704559@ptyes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex items-center w-full gap-3">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-400 font-medium">OR PAY USING UPI ID</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">UPI ID</p>
            <p className="text-lg font-bold text-green-700 tracking-wide">{upiId}</p>
          </div>
          <button
            onClick={handleCopy}
            title="Copy UPI ID"
            className="bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition shrink-0"
          >
            Copy
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">Works with</p>
          <div className="flex justify-center gap-3 text-sm font-medium text-gray-600 flex-wrap">
            {['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Any UPI App'].map(app => (
              <span key={app} className="bg-gray-100 px-3 py-1 rounded-full text-xs">{app}</span>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          Donations are voluntary and non-refundable. Thank you for supporting sustainable technology! 🌿
        </p>
      </div>
    </div>
  );
};

export default Donate;
