import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, getAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../api/mockCompute'
import ExplorerList from './explorer/ExplorerList'
import { UseCounts } from './hooks/UseCounts'
import { Audits } from './Audits'
import { shortenString } from '../utils'
import { UseCreateAttestations } from './hooks/UseCreateAttestation'

export const AuditorDetailPage = (props: any) => {
    const { id } = useParams() as any
    const a = id.toLowerCase()
    const [gridView, setGridView] = useState('table')

    const [attestations, setAttestations] = useState([])
    const { getCounts } = UseCounts()

    const { issueAttestation } = UseCreateAttestations()


    const createFollowAttestation = () => {
        issueAttestation('follow', id, ["1"])
    }

    useEffect(() => {
        const run = async () => {
            const d = await getAll()

            const filtered = d.filter((a: any) => a.attester.toLowerCase() === id.toLowerCase())
            setAttestations(filtered)
        }

        run()
    }, [id])

    const auditorScore = getAuditorScore(id)



    return <><div className="container" style={{ marginTop: 30 }}>

        <div className="post-full small-font" >

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h3>{id}</h3>

                <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15 }}>
                    <span> Score:&nbsp;</span>
                    <span style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15, color: '#2a2a72' }}>
                        {auditorScore}
                    </span>
                </div>
            </div><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div ><img src={`/avatar${auditorScore}.png`} /></div>
                <div style={{ marginLeft: 20, width: '70%' }}>
                    {/*Address: <b style={{ color: '#2a2a72' }}>{id}</b><br />*/}

                    Audits: <b>{getCounts(a).audits}</b><br />
                    Reviews: <b>{getCounts(a).reviews}</b><br />
                    Upvotes: <b>{getCounts(a).auditApprovals + getCounts(a).reviewApprovals}</b><br />
                    Downvotes: <b>{getCounts(a).auditDisapprovals + getCounts(a).reviewDisapprovals}</b><br />
                    <br />
                    <div className="strategy-btn"
                        onClick={createFollowAttestation}
                    >Follow</div>
                </div>

            </div>

        </div>

        {attestations.length ? <>
            <div style={{ width: '100%', textAlign: 'left' }}>
                <span
                    className="strategy-btn"
                    style={{ backgroundColor: gridView === 'table' ? 'orange' : 'white' }}
                    onClick={() => {
                        setGridView('table')
                    }}>Table</span>
                &nbsp;&nbsp;
                <span
                    className="strategy-btn"
                    style={{ backgroundColor: gridView !== 'table' ? 'orange' : 'white' }}
                    onClick={() => {
                        setGridView('cards')
                    }}>Cards</span>
            </div>
            <br />
        </> : null}
    </div>

        {attestations.length ? <>
            <div className="container" >
                <ExplorerList attestations={attestations} showSearch={false} type={gridView} />
            </div>
        </> : null}
    </>


}

