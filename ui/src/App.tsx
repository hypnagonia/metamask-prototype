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
import { useLocation } from 'react-router-dom'
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

  const snapsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="22" height="7" viewBox="0 0 22 7" fill="none">
    <path d="M1 1L11 6L21 1" stroke="#7000FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

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
                        style={{ marginRight: 28, marginTop: 15, width: 50, padding:0 }}
                        onClick={createFollowAttestation}>
                        <img style={{ width: 18, height: 18 }} src='/user-plus.svg' />
                        
                      </span>
                    </Link></>
                  }

                </div>
              </div>

              <div style={{ width: '400px', textAlign: 'center', margin: 'auto' }}>
                <div className="logo-menu" style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                  width: 400,
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex', flexDirection: 'row'
                  }}>
                    <img src={'/snaps.svg'} style={{ width: 24 }} />&nbsp;
                    <Link to={'/'}>
                      Snaps</Link>
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'row'
                  }}>
                    <img src={'/explorer.svg'} style={{ width: 24 }} />&nbsp;
                    <Link to={'/explorer'}>Explorer</Link></div>
                  <div style={{
                    display: 'flex', flexDirection: 'row'
                  }}>
                    <img src={'/users.svg'} style={{ width: 24 }} />&nbsp;
                    <Link to={'/community'}>Community</Link></div>
                </div>
              </div>

              <div className="logo-container" style={{ marginTop: 40 }}>
                <div>
                  <Link to={'/'}>
                    {/* <img
                      width="180px"
                      className="logo"
                      src="/logo.svg"
                      draggable="false"
                      alt="Karma3Labs Logo"
                />*/}
                    <img
                      className="logo"
                      src={'/metamask-icon.svg'} style={{ width: 30, height: 40, marginRight: 10 }} />
                  </Link>





                </div>






              </div>


              <div className="title">
              </div>
            </header>

            <div style={{ width: 850, margin: 'auto' }}>

              <Routes>
                <Route index path="/snap/:id" element={<SnapPage reviews={data} />} />
                <Route index path="/snap/:id/:versionShasum" element={<SnapPage reviews={data} />} />
                <Route index path="/" element={<List reviews={data} />} />

                <Route index path="/auditor/" element={<AuditorListPage reviews={data} />} />
                <Route index path="/auditor/:id" element={<AuditorDetailPage reviews={data} />} />
                <Route index path="/followers/" element={<FollowersPage reviews={data} />} />
                <Route index path="/followers/new" element={<FollowersNew />} />

                <Route index path="/followers/:attestor" element={<FollowersPage reviews={data} />} />
                <Route index path="/explorer/" element={<ExplorerPage reviews={data} />} />
                <Route index path="/community/" element={<CommunityTable />} />

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

export default App