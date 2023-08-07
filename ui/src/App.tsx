import './App.css';
import List from './components/List'
import SnapPage from './components/SnapPage'
import { AuditorDetailPage } from './components/AuditorDetailPage'
import { AuditorListPage } from './components/AuditorListPage'

import { useEffect, useState } from 'react'


import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'

import { publicProvider } from 'wagmi/providers/public'

import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { Web3Button } from '@web3modal/react'
import { getAll } from './api/api'
import FollowersPage from './components/followers/FollowersPage';

const harmonyOneTestnet = {
  id: 1666700000,
  name: "Harmony One Testnet",
  network: "harmony",
  nativeCurrency: {
    name: "Harmony",
    symbol: "ONE",
    decimals: 18,
  },
  rpcUrls: {
    public: {
      http: ["https://api.s0.b.hmny.io"]
    },
    default: {
      http: ["https://api.s0.b.hmny.io"]
    },
  },
  blockExplorers: {
    default: {
      name: "Harmony Explorer",
      url: "https://explorer.pops.one"
    },
  }
}

const chains = [harmonyOneTestnet]
const projectId = '38b351b40e21b5c081bd0a25d34dfac4'

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
    }

    run()
  }, [])

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <WagmiConfig config={wagmiConfig}>
            <header>
              <div className="web3-btn">
                <Web3Button />
              </div>
              <div className="logo-container" style={{ marginTop: 40 }}>
                <div>
                  <Link to={'/'}>
                    <img
                      width="180px"
                      className="logo"
                      src="/logo.svg"
                      draggable="false"
                      alt="Karma3Labs Logo"
                    />
                  </Link>
                </div>
                <Link to={'/'}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: 40 }}>

                    <img src={'/metamask-icon.svg'} style={{ width: 30, height: 40, marginRight: 10 }} />

                    <div style={{ color: 'white', fontSize: 26, fontWeight: 'bold', cursor: 'pointer' }}>
                      Permissionless Snaps Store</div>
                  </div>
                </Link>
              </div>


              <div className="title">
              </div>
            </header>

            <div style={{ width: 700, margin: 'auto' }}>

              <Routes>
                <Route index path="/snap/:id" element={<SnapPage reviews={data} />} />
                <Route index path="/" element={<List reviews={data} />} />

                <Route index path="/auditor/" element={<AuditorListPage reviews={data} />} />
                <Route index path="/auditor/:id" element={<AuditorDetailPage reviews={data} />} />
                <Route index path="/followers/" element={<FollowersPage reviews={data} />} />

              </Routes>

            </div>
          </WagmiConfig>

        </div>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </BrowserRouter>
    </>
  );
}

export default App;