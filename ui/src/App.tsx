import './App.css';
import List from './components/List'
import { useEffect, useState } from 'react'
// import { getStrategies } from './api/api';
import { SearchAutocomplete } from './components/SearchAutocomplete'
import { getWindowParam, setWindowParam } from './utils';
import { useCallback } from 'react'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { rpcUrl } from './api/registry'
import { publicProvider } from 'wagmi/providers/public'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const chains = [goerli]
const projectId = 'karma3labs'


const { publicClient } = configureChains(chains, [publicProvider()])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)



function App() {

  return (
    <>
      <div className="App">
        <WagmiConfig config={wagmiConfig}>
          <Routes>
            <Route index path="/sign" element={<div>Hello</div>} />
            <Route index path="/" element={<List />} />
          </Routes>
        </WagmiConfig>
      </div>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;