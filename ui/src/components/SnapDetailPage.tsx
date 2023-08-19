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

export const SnapDetailPage = (props: any) => {
    const { getCounts } = UseCounts()
    const { attestations } = useAttestations()
    const [tab, setTab] = useState('audits')
    const { snaps } = useSnaps()

    const id = +(props.id)

    const snap: any = Object.values(snaps).find((a: any) => a.meta.id === id)

    if (!snap) {
        return null
    }

    const versionShasum = props.versionShasum || ''

    const versionsArr = Object.values(snap.versions)
    const version: any = versionShasum ? versionsArr.find((a: any) => a.shasum === versionShasum) : versionsArr[versionsArr.length - 1]

    console.log({ version, snap })
    const filteredAttestations = attestations
        .filter((a: any) => {
            if (ethers.toUtf8String(a.attestationData[0]) !== version.shasum) {
                return false
            }

            if (tab === 'audits' && a.schemaId !== schemas.KarmaAuditAttestorSchemaId) {
                return false
            }

            if (tab === 'reviews' && a.schemaId !== schemas.KarmaReviewAttestorSchemaId) {
                return false
            }

            return true
        }
        )
    const score: number = 5


    return <>
        <div className="post-full">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '80%' }}>
                    <Link to={"/snap/" + id}> <h3>{snap.meta.name}<span style={{ color: 'lightgrey', fontWeight: 'normal' }}>&nbsp;|&nbsp;</span>{version.versionNumber}<br />
                        <span style={{ color: 'orange' }}>
                            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                        </span>
                        <span style={{ color: 'lightgrey' }}>
                            {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                        </span>

                        &nbsp;<b style={{ fontSize: 13 }}>{score === 0 ? score : score.toFixed(2)}</b>
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                    <img src={'/shield.svg'} style={{ width: 26, height: 26 }} />
                </div>
            </div>
            <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>

            <div className="small-font">
                {snap.meta.description}<br />

                <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
                Developer: <b>{snap.meta.author}</b><br />
                {versionsArr.length === 0 && <>No versions found<br /></>}
                {versionsArr.length > 0 && <>
                    Versions: <b>{versionsArr.map((v: any) => <>
                        <Link to={`/snap/${id}/${v.shasum}`} style={{ textDecoration: 'underline' }}>{v.versionNumber}</Link>&nbsp;&nbsp;
                    </>)}</b><br />
                </>}
                Audits: <b>{getCounts(version.shasum).audits}</b><br />
                Reviews: <b>{getCounts(version.shasum).reviews}</b><br />

                <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>

                <div className="small-font">
                    Version:  <b>{version.versionNumber}</b><br />

                    Checksum:  <b>{shortenString(version.shasum, 20)}</b><br />

                    Signature:  <b>{shortenString('', 20)}</b><br />
                    Change Log:  <b>{shortenString(version.changeLog, 20)}</b><br />
                    <br />
                    <div className="delimiter"></div><br />

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
        </div>
        <div style={{ width: '100%', textAlign: 'left', fontSize: 13, marginBottom: 15 }}>
            <br />
            <span
                className={'strategy-btn ' + (tab === 'audits' ? ' primary' : '')}
                style={{ marginRight: 10 }}
                onClick={() => {
                    setTab('audits')
                }}>Audits ({getCounts(version.shasum).audits})</span>&nbsp;&nbsp;
            <span
                className={'strategy-btn ' + (tab === 'reviews' ? ' primary' : '')}
                style={{ marginRight: 10 }}
                onClick={() => {
                    setTab('reviews')
                }}>Reviews ({getCounts(version.shasum).reviews})</span>&nbsp;&nbsp;
        </div>
        <div>
            <ExplorerList attestations={filteredAttestations} type='' showSearch={false} />
        </div>


    </>


}

