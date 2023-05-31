import './App.css';
import List from './components/List'
import SnapPage from './components/SnapPage'

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

import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { Web3Button } from '@web3modal/react'
import { getAll } from './api/api'

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
  const [data, setData] = useState([])

  useEffect(() => {
    const run = async () => {
      const d = await getAll()
      setData(d)

      console.log('all reviews', d)
    }

    run()
  }, [])

  return (
    <>
      <div className="App">
        <WagmiConfig config={wagmiConfig}>
          <header>
            <div className="web3-btn">
              <Web3Button />
            </div>
            <div className="logo-container" style={{ marginTop: 40 }}>
              <a href="https://karma3labs.com/" target="_blank">
                <img
                  width="180px"
                  className="logo"
                  src="/logo.svg"
                  draggable="false"
                  alt="Karma3Labs Logo"
                />
              </a>
            </div>


            <div className="title">
            </div>
          </header>

          <div style={{ width: 700, margin: 'auto' }}>
            <BrowserRouter>
              <Routes>
                <Route index path="/snap/:id" element={<SnapPage reviews={data} />} />
                <Route index path="/" element={<List reviews={data} />} />
              </Routes>
            </BrowserRouter>
          </div>
        </WagmiConfig>

      </div>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;