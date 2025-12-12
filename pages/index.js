import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeTab, setActiveTab] = useState('gst');
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [result, setResult] = useState(null);

  const calculateGST = (type) => {
    const amt = parseFloat(amount);
    const rate = parseFloat(gstRate);
    
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    let gstAmount, totalAmount, baseAmount;

    if (type === 'add') {
      gstAmount = (amt * rate) / 100;
      totalAmount = amt + gstAmount;
      baseAmount = amt;
    } else {
      baseAmount = (amt * 100) / (100 + rate);
      gstAmount = amt - baseAmount;
      totalAmount = amt;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    setResult({
      baseAmount: baseAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      rate: rate
    });
  };

  return (
    <>
      <Head>
        <title>GST/Financial AI Calculator</title>
        <meta name="description" content="AI-powered GST and Financial Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-indigo-900 mb-4">
              🧮 GST/Financial AI Calculator
            </h1>
            <p className="text-xl text-gray-600">
              Smart calculations for GST, Tax, EMI, and more
            </p>
          </header>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('gst')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'gst'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                GST Calculator
              </button>
              <button
                onClick={() => setActiveTab('emi')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'emi'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                EMI Calculator
              </button>
              <button
                onClick={() => setActiveTab('tax')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'tax'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tax Calculator
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'gst' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">GST Calculator</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Rate (%)
                      </label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => calculateGST('add')}
                        className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
                      >
                        Add GST
                      </button>
                      <button
                        onClick={() => calculateGST('remove')}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Remove GST
                      </button>
                    </div>

                    {result && (
                      <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
                        <h3 className="text-xl font-bold text-indigo-900 mb-4">Results</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Base Amount:</span>
                            <span className="font-semibold">₹{result.baseAmount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">GST ({result.rate}%):</span>
                            <span className="font-semibold">₹{result.gstAmount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CGST:</span>
                            <span>₹{result.cgst}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">SGST:</span>
                            <span>₹{result.sgst}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">IGST:</span>
                            <span>₹{result.igst}</span>
                          </div>
                          <div className="border-t pt-3 mt-3 flex justify-between text-lg">
                            <span className="font-bold text-gray-800">Total Amount:</span>
                            <span className="font-bold text-indigo-600">₹{result.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'emi' && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">EMI Calculator</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              )}

              {activeTab === 'tax' && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tax Calculator</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              )}
            </div>
          </div>

          <footer className="text-center mt-12 text-gray-600">
            <p>Built with ❤️ by Bhindi AI</p>
          </footer>
        </div>
      </div>
    </>
  );
}
