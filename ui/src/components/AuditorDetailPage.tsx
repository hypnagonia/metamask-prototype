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
import { UseCompute } from './hooks/UseCompute'
import { ethers } from 'ethers'
import { UseIdentity, getSocials, getEns } from './hooks/UseIdentity'
import { pretrustAccounts } from '../api/pretrustAccounts'

export const AuditorDetailPage = (props: any) => {
    const { id } = useParams() as any
    const a = id.toLowerCase()
    const [gridView, setGridView] = useState('cards')
    const [tab, setTab] = useState('audits')
    const { identities } = UseIdentity(id)
    const { topUsers, attestations: compute } = UseCompute()

    const identity = identities[id] || ''

    const isTopAuditor = !!topUsers.topUsersAudits.find((a: any) => a.address === id)
    const isTopReviewer = !!topUsers.topUsersReviews.find((a: any) => a.address === id)

    const { attestations } = useAttestations()
    const { getCounts, getGroups } = UseCounts()
    const { issueAttestation } = UseCreateAttestations()

    const key = `did:ethr:${ethers.getAddress(id)}`
    // @ts-ignore
    const auditScore = compute.audits[key] || '-'
    // @ts-ignore
    const reviewScore = compute.reviews[key] || '-'

    const createFollowAttestation = () => {
        issueAttestation('follow', id, ["1"])
    }

    const filteredAttestations = attestations.filter((attestation: any) => {
        // console.log({ attestation })
        if (tab === 'audits' && attestation.schemaId !== schemas.KarmaAuditAttestorSchemaId) {
            return false
        }

        if (tab === 'reviews' && attestation.schemaId !== schemas.KarmaReviewAttestorSchemaId) {
            return false
        }
        return attestation.attester.toLowerCase() === a
    })

    const auditorScore = getAuditorScore(id)

    const socials = getSocials(identity)
    const lens = socials.find((a: any) => a.dappName === 'lens')
    const farcaster = socials.find((a: any) => a.dappName === 'farcaster')



    return <><div className="container" style={{ marginTop: 30 }}>

        <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            marginBottom: 10,
            width: '100%'
        }}>

         
            <div ><img src={`/avatar${auditorScore}.png`} style={{ width: 128, height: 128, borderRadius: 136 }} />
                <div>

                    {
                        //@ts-ignore
                        pretrustAccounts[a] ?
                            <div style={{ fontSize: 12, marginTop: 10, marginLeft: 0, color: 'green', fontWeight: 'bold' }}>
                                <span style={{ color: 'green' }}>&nbsp;&#10003;&nbsp;</span>
                                {//@ts-ignore
                                    pretrustAccounts[a]
                                }
                            </div>
                            : ''
                    }</div>
            </div>
            <div style={{ width: '60%', textAlign: 'left', marginLeft: 30, marginTop: 20, fontWeight: 'bold' }}>

                <h3>
                    <Address address={a} shorten={true} shortenLength={50} isIconHidden={true} />
                </h3>
                <span style={{ fontSize: 12 }}>
                    {id}
                </span><br />
                
                <br />

                <div style={{ marginBottom: (isTopAuditor || isTopReviewer) ? 15 : 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 'bold' }}>
                        Audit Score: <b style={{ color: '#7000FF' }}>{auditScore}</b><br />
                        Review Score: <b style={{ color: '#7000FF' }}>{reviewScore}</b>
                    </span>
                </div>
                <div>

                    <div style={{ display: 'flex', color: '#7000FF', fontSize: 10, alignItems: 'center' }}>



                        {isTopAuditor ? <>
                            <img src={'/Union.svg'} />&nbsp;
                            <span style={{ color: '#00A94F' }}>
                                TOP AUDITOR
                            </span></> : null}

                        {isTopReviewer && <>&nbsp;&nbsp;
                            <img src={'/Star1.svg'} />&nbsp;
                            TOP REVIEWER</>}
                    </div>


                </div>
            </div>


            <div style={{ marginTop: 20, justifyContent: 'flex-end', display: 'flex', fontSize: 14, color: '#543A69', textAlign: 'right' }}>


                {lens ? <div style={{ marginLeft: 20, marginTop: 4, fontSize: 12, textAlign: 'center' }}>
                    <img style={{ width: 30, height: 30, margin: 'auto' }} src={'/LensAddress.svg'} />
                    {lens.profileName}
                </div> : null}
                {farcaster ? <div style={{ marginLeft: 20, marginTop: 4, fontSize: 12, textAlign: 'center' }}>
                    <img style={{ width: 30, height: 30, margin: 'auto' }} src={'/farcaster.svg'} />
                    {farcaster.profileName}
                </div> : null}

                <div style={{ marginLeft: 20, width: '60%' }}>
                 

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
                        <AvatarList tooltip={true} attestations={getGroups(id).followers} from={1} />
                    </div>
                    <div style={{ fontSize: 12 }}>
                        <b>{getCounts(id).following}</b>&nbsp;Following<br />
                        <AvatarList tooltip={true} attestations={getGroups(id).following} to={1} />
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

