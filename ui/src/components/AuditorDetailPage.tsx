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
import { useAttestations } from './hooks/UseAttestations'

export const AuditorDetailPage = (props: any) => {
    const { id } = useParams() as any
    const a = id.toLowerCase()
    const [gridView, setGridView] = useState('table')

    const { attestations } = useAttestations()
    const { getCounts } = UseCounts()
    const { issueAttestation } = UseCreateAttestations()


    const createFollowAttestation = () => {
        issueAttestation('follow', id, ["1"])
    }

    const filteredAttestations = attestations.filter((attestation: any) => attestation.attester.toLowerCase() === a)

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
                    Followers: <b>{getCounts(a).followers + getCounts(a).followers}</b><br />
                    <br />
                    <div className="strategy-btn secondary"
                        onClick={createFollowAttestation}
                    ><b>&#43;</b>&nbsp;Follow</div>
                </div>

            </div>

        </div>

        {filteredAttestations.length ? <>
            <div style={{ width: '100%', textAlign: 'left' }}>
                <span
                    className={'strategy-btn ' + (gridView === 'table' ? ' primary' : '')}
                    onClick={() => {
                        setGridView('table')
                    }}>Table</span>
                &nbsp;&nbsp;
                <span
                    className={'strategy-btn ' + (gridView !== 'table' ? ' primary' : '')}
                    onClick={() => {
                        setGridView('cards')
                    }}>Cards</span>
            </div>
            <br />
        </> : null}
    </div>

        {filteredAttestations.length ? <>
            <div className="container" >
                <ExplorerList attestations={filteredAttestations} showSearch={false} type={gridView} />
            </div>
        </> : null}
    </>


}

