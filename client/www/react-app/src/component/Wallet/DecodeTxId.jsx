import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DecodeTxId = ({ txid, sid }) => {
  const [loading, setLoading] = useState(true); // Set loading initially to true to show loading state
  const [transactionInfo, setTransactionInfo] = useState(null);

  const xval = (xml, tag) => {
    try {
      return xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchTransactionInfo = async () => {
      try {
        const response = await axios.get(`txs2s.xml?id=${txid}&sid=${sid}`, {
          headers: { 'Content-Type': 'application/xml' },
        });

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const status = xval(xmlDoc, 'status');

        if (status !== 'OK') {
          alert("Error: " + status);
          setLoading(false);
          return;
        }

        const getTransactionInfo = (xml) => {
          const txInfo = {
            id: xval(xml, 'id'),
            version: xval(xml, 'version'),
            inputs: [],
            outputs: [],
            lockTime: xval(xml, 'lock_time'),
            size: parseInt(xval(xml, 'size')),
            nwsize: parseInt(xval(xml, 'nwsize')),
            weight: parseInt(xval(xml, 'weight')),
            sigops: parseInt(xval(xml, 'sigops')),
            sw_compress: parseFloat(xval(xml, 'sw_compress')),
            verify_us: xval(xml, 'verify_us'),
          };

          const inputs = xml.getElementsByTagName('input');
          let totalInput = 0;
          let allInputValues = true;
          for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const value = parseInt(xval(input, 'value'));
            totalInput += isNaN(value) ? 0 : value;
            txInfo.inputs.push({
              txidVout: xval(input, 'txid-vout'),
              block: xval(input, 'block'),
              sequence: parseInt(xval(input, 'sequence')).toString(16),
              status: xval(input, 'status'),
              value: value,
              addr: xval(input, 'addr') || xval(input, 'pkscript'),
              input_sigops: parseInt(xval(input, 'input_sigops')),
              script_sig: xval(input, 'script_sig'),
              witness: Array.from(input.getElementsByTagName('witness')).map(w => w.textContent || 'OP_0')
            });
            if (isNaN(value)) allInputValues = false;
          }
          txInfo.totalInput = (totalInput / 1e8).toFixed(8) + ' BTC';

          const outputs = xml.getElementsByTagName('output');
          let totalOutput = 0;
          for (let i = 0; i < outputs.length; i++) {
            const output = outputs[i];
            const value = parseInt(xval(output, 'value'));
            totalOutput += value;
            txInfo.outputs.push({
              value: (value / 1e8).toFixed(8) + ' BTC',
              addr: xval(output, 'addr'),
            });
          }
          txInfo.totalOutput = (totalOutput / 1e8).toFixed(8) + ' BTC';

          const fee = totalInput - totalOutput;
          txInfo.fee = (fee / 1e8).toFixed(8) + ' BTC';
          txInfo.feePerByte = (fee / txInfo.size).toFixed(5) + ' Satoshis per byte';

          return txInfo;
        };

        const txInfo = getTransactionInfo(xmlDoc);
        setTransactionInfo(txInfo);

      } catch (error) {
        console.error("Error fetching transaction data: ", error);
        alert("An error occurred while fetching transaction data.");
      }

      setLoading(false);
    };

    fetchTransactionInfo();
  }, [txid, sid]);

  return (
    <div className="mt-4 p-4 border rounded-md shadow-md bg-gray-700 text-white">
      {loading ? (
        <p>Loading...</p>
      ) : (
        transactionInfo && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Transaction Info</h3>
            <div className='flex flex-col'> 
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">ID:</span> <p className='text-white'> {transactionInfo.id}</p></div>
                <div className='flex space-x-1'><span className="font-semibold  text-gray-400">Total Input:</span> <p className='text-white'> {transactionInfo.totalInput} </p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Version:</span> <p className='text-white'>{transactionInfo.version}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Total Output:</span> <p className='text-white'>{transactionInfo.totalOutput}</p> </div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Lock Time:</span> <p className='text-white'>{transactionInfo.lockTime}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Fee:</span> <p>{transactionInfo.fee}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Fee per Byte:</span> <p className='text-white'>{transactionInfo.feePerByte}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Size:</span> <p className='text-white'>{transactionInfo.size}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">NoWit Size:</span> <p className='text-white'>{transactionInfo.nwsize}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Weight:</span> <p className='text-white'>{transactionInfo.weight}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">VSize:</span> <p className='text-white'>{(transactionInfo.size === transactionInfo.nwsize) ? transactionInfo.size : ((3 * (transactionInfo.nwsize + 1) + transactionInfo.size) >> 2)}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Sigops:</span> <p className='text-white'>{transactionInfo.sigops ? transactionInfo.sigops:'null'}</p></div>
                <div className='flex space-x-1'><span className="font-semibold text-gray-400">Verification Time:</span> <p className='text-white'>{transactionInfo.verify_us} </p> <p>microseconds</p></div>
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Inputs</h4>
              {transactionInfo.inputs.map((input, index) => (
                <div key={index} className="border rounded-md p-2 mb-2 w-full overflow-x-scroll">
                  <p><span className="font-semibold">{index + 1})</span> {input.txidVout}</p>
                  <div className='flex flex-col text-white'>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Block:</span> <p>{isNaN(input.block) || input.block === '0' ? '(unconfirmed)' : `(#${input.block})`}</p></div>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Sequence:</span> <p>{input.sequence}</p></div>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Status:</span> <p className='text-green-200'>{input.status}</p></div>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Value:</span> <p className=''>{isNaN(input.value) ? '' : (parseFloat(input.value) / 1e8).toFixed(8) + ' BTC'}</p></div>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Address:</span> <p>{input.addr}</p></div>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Input Sigops:</span> <p>{input.input_sigops ? input.input_sigops : "null"}</p></div>
                    <div className='flex space-x-1'><span className="font-semibold text-gray-400">Script Sig:</span> <p>{input.script_sig}</p></div>
                  </div>
                  {input.witness.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">SegWit Stack:</p>
                      {input.witness.map((witness, i) => (
                        <p key={i}>{witness}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Outputs</h4>
              {transactionInfo.outputs.map((output, index) => (
                <div key={index} className="border rounded-md p-2 mb-2 flex space-x-1">
                  {/* <p>{`${index + 1 })${output.value} => ${output.addr}`}</p> */}
                  <p>{`(${index + 1}) `}</p> <p> {output.value}</p> <p>{"=>"}</p> <p>{output.addr}</p>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default DecodeTxId;
