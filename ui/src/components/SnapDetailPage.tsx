import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, getAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'
import { shortenString, hexAsciiToAsciiString } from '../utils'
import ExplorerList from './explorer/ExplorerList'
import { ethers } from 'ethers'

const createScheme = (o: any) => {
    return o
}

export const SnapDetailPage = (props: any) => {
    const [attestations, setAttestations] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await getAll()
            setAttestations(d)
        }

        run()
    }, [])


    const [votes, setVotes] = useState([])

    useEffect(() => {
        const run = async () => {
            // const d = await voteGetAll()
            // setVotes(d)
        }

        run()
    }, [])


    const id = props.id
    const e = props.snapData

    const reviewsForSnap = props.reviewsForSnap

    const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
    const account = useAccount()

    const [scheme, setScheme] = useState(null)
    const [isApproveformVisible, setIsApproveformVisible] = useState({} as any)
    const [isReviewformVisible, setIsReviewformVisible] = useState({} as any)

    const saveData = useCallback((message: any) => {
        setScheme(message as any)
        signMessage({ message: JSON.stringify(message) })
    }, [])

    useEffect(() => {
        const run = async () => {
            if (!dataSign || !account.address) {
                return
            }

            const r = {
                signature: dataSign,
                address: account.address,
                scheme: scheme
            }


            // await saveRecordToBackend(r as any)

            window.alert('Saved!')
        }

        run()
    }, [dataSign])
    const score = computeSnapScore(id, reviewsForSnap)



    return <>
        <div className="post-full">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '80%' }}>
                    <Link to={"/snap/" + id}> <h3>{e.meta.name}<br />
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
                {e.meta.description}<br />
                <a href={e.meta[4]} target="_blank">{e.meta[4]}</a><br />
                <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
                Developer: <b>{e.meta.author}</b><br />
                {e.versionList.length === 0 && <>No versions found<br /></>}
                {e.versionList.length > 0 && <>     Versions: <b>{e.versionList.length}</b><br /></>}
                Audits: <b>{0}</b><br />
                Reviews: <b>{0}</b><br />

            </div>
        </div>
        <div style={{ width: '100%', textAlign: 'left', fontSize: 13, marginBottom: 15, fontWeight: 'bold' }}>

            <span style={{ textDecoration: 'underline' }}>Versions</span>&nbsp;&nbsp;
            <span style={{ textDecoration: 'underline' }}>Reviews</span>
        </div>

        {e.versionList.length === 0 && <>No versions found</>}

        {e.versionList.map((v: string) => {
            const version = e.versions[v]
            const r = [] as any

            const versionAttestations = attestations
                .filter((a: any) => a.attestationData[0] ===
                    ethers.hexlify(ethers.toUtf8Bytes(version.shasum)))
                .filter((a: any) => a.schemaId === process.env.REACT_APP_ATTESTATION_ATTESTOR_SCHEMA)

            return <>
                <div className="post-full"><div className="small-font">
                    <h3>Version: <b>{v}</b></h3> <br />

                    Origin:  <b>{version.versionNumber}</b><br />

                    Checksum:  <b>{shortenString(version.shasum, 20)}</b><br />

                    Signature:  <b>{shortenString('', 20)}</b><br />
                    Change Log:  <b>{shortenString(version.changeLog, 20)}</b><br />
                    <br />
                    <div className="delimiter"></div><br />

                    <div>
                        <span
                            onClick={() => setIsApproveformVisible({ ...isApproveformVisible, [version]: !isApproveformVisible[version] })}
                            className="strategy-btn">Approve</span>&nbsp;&nbsp;
                       {/* <span
                            onClick={() => setIsReviewformVisible({ ...isReviewformVisible, [version]: !isReviewformVisible[version] })}
                            className="strategy-btn" style={{ marginTop: 10 }}>Leave a Review along with score of 1-5</span><br />
        */}
                    </div>
                </div>

                </div>

                <ExplorerList attestations={versionAttestations} />

            </>
        })}


    </>


}

