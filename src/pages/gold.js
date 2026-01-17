import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GoldRateCalculator() {
  const [activeTab, setActiveTab] = useState('buying');
  const [liveRate, setLiveRate] = useState(0);
  const [manualRate, setManualRate] = useState('');
  const [useLiveRate, setUseLiveRate] = useState(true);
  const [wastage, setWastage] = useState('10');
  const [makingType, setMakingType] = useState('percentage');
  const [makingValue, setMakingValue] = useState('8');
  const [netWeight, setNetWeight] = useState('10');
  const [loading, setLoading] = useState(false);
  const [selectedCarat, setSelectedCarat] = useState('24');
  const [cart, setCart] = useState([]);

  // Selling specific fields
  const [sellingWastageDeduction, setSellingWastageDeduction] = useState('5');
  const [sellingMakingDeduction, setSellingMakingDeduction] = useState('100');

  const fetchLiveRate = async () => {
    setLoading(true);
    try {

      async function fetchGoldRate() {
        try {
          const apiKey = "fb6501afd002c8a30841d7961f9b7491"; // replace with your MetalpriceAPI key
          const url = `https://api.metalpriceapi.com/v1/latest?base=XAU&currencies=PKR&api_key=${apiKey}`;

          const response = await fetch(url);
          const data = await response.json();

          if (!data.success) {
            // handle API error
            console.error("API error:", data);
            return;
          }

          // API returns PKR value per troy ounce
          const pkrPerOunce = data.rates.PKR;

          // convert troy ounce to grams (1 troy oz = 31.1035 g)
          const pkrPerGram = pkrPerOunce / 31.1035;

          // round if you want
          const liveRate = Math.round(pkrPerGram);

          console.log("Gold price (PKR per gram):", liveRate);
          return liveRate;

        } catch (error) {
          console.error("Error fetching gold rate:", error);
        }
      }

      // Example usage
      
     const ratePerGram = (await fetchGoldRate() ?? 0);
      
      // Optional: round value
      setLiveRate(Math.round(ratePerGram));
    } catch (error) {
      console.error('Error fetching live rate:', error);
      // Fallback to a sample Pakistan rate for demonstration
      setLiveRate();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveRate();
  }, []);

  const carats = [
    { karat: 24, purity: 1.0 },
    { karat: 23, purity: 0.958 },
    { karat: 22, purity: 0.917 },
    { karat: 21, purity: 0.875 },
    { karat: 20, purity: 0.833 },
    { karat: 18, purity: 0.75 },
    { karat: 16, purity: 0.667 },
    { karat: 14, purity: 0.583 },
    { karat: 12, purity: 0.5 },
    { karat: 10, purity: 0.417 },
    { karat: 9, purity: 0.375 },
    { karat: 8, purity: 0.333 }
  ];

  const calculateBuyingPrice = (purity) => {
    const baseRate = useLiveRate ? liveRate : parseFloat(manualRate) || 0;
    const weight = parseFloat(netWeight) || 0;
    const wastagePercent = parseFloat(wastage) || 0;
    const makingVal = parseFloat(makingValue) || 0;

    // Calculate pure gold value
    const pureGoldValue = baseRate * purity * weight;

    // Add wastage
    const withWastage = pureGoldValue * (1 + wastagePercent / 100);

    // Add making charges
    let totalPrice;
    if (makingType === 'percentage') {
      totalPrice = withWastage * (1 + makingVal / 100);
    } else {
      totalPrice = withWastage + makingVal;
    }

    return totalPrice;
  };

  const calculateSellingPrice = (purity) => {
    const baseRate = useLiveRate ? liveRate : parseFloat(manualRate) || 0;
    const weight = parseFloat(netWeight) || 0;
    const wastageDeduction = parseFloat(sellingWastageDeduction) || 0;
    const makingDeduction = parseFloat(sellingMakingDeduction) || 0;

    // Calculate pure gold value
    const pureGoldValue = baseRate * purity * weight;

    // Deduct wastage percentage
    const afterWastage = pureGoldValue * (1 - wastageDeduction / 100);

    // Deduct making charges (fixed amount)
    const totalPrice = afterWastage - makingDeduction;

    return Math.max(0, totalPrice); // Ensure not negative
  };

  const addToCart = () => {
    const selectedCaratData = carats.find(c => c.karat === parseInt(selectedCarat));
    if (!selectedCaratData) return;

    const price = activeTab === 'buying'
      ? calculateBuyingPrice(selectedCaratData.purity)
      : calculateSellingPrice(selectedCaratData.purity);

    const cartItem = {
      id: Date.now(),
      carat: selectedCaratData.karat,
      purity: selectedCaratData.purity,
      weight: parseFloat(netWeight) || 0,
      price: price,
      type: activeTab,
      wastage: activeTab === 'buying' ? parseFloat(wastage) : parseFloat(sellingWastageDeduction),
      making: activeTab === 'buying'
        ? (makingType === 'percentage' ? `${makingValue}%` : `Rs. ${makingValue}`)
        : `Rs. ${sellingMakingDeduction}`,
      baseRate: useLiveRate ? liveRate : parseFloat(manualRate) || 0
    };

    setCart([...cart, cartItem]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-900 mb-2 text-center">
          Gold Rate Calculator
        </h1>
        <p className="text-center text-gray-600 mb-8">Pakistan Market Rates</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('buying')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${activeTab === 'buying'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Buying Gold
          </button>
          <button
            onClick={() => setActiveTab('selling')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${activeTab === 'selling'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Selling Gold
          </button>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gold Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gold Rate (24K per gram) - PKR
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setUseLiveRate(true)}
                  className={`px-4 py-2 rounded ${useLiveRate
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  Live Rate
                </button>
                <button
                  onClick={() => setUseLiveRate(false)}
                  className={`px-4 py-2 rounded ${!useLiveRate
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  Manual
                </button>
                {useLiveRate && (
                  <button
                    onClick={fetchLiveRate}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                )}
              </div>
              {useLiveRate ? (
                <div className="text-2xl font-bold text-amber-700">
                  Rs. {liveRate.toLocaleString('en-PK')}
                </div>
              ) : (
                <input
                  type="number"
                  value={manualRate}
                  onChange={(e) => setManualRate(e.target.value)}
                  placeholder="Enter rate per gram"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Net Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'buying' ? 'Buying' : 'Selling'} Net Weight (grams)
              </label>
              <input
                type="number"
                value={netWeight}
                onChange={(e) => setNetWeight(e.target.value)}
                placeholder="Enter weight"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Carat Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Carat
              </label>
              <select
                value={selectedCarat}
                onChange={(e) => setSelectedCarat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {carats.map((carat) => (
                  <option key={carat.karat} value={carat.karat}>
                    {carat.karat}K - {(carat.purity * 100).toFixed(1)}% Pure
                  </option>
                ))}
              </select>
            </div>

            {/* Buying Fields */}
            {activeTab === 'buying' && (
              <>
                {/* Wastage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wastage (%)
                  </label>
                  <input
                    type="number"
                    value={wastage}
                    onChange={(e) => setWastage(e.target.value)}
                    placeholder="Enter wastage %"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Making Charges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Making Charges
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setMakingType('percentage')}
                      className={`px-4 py-2 rounded ${makingType === 'percentage'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      Percentage
                    </button>
                    <button
                      onClick={() => setMakingType('amount')}
                      className={`px-4 py-2 rounded ${makingType === 'amount'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      Amount (PKR)
                    </button>
                  </div>
                  <input
                    type="number"
                    value={makingValue}
                    onChange={(e) => setMakingValue(e.target.value)}
                    placeholder={makingType === 'percentage' ? 'Enter %' : 'Enter amount'}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* Selling Fields */}
            {activeTab === 'selling' && (
              <>
                {/* Wastage Deduction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wastage Deduction (%)
                  </label>
                  <input
                    type="number"
                    value={sellingWastageDeduction}
                    onChange={(e) => setSellingWastageDeduction(e.target.value)}
                    placeholder="Enter wastage deduction %"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Making Deduction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Making Charges Deduction (PKR)
                  </label>
                  <input
                    type="number"
                    value={sellingMakingDeduction}
                    onChange={(e) => setSellingMakingDeduction(e.target.value)}
                    placeholder="Enter making deduction amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <button
              onClick={addToCart}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${activeTab === 'buying'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {activeTab === 'buying' ? 'Buying Price' : 'Selling Price'} by Carat
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carats.map((carat) => {
              const price = activeTab === 'buying'
                ? calculateBuyingPrice(carat.purity)
                : calculateSellingPrice(carat.purity);

              return (
                <div
                  key={carat.karat}
                  className={`border-2 rounded-lg p-4 hover:border-opacity-100 transition-colors ${activeTab === 'buying'
                    ? 'border-green-200 hover:border-green-400'
                    : 'border-blue-200 hover:border-blue-400'
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-700">
                      {carat.karat}K Gold
                    </span>
                    <span className="text-sm text-gray-500">
                      {(carat.purity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${activeTab === 'buying' ? 'text-green-700' : 'text-blue-700'
                    }`}>
                    Rs. {price.toLocaleString('en-PK', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    per {netWeight}g
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className={`rounded-lg shadow-lg p-6 mt-6 ${activeTab === 'buying'
          ? 'bg-gradient-to-r from-green-600 to-emerald-600'
          : 'bg-gradient-to-r from-blue-600 to-cyan-600'
          }`}>
          <h2 className="text-2xl font-bold mb-4 text-white">Summary</h2>
          <div className="space-y-4">
            {/* Selected Carat Dropdown */}
            <div>
              <div className="text-sm opacity-90 mb-2 text-white">Selected Carat</div>
              <select
                value={selectedCarat}
                onChange={(e) => setSelectedCarat(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                {carats.map((carat) => (
                  <option key={carat.karat} value={carat.karat} className="text-gray-800">
                    {carat.karat}K Gold
                  </option>
                ))}
              </select>
            </div>

            {/* Carat Rate × Weight */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-sm opacity-90">Rate ({selectedCarat}K) × Net Weight ({netWeight}g)</div>
                <div className="text-2xl font-bold mt-1">
                  Rs. {(() => {
                    const baseRate = useLiveRate ? liveRate : parseFloat(manualRate) || 0;
                    const selectedCaratData = carats.find(c => c.karat === parseInt(selectedCarat));
                    const weight = parseFloat(netWeight) || 0;
                    const caratRate = selectedCaratData ? baseRate * selectedCaratData.purity : 0;
                    const subtotal = caratRate * weight;
                    return subtotal.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                  })()}
                </div>
              </div>

              {activeTab === 'buying' ? (
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-sm opacity-90">Wastage ({wastage}%)</div>
                  <div className="text-2xl font-bold mt-1">
                    Rs. {(() => {
                      const baseRate = useLiveRate ? liveRate : parseFloat(manualRate) || 0;
                      const selectedCaratData = carats.find(c => c.karat === parseInt(selectedCarat));
                      const weight = parseFloat(netWeight) || 0;
                      const wastagePercent = parseFloat(wastage) || 0;
                      const caratRate = selectedCaratData ? baseRate * selectedCaratData.purity : 0;
                      const subtotal = caratRate * weight;
                      const wastageAmount = subtotal * (wastagePercent / 100);
                      return wastageAmount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-sm opacity-90">Wastage Deduction ({sellingWastageDeduction}%)</div>
                  <div className="text-2xl font-bold mt-1">
                    - Rs. {(() => {
                      const baseRate = useLiveRate ? liveRate : parseFloat(manualRate) || 0;
                      const selectedCaratData = carats.find(c => c.karat === parseInt(selectedCarat));
                      const weight = parseFloat(netWeight) || 0;
                      const wastagePercent = parseFloat(sellingWastageDeduction) || 0;
                      const caratRate = selectedCaratData ? baseRate * selectedCaratData.purity : 0;
                      const subtotal = caratRate * weight;
                      const wastageAmount = subtotal * (wastagePercent / 100);
                      return wastageAmount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Making Charges */}
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              {activeTab === 'buying' ? (
                <>
                  <div className="text-sm opacity-90">
                    Making Charges ({makingType === 'percentage' ? `${makingValue}%` : `Rs. ${makingValue}`})
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    Rs. {(() => {
                      const baseRate = useLiveRate ? liveRate : parseFloat(manualRate) || 0;
                      const selectedCaratData = carats.find(c => c.karat === parseInt(selectedCarat));
                      const weight = parseFloat(netWeight) || 0;
                      const wastagePercent = parseFloat(wastage) || 0;
                      const makingVal = parseFloat(makingValue) || 0;
                      const caratRate = selectedCaratData ? baseRate * selectedCaratData.purity : 0;
                      const subtotal = caratRate * weight;
                      const withWastage = subtotal * (1 + wastagePercent / 100);
                      const makingAmount = makingType === 'percentage'
                        ? withWastage * (makingVal / 100)
                        : makingVal;
                      return makingAmount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    })()}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm opacity-90">Making Charges Deduction</div>
                  <div className="text-2xl font-bold mt-1">
                    - Rs. {parseFloat(sellingMakingDeduction).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                </>
              )}
            </div>

            {/* Total */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4 border-2 border-white border-opacity-50">
              <div className="text-sm opacity-90">
                {activeTab === 'buying' ? 'Total Price' : 'You Receive'}
              </div>
              <div className="text-3xl font-bold mt-1">
                Rs. {(() => {
                  const selectedCaratData = carats.find(c => c.karat === parseInt(selectedCarat));
                  const price = selectedCaratData
                    ? (activeTab === 'buying'
                      ? calculateBuyingPrice(selectedCaratData.purity)
                      : calculateSellingPrice(selectedCaratData.purity))
                    : 0;
                  return price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${item.type === 'buying'
                    ? 'border-green-200 bg-green-50'
                    : 'border-blue-200 bg-blue-50'
                    }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        {item.carat}K Gold
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === 'buying'
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white'
                        }`}>
                        {item.type === 'buying' ? 'Buying' : 'Selling'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.weight}g • Base: Rs. {item.baseRate.toLocaleString('en-PK')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${item.type === 'buying' ? 'text-green-700' : 'text-blue-700'
                      }`}>
                      Rs. {item.price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Total */}
            <div className="mt-6 pt-4 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-3xl font-bold text-amber-700">
                  Rs. {calculateCartTotal().toLocaleString('en-PK', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}