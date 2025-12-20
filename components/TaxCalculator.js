import { useState } from 'react';

export default function TaxCalculator() {
  const [income, setIncome] = useState('');
  const [regime, setRegime] = useState('new');
  const [deductions, setDeductions] = useState({
    section80C: '',
    section80D: '',
    homeLoanInterest: '',
    nps: ''
  });
  const [result, setResult] = useState(null);

  const calculateOldRegime = (grossIncome, deduct) => {
    let taxableIncome = grossIncome;
    
    // Apply deductions
    const total80C = Math.min(parseFloat(deduct.section80C || 0), 150000);
    const total80D = Math.min(parseFloat(deduct.section80D || 0), 25000);
    const homeLoan = Math.min(parseFloat(deduct.homeLoanInterest || 0), 200000);
    const nps = Math.min(parseFloat(deduct.nps || 0), 50000);
    
    const totalDeductions = total80C + total80D + homeLoan + nps;
    taxableIncome -= totalDeductions;
    
    let tax = 0;
    
    // Old regime slabs (FY 2024-25)
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.20;
    } else {
      tax = 12500 + 100000 + (taxableIncome - 1000000) * 0.30;
    }
    
    return { tax, taxableIncome, totalDeductions };
  };

  const calculateNewRegime = (grossIncome) => {
    let tax = 0;
    
    // New regime slabs (FY 2024-25) with rebate
    if (grossIncome <= 300000) {
      tax = 0;
    } else if (grossIncome <= 700000) {
      tax = (grossIncome - 300000) * 0.05;
    } else if (grossIncome <= 1000000) {
      tax = 20000 + (grossIncome - 700000) * 0.10;
    } else if (grossIncome <= 1200000) {
      tax = 20000 + 30000 + (grossIncome - 1000000) * 0.15;
    } else if (grossIncome <= 1500000) {
      tax = 20000 + 30000 + 30000 + (grossIncome - 1200000) * 0.20;
    } else {
      tax = 20000 + 30000 + 30000 + 60000 + (grossIncome - 1500000) * 0.30;
    }
    
    // Rebate under section 87A for new regime (income up to 7 lakh)
    if (grossIncome <= 700000) {
      tax = 0;
    }
    
    return { tax, taxableIncome: grossIncome, totalDeductions: 0 };
  };

  const calculateTax = () => {
    const grossIncome = parseFloat(income);
    
    if (isNaN(grossIncome) || grossIncome <= 0) {
      alert('Please enter a valid income amount');
      return;
    }

    let calculation;
    
    if (regime === 'old') {
      calculation = calculateOldRegime(grossIncome, deductions);
    } else {
      calculation = calculateNewRegime(grossIncome);
    }
    
    // Add cess (4% on tax)
    const cess = calculation.tax * 0.04;
    const totalTax = calculation.tax + cess;
    const takeHome = grossIncome - totalTax;
    
    setResult({
      grossIncome: grossIncome.toFixed(2),
      taxableIncome: calculation.taxableIncome.toFixed(2),
      totalDeductions: calculation.totalDeductions.toFixed(2),
      incomeTax: calculation.tax.toFixed(2),
      cess: cess.toFixed(2),
      totalTax: totalTax.toFixed(2),
      takeHome: takeHome.toFixed(2),
      effectiveRate: ((totalTax / grossIncome) * 100).toFixed(2),
      regime: regime
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Income Tax Calculator (FY 2024-25)</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income (₹)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter annual income"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Regime
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setRegime('new')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                regime === 'new'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              New Regime
            </button>
            <button
              onClick={() => setRegime('old')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                regime === 'old'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Old Regime
            </button>
          </div>
        </div>

        {regime === 'old' && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-800">Deductions (Old Regime)</h3>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Section 80C (Max ₹1,50,000)
              </label>
              <input
                type="number"
                value={deductions.section80C}
                onChange={(e) => setDeductions({...deductions, section80C: e.target.value})}
                placeholder="PPF, ELSS, LIC, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Section 80D - Health Insurance (Max ₹25,000)
              </label>
              <input
                type="number"
                value={deductions.section80D}
                onChange={(e) => setDeductions({...deductions, section80D: e.target.value})}
                placeholder="Health insurance premium"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Home Loan Interest (Max ₹2,00,000)
              </label>
              <input
                type="number"
                value={deductions.homeLoanInterest}
                onChange={(e) => setDeductions({...deductions, homeLoanInterest: e.target.value})}
                placeholder="Home loan interest"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                NPS - Section 80CCD(1B) (Max ₹50,000)
              </label>
              <input
                type="number"
                value={deductions.nps}
                onChange={(e) => setDeductions({...deductions, nps: e.target.value})}
                placeholder="NPS contribution"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        <button
          onClick={calculateTax}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Calculate Tax
        </button>

        {result && (
          <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">
              Tax Calculation ({result.regime === 'new' ? 'New Regime' : 'Old Regime'})
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Gross Income:</span>
                <span className="font-semibold">₹{result.grossIncome}</span>
              </div>
              {result.regime === 'old' && result.totalDeductions > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Total Deductions:</span>
                  <span className="font-semibold">- ₹{result.totalDeductions}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-700">Taxable Income:</span>
                <span className="font-semibold">₹{result.taxableIncome}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Income Tax:</span>
                  <span>₹{result.incomeTax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Health & Education Cess (4%):</span>
                  <span>₹{result.cess}</span>
                </div>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between text-lg">
                <span className="font-bold text-gray-800">Total Tax:</span>
                <span className="font-bold text-red-600">₹{result.totalTax}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-800">Take Home:</span>
                <span className="font-bold text-green-600">₹{result.takeHome}</span>
              </div>
              <div className="flex justify-between text-sm bg-white p-2 rounded">
                <span className="text-gray-600">Effective Tax Rate:</span>
                <span className="font-semibold">{result.effectiveRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
