import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, voteCreate as saveVoteRecordToBackend, voteGetAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

import { Web3Button } from '@web3modal/react'
import { computeSnapScore } from '../api/mockCompute'
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

export const SnapDetailPage = (props: any) => {
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
    const score = computeSnapScore(id, reviewsForSnap)

    return <><div>
        <div className="post-full">
            <Link to={"/snap/" + id}> <h3>{e.meta[0]}<br />
                <span style={{ color: 'orange' }}>
                    {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                </span>
                <span style={{ color: 'lightgrey' }}>
                    {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                </span>

                &nbsp;<b style={{ fontSize: 13 }}>{score === 0 ? score : score.toFixed(2)}</b>
            </h3></Link>

            <br />
            <div className="small-font">
                {e.meta[1]}<br />
                <a href={e.meta[4]} target="_blank">{e.meta[4]}</a><br />

            </div>
        </div>

        {e.versionList.length === 0 && <>No versions found</>}

        {e.versionList.map((v: string) => {
            const version = e.versions[v]

            const r = reviewsForSnap.filter((a: any) => v === a.scheme[2][1])

            return <div className="post-full"><div className="small-font">
                <h3>Version: <b>{v}</b></h3> <br />

                Origin:  <b>{version[0]}</b><br />

                Checksum:  <b>{shortenString(version[1], 20)}</b><br />

                Signature:  <b>{shortenString(version[2], 20)}</b><br />
                Change Log:  <b>{version[3]}</b><br />
                <br />
                <div className="delimiter"></div><br />
                {r && r.length > 0 && <div className="review-container">
                    <h3>Audit Scores</h3><br />
                    {r.map((e: any) => {

                        const upvotes = votes.filter((a: any) => e.signature === a.scheme[2][1] && a.scheme[0][1] === 'upvote').length
                        const downvotes = votes.filter((a: any) => e.signature === a.scheme[2][1] && a.scheme[0][1] === 'downvote').length

                        const upvoteMessage = [
                            ['vote', 'upvote'],
                            ['address', e.address],
                            ['signature', e.signature]
                        ]

                        const downvoteMessage = [
                            ['vote', 'downvote'],
                            ['address', e.address],
                            ['signature', e.signature]
                        ]

                        return <>

                            <div>
                                Auditor: <Link to={`/auditor/${e.address}`}><b style={{ color: '#2a2a72' }}>{e.address}</b></Link>
                            </div>
                            <div>
                                Signature: <b>{shortenString(e.signature)}</b>
                            </div>
                            <div>
                                Score: <b>{e.scheme[0][1]}</b>
                            </div>
                            <br />
                            <div style={{ marginBottom: 20 }}>
                                <span
                                    onClick={() => {
                                        saveData(upvoteMessage as any)
                                    }}
                                    className="strategy-btn">&#128077; {upvotes}</span>&nbsp;
                                <span
                                    onClick={() => {
                                        saveData(downvoteMessage as any)
                                    }}
                                    className="strategy-btn" style={{ marginLeft: 10 }}>
                                    &#128078; {downvotes}</span>

                            </div><br />
                        </>
                    })}
                </div>}

                {r && r.length > 0 && <><div className="delimiter"></div><br /></>}

                <div>


                    <h3>Submit Score</h3><br />
                    {[1, 2, 3, 4, 5].map(score => {
                        const message = createScheme({
                            score,
                            version: v,
                            versionOrigin: version[0],
                            checksum: version[1],
                            versionSignature: version[1],
                            snapId: id
                        }) as any
                        return <span
                            className="strategy-btn"
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                saveData(message as any)
                            }}>{score}&nbsp;</span>
                    })}
                </div>
            </div>
            </div>
        })}


    </div></>


}

