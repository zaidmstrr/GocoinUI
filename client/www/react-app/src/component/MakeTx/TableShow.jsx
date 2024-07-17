import React, { useState } from 'react';

const TableShow = () => {
  const [wallet, setWallet] = useState('MyWallet');
  const [totalBalance, setTotalBalance] = useState('50.0269357');
  const [outputs, setOutputs] = useState('11');

  const inputData = [
    { id: 1, block: '27734', txid: '2b83c3498df29b6e4af3509e2a5da4924a4adc126112f93c09c940b155c927f4 - 1', btcValue: '0.00515101', address: 'mtaPyGNYATCGjziWhivegEV3UTBBqAj6nh', type: 'TypC 2' },
    { id: 2, block: '31826', txid: 'fd15859048bc89f9e2fdb8fbf4e6ca4268c55f472a27aed14677b69e3629beff - 0', btcValue: '0.00100000', address: 'msCHqYvwZ3Bkrn9ZCYuqwVjDk2PFpLcVuU', type: 'TypC 3' },
    // ... Add more data for other rows
  ];

  return (
    <div className="mt-0 overflow-x-auto bg-gray-700 text-white p-2 rounded-lg ">
      <h2 className="text-xl font-bold mb-4">Select Inputs</h2>
      <div className="flex items-center mb-4 text-sm">
        <label className="mr-2">Wallet:</label>
        <select 
          value={wallet} 
          onChange={(e) => setWallet(e.target.value)}
          className="bg-gray-600 border border-gray-500 rounded px-2 py-1 mr-4"
        >
          <option value="MyWallet">MyWallet</option>
        </select>
        <span className="mr-4">Total balance: {totalBalance} BTC in {outputs} outputs.</span>
        <span className="text-yellow-300">⚠ Only accounting outputs with at least 0.001 BTC</span>
      </div>
      <div className="overflow-x-auto  rounded-lg mr-0">
        <table className="w-full min-w-[1000px] text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-50">
            <tr>
              <th scope="col" className="px-1 py-3">#</th>
              <th scope="col" className="px-1 py-3">Block</th>
              <th scope="col" className="px-1 py-3">TxID - VOut</th>
              <th scope="col" className="px-1 py-3 ">BTC Value</th>
              <th scope="col" className="px-1 py-3">Address</th>
              <th scope="col" className="px-1 py-3">Type</th>
              <th scope="col" className="px-1 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {inputData.map(data => (
              <tr key={data.id} className="border-b  border-gray-600">
                <td className="px-1 py-3">{data.id}</td>
                <td className="px-1 py-3 ">{data.block}</td>
                <td className="px-1 py-3 w-6/12 max-w-xs">{data.txid}</td>
                <td className="px-1 py-3 ">{data.btcValue}</td>
                <td className="px-1 py-3 truncate max-w-xs">{data.address}</td>
                <td className="px-1 py-3">{data.type}</td>
                <td className="px-1 py-3">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 bg-gray-600 border-gray-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableShow;
