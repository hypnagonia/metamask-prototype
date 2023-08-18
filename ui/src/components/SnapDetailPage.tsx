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

export const SnapDetailPage = (props: any) => {
    const {getCounts} = UseCounts()
    const [attestations, setAttestations] = useState([])
    const [tab, setTab] = useState('audits')
    const { snaps } = useSnaps()

    useEffect(() => {
        const run = async () => {
            const d = await getAll()
            setAttestations(d)
        }

        run()
    }, [])



    const id = +(props.id)

    const snap: any = Object.values(snaps).find((a: any) => a.meta.id === id)

    if (!snap) {
        return null
    }

    const versionShasum = props.versionShasum || ''

    const versionsArr = Object.values(snap.versions)
    const version: any = versionShasum ? versionsArr.find((a: any) => a.shasum === versionShasum) : versionsArr[versionsArr.length - 1]
    const versionsAll = versionsArr.map((a: any) => a.versionNumber)

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
                    <Link to={"/snap/" + id}> <h3>{snap.meta.name}<br />
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
                {versionsAll.length === 0 && <>No versions found<br /></>}
                {versionsAll.length > 0 && <>
                    Versions: <b>{versionsAll.join(', ')}</b><br />
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
                            className="strategy-btn">Audit</span>&nbsp;&nbsp;
                    </Link>

                        &nbsp;&nbsp;
                        <Link to={`/review/new/${version.shasum}`}>
                            <span
                                className="strategy-btn">Review</span>&nbsp;&nbsp;
                        </Link>
                    </div>


                </div>

            </div>
        </div>
        <div style={{ width: '100%', textAlign: 'left', fontSize: 13, marginBottom: 15 }}>
            <br />
            <span
                className="strategy-btn"
                style={{ marginRight: 10, backgroundColor: tab === 'audits' ? 'orange' : 'white' }}
                onClick={() => {
                    setTab('audits')
                }}>Audits</span>&nbsp;&nbsp;
            <span
                className="strategy-btn"
                style={{ marginRight: 10, backgroundColor: tab === 'reviews' ? 'orange' : 'white' }}
                onClick={() => {
                    setTab('reviews')
                }}>Reviews</span>&nbsp;&nbsp;
        </div>
        <div>
            <ExplorerList attestations={filteredAttestations} type='' showSearch={false} />
        </div>


    </>


}

