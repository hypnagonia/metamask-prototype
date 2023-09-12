import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, getAll, schemas } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../api/mockCompute'
import ExplorerList from './explorer/ExplorerList'
import { UseCounts } from './hooks/UseCounts'
import { Audits } from './Audits'
import { shortenString } from '../utils'
import { UseCreateAttestations } from './hooks/UseCreateAttestation'
import { useAttestations } from './hooks/UseAttestations'
import { Address } from './common/Address'
import { AvatarList } from './common/AvatarList'

export const AuditorDetailPage = (props: any) => {
    const { id } = useParams() as any
    const a = id.toLowerCase()
    const [gridView, setGridView] = useState('cards')
    const [tab, setTab] = useState('audits')

    const { attestations } = useAttestations()
    const { getCounts, getGroups } = UseCounts()
    const { issueAttestation } = UseCreateAttestations()


    const createFollowAttestation = () => {
        issueAttestation('follow', id, ["1"])
    }

    const filteredAttestations = attestations.filter((attestation: any) => {
        console.log({ attestation })
        if (tab === 'audits' && attestation.schemaId !== schemas.KarmaAuditAttestorSchemaId) {
            return false
        }

        if (tab === 'reviews' && attestation.schemaId !== schemas.KarmaReviewAttestorSchemaId) {
            return false
        }
        return attestation.attester.toLowerCase() === a
    })

    const auditorScore = getAuditorScore(id)



    return <><div className="container" style={{ marginTop: 30 }}>

        <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            marginBottom: 10,
            width: '100%'
        }}>

            {/*<div style={{ display: 'flex', flexDirection: 'row' }}>
                <h3>{<Address address={id} />}</h3>

                <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15 }}>
                    <span> Score:&nbsp;</span>
                    <span style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15, color: '#2a2a72' }}>
                        {auditorScore}
                    </span>
                </div>
    </div><br />*/}
            <div ><img src={`/avatar${auditorScore}.png`} style={{ width: 128, height: 128, borderRadius: 136 }} /></div>
            <div style={{ width: '60%', textAlign: 'left', marginLeft: 30, marginTop: 20, fontWeight: 'bold' }}>

                <Address address={id} />
            </div>
            <div style={{ marginTop: 20, justifyContent: 'flex-end', display: 'flex', fontSize: 14, color: '#543A69', textAlign: 'right' }}>



                <div style={{ marginLeft: 20, width: '70%' }}>
                    {/*
                    Audits: <b>{getCounts(a).audits}</b><br />
                    Reviews: <b>{getCounts(a).reviews}</b><br />
                    Upvotes: <b>{getCounts(a).auditApprovals + getCounts(a).reviewApprovals}</b><br />
                    Downvotes: <b>{getCounts(a).auditDisapprovals + getCounts(a).reviewDisapprovals}</b><br />
                    Followers: <b>{getCounts(a).followers + getCounts(a).followers}</b><br />
                    <br />
                     */}
                    <div className="strategy-btn primary"
                        onClick={createFollowAttestation}
                    ><b>&#43;</b>&nbsp;Follow</div>
                </div>

            </div>

        </div></div>
        {/*
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
         */}

        <div>
            <div style={{
                marginTop: 30,
                height: 1,
                width: '100%',
                borderBottom: '1px solid rgba(112, 0, 255, 0.25)'
            }}></div>

            <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                paddingBottom: 18,
                marginTop: 30,
                width: '100%',
                borderBottom: '1px solid rgba(112, 0, 255, 0.25)'
            }}>
                <div>
                    <div style={{}}>

                        <span
                            className={'tab-slot '}
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                setTab('audits')
                            }}>Audits ({getCounts(id).audits})</span>&nbsp;&nbsp;
                        <span className={(tab === 'audits' ? ' primary-tab' : '')}></span>
                        <span
                            className={'tab-slot'}
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                setTab('reviews')
                            }}>Reviews ({getCounts(id).reviews})</span>
                        <span className={(tab === 'reviews' ? ' primary-tab' : '')}></span>
                    </div>
                </div>


                <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
                    <div style={{ fontSize: 12, marginRight: 30 }}>
                        <b>{getCounts(id).followers}</b>&nbsp;Followers<br />
                        <AvatarList tooltip={true} attestations={getGroups(id).followers} />
                    </div>
                    <div style={{ fontSize: 12 }}>
                        <b>{getCounts(id).following}</b>&nbsp;Following<br />
                        <AvatarList tooltip={true} attestations={getGroups(id).following} />
                    </div>
                </div>
            </div>
        </div >

        <br /><br />

        {
            filteredAttestations.length ? <>
                <div className="container" >
                    <ExplorerList attestations={filteredAttestations} showSearch={false} type={gridView} />
                </div>
            </> : null
        }
    </>


}

