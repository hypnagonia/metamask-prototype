import './App.css';
import List from './components/List'
import SnapPage from './components/SnapPage'
import { AuditorDetailPage } from './components/AuditorDetailPage'
import { AuditorListPage } from './components/AuditorListPage'

import { useEffect, useState } from 'react'
import { useSignMessage, useAccount } from 'wagmi'

import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'

import { publicProvider } from 'wagmi/providers/public'

import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { Web3Button } from '@web3modal/react'
import { getAll } from './api/api'
import FollowersPage from './components/followers/FollowersPage'
import FollowersNew from './components/followers/FollowersNew'
import ExplorerPage from './components/explorer/ExplorerPage'
import AuditDetailsPage from './components/attestations/AuditDetailsPage'
import CommunityTable from './components/community/CommunityTable'
import AttestationNew from './components/forms/AttestationNew'
import ReviewNew from './components/forms/ReviewNew'

import { UseCreateAttestations } from './components/hooks/UseCreateAttestation'

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
  // const { issueAttestation } = UseCreateAttestations()

  const account = useAccount()

  const createFollowAttestation = () => {
    // issueAttestation('follow', )
  }
  

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
                <br />
                {/* active only if wallet connected */}
                <div style={{ width: 200, textAlign: 'right' }}>
                  {account && account.isConnected && <>
                    <Link to={'/followers/new'} style={{ color: 'white' }}>
                  <span
                    className="strategy-btn"
                    style={{ marginRight: 28, marginTop: 15, width: 100 }}
                    onClick={createFollowAttestation}><b>&#43;</b>&nbsp;Invite</span>
                    </Link></>
                    }

                </div>
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
                  <div className="logo-menu">
                    <Link to={'/'} style={{ color: 'white' }}>Snaps</Link>&nbsp;&nbsp;
                    <Link to={'/explorer'} style={{ color: 'white' }}>Explorer</Link>&nbsp;&nbsp;
                    <Link to={'/community'} style={{ color: 'white' }}>Community</Link>&nbsp;&nbsp;

                  </div>
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
                <Route index path="/followers/new" element={<FollowersNew />} />
                
                <Route index path="/followers/:attestor" element={<FollowersPage reviews={data} />} />
                <Route index path="/explorer/" element={<ExplorerPage reviews={data} />} />
                <Route index path="/community/" element={<CommunityTable/>} />
                
                <Route index path="/audit/:id" element={<AuditDetailsPage />} />
                <Route index path="/attestation/new/:shasum" element={<AttestationNew />} />
                <Route index path="/review/new/:shasum" element={<ReviewNew />} />
                

              </Routes>

            </div>
          </WagmiConfig>

        </div>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /><br />

      </BrowserRouter>
    </>
  );
}

export default App;