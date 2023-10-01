import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, getAll, schemas } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'
import { shortenString, hexAsciiToAsciiString } from '../utils'
import ExplorerList from './explorer/ExplorerList'
import { ethers } from 'ethers'
import { useSnaps } from './hooks/UseSnaps'
import { UseCounts } from './hooks/UseCounts'
import { useAttestations } from './hooks/UseAttestations'
import { SnapScoreBadge } from './common/SnapScoreBadge'
import { UseCompute, getSnapScore } from './hooks/UseCompute'
import { liveSnapsData } from '../api/liveSnaps'

export const SnapDetailPage = (props: any) => {
    const { getCounts } = UseCounts()
    const { attestations } = useAttestations()
    const [tab, setTab] = useState('all')
    const { snaps } = useSnaps()
    const { attestations: computeAttestations } = UseCompute()

    const id = +(props.id)

    const snap: any = Object.values(snaps).find((a: any) => a.meta.id === id)

    if (!snap) {
        return null
    }


    const versionShasum = props.versionShasum || ''
    const versionsArr = Object.values(snap.versions)
    const version: any = versionShasum ? versionsArr.find((a: any) => a.shasum === versionShasum) : versionsArr[versionsArr.length - 1]

    const scoreCompute = getSnapScore(version.shasum, computeAttestations)
    const score: number = scoreCompute.review
    const auditScore: number = scoreCompute.audit

    const filteredAttestations = attestations
        .filter((a: any) => {
            if (ethers.toUtf8String(a.attestationData[0]) !== version.shasum) {
                return false
            }

            if (tab === 'all' && (a.schemaId !== schemas.KarmaAuditAttestorSchemaId
                && a.schemaId !== schemas.KarmaReviewAttestorSchemaId)) {
                return false
            }

            if ((tab === 'audits') && a.schemaId !== schemas.KarmaAuditAttestorSchemaId) {
                return false
            }

            if (tab === 'reviews' && a.schemaId !== schemas.KarmaReviewAttestorSchemaId) {
                return false
            }

            if (tab === 'votes') {
                if (a.schemaId !== schemas.KarmaReviewApprovalAttestorSchemaId
                    && a.schemaId !== schemas.KarmaAuditApprovalAttestorSchemaId) {
                    return false
                }
            }

            return true
        }
        )

    const imageIcon = liveSnapsData.find(a => a.name === snap.meta.name)
    // @ts-ignore
    const img: string = imageIcon ? imageIcon.icon : `/Snap${~~(id % 4 + 1)}.png`

    return <>
        <div className="post-full2">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div className="snap-img-placeholder-big" style={{ background: 'none' }}>
                    <img style={{ width: '100%' }} src={img} /></div>
                <div style={{ width: '53%', textAlign: 'left' }}>

                    <Link to={"/snap/" + id}>

                        <h3 style={{ color: '#543A69', lineHeight: 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <span style={{ fontSize: 36 }}>{snap.meta.name}</span>
                                &nbsp;&nbsp;
                                <SnapScoreBadge score={auditScore} /> {versionShasum}
                                {/*<img src={'/shield.svg'} style={{ width: 26, height: 26 }} />*/}
                            </div>
                            {/*&nbsp;{version.versionNumber}*/}
                            <br />

                            <span style={{ fontWeight: 400, fontSize: 14, color: 'rgba(84, 58, 105, 0.65)' }}>
                                By {snap.meta.author}</span><br />

                            <span style={{ color: '#543A69', fontSize: 25 }}>
                                {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                            </span>
                            <span style={{ color: '#F3E3FF', fontSize: 25 }}>
                                {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                            </span>

                            &nbsp;<b style={{ fontSize: 13 }}>{score === 0 ? score : score.toFixed(2)}</b>
                        </h3>
                        <br />
                        <span style={{ color: 'rgba(84, 58, 105, 0.80)' }}>{snap.meta.description}</span>
                    </Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>

                </div>
            </div>


            <div className="small-font">

                {/* 
                {versionsArr.length === 0 && <>No versions found<br /></>}
                {versionsArr.length > 0 && <>
                    Versions: <b>{versionsArr.map((v: any) => <>
                        <Link to={`/snap/${id}/${v.shasum}`} style={{ textDecoration: 'underline' }}>{v.versionNumber}</Link>&nbsp;&nbsp;
                    </>)}</b><br />
                </>}
                Audits: <b>{getCounts(version.shasum).audits}</b><br />
                Reviews: <b>{getCounts(version.shasum).reviews}</b><br />


                <div className="small-font">

                    Version:  <b>{version.versionNumber}</b><br />

                    Checksum:  <b>{shortenString(version.shasum, 20)}</b><br />

                    Signature:  <b>{shortenString('', 20)}</b><br />
                    Change Log:  <b>{shortenString(version.changeLog, 20)}</b><br />
                    <br />
                    

                    <div><Link to={`/attestation/new/${version.shasum}`}>
                        <span
                            className="strategy-btn secondary"><b>&#43;</b>&nbsp;Audit</span>&nbsp;&nbsp;
                    </Link>

                        &nbsp;&nbsp;
                        <Link to={`/review/new/${version.shasum}`}>
                            <span
                                className="strategy-btn secondary"><b>&#43;</b>&nbsp;Review</span>&nbsp;&nbsp;
                        </Link>
                    </div>


            </div>
*/}
            </div>
        </div >

        <div>

            <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                paddingBottom: 15,
                marginTop: 30,
                width: '100%',
                borderBottom: '1px solid rgba(112, 0, 255, 0.25)'
            }}>
                <div>
                    <div style={{ overflow: 'hidden' }}>
                        <span
                            className={'tab-slot '}
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                setTab('all')
                            }}>All&nbsp;({getCounts(version.shasum).audits + getCounts(version.shasum).reviews})&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;
                        <span className={(tab === 'all' ? ' primary-tab' : '')}
                            style={tab === 'all' ? { marginLeft: -65 } : {}}
                        ></span>

                        <span
                            className={'tab-slot '}
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                setTab('audits')
                            }}>Audits ({getCounts(version.shasum).audits})</span>&nbsp;&nbsp;
                        <span className={(tab === 'audits' ? ' primary-tab' : '')}></span>
                        <span
                            className={'tab-slot'}
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                setTab('reviews')
                            }}>Reviews ({getCounts(version.shasum).reviews})</span>
                        <span className={(tab === 'reviews' ? ' primary-tab' : '')}></span>


                    </div>
                </div>


                <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
                    <div><Link to={`/attestation/new/${version.shasum}`}>
                        <span
                            className="strategy-btn secondary"><b>&#43;</b>&nbsp;Audit</span>&nbsp;&nbsp;
                    </Link>

                        &nbsp;&nbsp;
                        <Link to={`/review/new/${version.shasum}`}>
                            <span
                                className="strategy-btn secondary"><b>&#43;</b>&nbsp;Review</span>&nbsp;&nbsp;
                        </Link>
                    </div>
                </div>
            </div>
        </div >
        <br />

        <div>
            <ExplorerList attestations={filteredAttestations} type='' showSearch={false} />
        </div>


    </>


}

