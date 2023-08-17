import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, createAttestation } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'


export const SnapCard = (props: any) => {
    const [votes, setVotes] = useState([])
    const id = props.id
    const e = props.snapData

    const reviewsForSnap = props.reviewsForSnap

    const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
    const account = useAccount()

    const [scheme, setScheme] = useState(null)

    const saveData = useCallback((message: any) => {
        console.log('saveData', { message })
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

            const attestation = scheme
            const signature = dataSign
            // await saveRecordToBackend(attestation, extraData, signature)
            window.alert('Saved!')
        }

        run()
    }, [dataSign])

    const reviewsTotal = e.versionList.map((v: string) => {
        const version = e.versions[v]

        const r = reviewsForSnap.filter((a: any) => v === a.scheme[2][1])
        return r.length
    }).reduce((a: any, b: any) => a + b, 0)

    console.log({ reviewsTotal })

    const score = computeSnapScore(id, reviewsForSnap)


    return <><div className="post">
        <div className="post-internal-container">

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '80%' }}>
                    <Link to={"/snap/" + id}> <h3>{e.meta.name}<br />
                        <span style={{ color: 'orange' }}>
                            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                        </span>
                        <span style={{ color: 'lightgrey' }}>
                            {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                        </span>

                        &nbsp;<span style={{ fontSize: 13 }}>{score === 0 ?
                            <span style={{ color: 'gray' }}>&nbsp;Not Audited</span> : score.toFixed(2)}</span>
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                    <img src={'/shield.svg'} style={{ width: 26, height: 26 }} />
                </div>
            </div>

            <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>

            <div className="small-font"> {e.meta.description}<br />
                <a href={e.meta[4]} target="_blank" style={{ color: '#2a2a72' }}>{e.meta[4]}</a>
            </div>
            <br />

            <div className="small-font">
                Developer: <b>{e.meta.author}</b><br />
                {e.versionList.length === 0 && <>No versions found<br /></>}
                {e.versionList.length > 0 && <>     Versions: <b>{e.versionList.length}</b><br /></>}
                Audits: <b>{reviewsTotal}</b><br />
                Reviews: <b>{reviewsTotal}</b><br />


            </div>


        </div>
        <br />
        <Link to={"/snap/" + id}>
            <span
                className="strategy-btn"
                style={{ marginRight: 20, backgroundColor: '#009ffd', color: 'white' }}
            >Show Details</span>
        </Link>
        {/*<div className="blue-btn flex-end">Show Details</div>*/}
    </div></>


}

