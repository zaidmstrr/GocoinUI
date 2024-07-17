import React from 'react';
import TopNavBar from './TopNavBar';
import { MdOutlineDashboard } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { GrTransaction } from "react-icons/gr";
import { PiShareNetworkThin } from "react-icons/pi";
import { PiNetworkFill } from "react-icons/pi";
import { SiHiveBlockchain } from "react-icons/si";
import { PiRadioactiveFill } from "react-icons/pi";
import RecentBlockCard from './Home/RecentBlockCard';
import { useNavigate } from 'react-router-dom';

function SideNavBar() {
    const navigate = useNavigate();

    const HomebuttonClicked = () => {
        navigate('/')
    }

    const WalletbuttonClicked = () => {
        navigate('/wallet')
    }

    const MakeTxbuttonClicked = () => {
        navigate('/maketx')
    }

  return (
    <>
        
        {/* <TopNavBar /> */}
        <div className="flex fixed h-full bg-gray-950">


    {/* <!-- sidebar --> */}
    <div className="hidden md:flex flex-col w-64 jtransition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center justify-center h-16 bg-gray-900 ">
           
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto ">
            <nav className="flex-1 px-2 py-4 bg-gray-900 ">
                <div onClick={HomebuttonClicked} className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                        <MdOutlineDashboard size={18}/>
                        
                    </div>
                    <div className='px-3'>
                        <button onClick={HomebuttonClicked}>Home</button>
                    </div>   
                </div>

                <div onClick={WalletbuttonClicked} className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                            <IoWalletOutline size={18}/>   
                    </div>
                        <div className='px-3'>
                            <button onClick={WalletbuttonClicked}>Wallet</button>
                        </div>  
                </div>

                <div  className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                            <GrTransaction size={18}/>   
                    </div>
                        <div className='px-3'>
                            <button onClick={MakeTxbuttonClicked}>MakeTx</button>
                        </div>  
                </div>

                <div  className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                            <PiShareNetworkThin size={18}/>   
                    </div>
                        <div className='px-3'>
                            <button>Network</button>
                        </div>  
                </div>

                <div  className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                            <PiNetworkFill size={18}/>   
                    </div>
                        <div className='px-3'>
                            <button>Transactions</button>
                        </div>  
                </div>

                <div  className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                            <SiHiveBlockchain size={18}/>   
                    </div>
                        <div className='px-3'>
                            <button>Blocks</button>
                        </div>  
                </div>

                <div  className="flex items-center justify-normal px-5 py-3 text-gray-100 hover:bg-gray-700 ">
                    <div className="">
                            <PiRadioactiveFill size={18}/>   
                    </div>
                        <div className='px-3'>
                            <button>Miners</button>
                        </div>  
                </div>
            </nav>
        </div>
    </div>

    {/* <!-- Main content --> */}
    <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4">
            {/* <h1 className="text-2xl font-bold">Welcome to my ?dashboard!</h1>
            // <h1 className="text-2xl font-bold">Welcome to my dashboard!</h1>
            <p className="mt-2 text-gray-600">This is an example dashboard using Tailwind CSS.</p> */}
            {/* <RecentBlockCard /> */}
        </div>
    </div>
    
</div>

 

    </>
  );
}

export default SideNavBar;