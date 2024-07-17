import React, { useState } from 'react';
import TableShow from './TableShow';

const OutputRow = ({ onRemove }) => (

    <tr>
        <td className="py-2 px-2">
            <div className="flex items-center">
                <input type="text" className="flex-grow w-[600px] bg-gray-600 border border-gray-500 p-1 mr-2" />
                <button className="px-2 py-2 text-sm w-[110px] bg-gray-600 text-white rounded">Address Book</button>
            </div>
        </td>
        <td className="py-2 px-2">
            <input type="text" className="w-full bg-red-700 border border-gray-500 p-1" />
        </td>
        <td className="py-2 px-2">
            <input type="text" className="w-full bg-gray-600 border border-gray-500 p-1" />
        </td>
    </tr>
);

const DisplayWallet = () => {
    const [amount, setAmount] = useState(0);
    const [outputs, setOutputs] = useState([{}]);
    const [sequence, setSequence] = useState(0);
    const [isFinal, setIsFinal] = useState(false);
    const [transactionFee, setTransactionFee] = useState(0.00000046);
    const [satoshisPerByte, setSatoshisPerByte] = useState(1.051898);

    const addOutput = () => {
        setOutputs([...outputs, {}]);
    };

    const removeOutput = () => {
        if (outputs.length > 1) {
            setOutputs(outputs.slice(0, -1));
        }
    };

    return (
        <div className='pt-28 md:pl-[290px] pl-[20px]'>
            <div className='md:pl-[80px]'>
                <div className="max-w-5xl min-w-5xl p-4 bg-gray-700 text-white shadow-md rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Payment details</h2>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded">Edit Address Book</button>
                    </div>

                    <p className="mb-4">Selected amount: {amount} BTC in {outputs.length} outputs.</p>

                    <table className="mb-4 w-full">
                        <thead className="bg-blue-800 text-white">
                            <tr>
                                <th className="py-2 px-4 text-left">Pay to address</th>
                                <th className="py-2 px-4 text-right">Amount BTC</th>
                                <th className="py-2 px-4 text-right">... mBTC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outputs.map((_, index) => (
                                <OutputRow key={index} onRemove={removeOutput} />
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mb-4 ">
                        <div className='flex content-start space-x-5'>
                            <button className="text-blue-400" onClick={addOutput}>+add output</button>
                            <button className="text-blue-400" onClick={removeOutput}>-remove last</button>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Sequence :</span>
                            <input type="number" value={sequence} onChange={(e) => setSequence(e.target.value)} className="w-12 bg-gray-600 border border-gray-500 p-1 mr-2" />
                            <label className="flex items-center">
                                <input type="checkbox" checked={isFinal} onChange={() => setIsFinal(!isFinal)} className="mr-1" />
                                Final
                            </label>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Transaction fee:</span>
                            <input type="number" value={transactionFee} onChange={(e) => setTransactionFee(e.target.value)} className="w-28 bg-gray-600 border border-gray-500 p-1 mr-2" />
                            <span className="bg-gray-600 px-1 rounded">1.0 SPB</span>
                            <input type="text" value="0.00046" className="w-28 bg-gray-600 border border-gray-500 p-1 ml-2" readOnly />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <select className="bg-gray-600 border w-4/6 border-gray-500 p-1">
                            <option>The first input's address</option>
                        </select>
                        <input type="text" value="-0.00000046" className="w-28 bg-gray-600 border mr-6 border-gray-500 p-1" readOnly />
                        <div className='flex'>
                            <input type="checkbox" className="mr-2" />
                            <input type="text" value="-0.00046" className="w-28 bg-gray-600 border border-gray-500 p-1" readOnly />
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <input type="checkbox" checked className="mr-2" />
                        <span className="mr-2">Auto-calc transaction fee using price of</span>
                        <input type="number" value={satoshisPerByte} onChange={(e) => setSatoshisPerByte(e.target.value)} className="w-24 bg-gray-600 border border-gray-500 p-1 mr-2" />
                        <span>Satoshis Per Byte.</span>
                        <span className="ml-4">Estimated virtual transaction size: 44 bytes</span>
                    </div>

                    <button className="w-full py-2 bg-gray-600 text-white rounded">Download payment.zip</button>

                    <p className="mt-4 text-sm text-gray-300">Note: all the inputs selected below will be combined within one transaction, despite of the amounts entered above.</p>
                </div>
            </div>



            <div className='pl-14 mt-8 overflow-x-hidden w-11/12 pb-5'>
                <TableShow />
            </div>
        </div>


    );
};

export default DisplayWallet;