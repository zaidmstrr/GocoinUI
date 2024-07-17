import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import MakeTx from './pages/MakeTx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
const App = () => {

  return (
    <>
    <div className='h-screen max-width-full bg-gray-950 '>
    <RecoilRoot>
        <Router>
          <Routes>
            <Route path={"/"} element={<Home />}/>
            <Route path={"/wallet"} element={<Wallet />}/>
            <Route path={"/maketx"} element={<MakeTx />}/>
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
    </>
  )
};


export default App;