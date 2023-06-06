import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, voteCreate as saveVoteRecordToBackend, voteGetAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'

import { Web3Button } from '@web3modal/react'

import { shortenString } from '../utils'

const createScheme = (o: any) => {
    const m = new Map()
    m.set('score', o.score)
    m.set('snapId', o.snapId)
    m.set('version', o.version)
    m.set('versionOrigin', o.versionOrigin)
    m.set('checksum', o.checksum)
    m.set('versionSignature', o.versionSignature)
    m.set('timestamp', Date.now())

    const jsonText = Array.from(m.entries())
    return jsonText
}

export const SnapCard = (props: any) => {
    const [votes, setVotes] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await voteGetAll()
            setVotes(d)
        }

        run()
    }, [])


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

            if (scheme![0][0] === 'vote') {
                await saveVoteRecordToBackend(r as any)
            } else {
                await saveRecordToBackend(r as any)
            }
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
                    <Link to={"/snap/" + id}> <h3>{e.meta[0]}<br />
                        <span style={{ color: 'orange' }}>
                            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                        </span>
                        <span style={{ color: 'lightgrey' }}>
                            {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                        </span>

                        &nbsp;<span style={{ fontSize: 13 }}>{score === 0 ?
                            <span style={{ color: 'gray' }}>Not Audited</span> : score.toFixed(2)}</span>
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                    <img src={'/shield.svg'} style={{ width: 26, height: 26 }} />
                </div>
            </div>

            <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>

            <div className="small-font"> {e.meta[1]}<br />
                <a href={e.meta[4]} target="_blank" style={{ color: '#2a2a72' }}>{e.meta[4]}</a>
            </div>


            <br />

            <div className="small-font">
                Developer: <b>{e.meta[2]}</b><br />
                {e.versionList.length === 0 && <>No versions found<br /></>}
                {e.versionList.length > 0 && <>     Versions: <b>{e.versionList.join(', ')}</b><br /></>}
                Audits: <b>{reviewsTotal}</b><br />


            </div>


        </div>
        <br />
        {/*<div className="blue-btn flex-end">Show Details</div>*/}
    </div></>


}

