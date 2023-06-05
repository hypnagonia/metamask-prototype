import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, voteCreate as saveVoteRecordToBackend, voteGetAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../api/mockCompute'
import { Web3Button } from '@web3modal/react'

import { shortenString } from '../utils'
import { getSnaps } from '../api/registry'

export const Audits = (props: any) => {
    const [votes, setVotes] = useState([])
    const [snaps, setSnaps] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await voteGetAll()
            const snaps = await getSnaps()
            setSnaps(snaps)
            setVotes(d)
        }

        run()
    }, [])




    const auditorAddress = props.auditorAddress
    const reviews = props.reviews
    const r = reviews.filter((a: any) => a.address === auditorAddress)

    if (!Object.keys(snaps).length) {
        return null
    }

    return <><div className="post-full small-font review-container">
        <h3>Audits</h3><br />
        {r.map((e: any) => {

            const upvotes = votes.filter((a: any) => e.signature === a.scheme[2][1] && a.scheme[0][1] === 'upvote').length
            const downvotes = votes.filter((a: any) => e.signature === a.scheme[2][1] && a.scheme[0][1] === 'downvote').length
            return <>
                <div>
                    Score: <b>{e.scheme[0][1]}</b>
                </div>
                <div>
                    Snap: <Link to={`/snap/${e.scheme[1][1]}`}>
                        <b>{
                            // @ts-ignore
                            snaps[e.scheme[1][1]].meta[0]
                        }</b></Link>
                </div>
                <div>
                    Version: <b>{e.scheme[2][1]}</b>
                </div>
                <div>
                    Checksum: <b>{shortenString(e.scheme[4][1])}</b>
                </div>
                <div>
                    Signature: <b>{shortenString(e.signature)}</b>
                </div>
                <br />
                <div style={{ marginBottom: 20 }}>
                    <span
                        className="strategy-btn">&#128077; {upvotes}</span>&nbsp;
                    <span

                        className="strategy-btn" style={{ marginLeft: 10 }}>
                        &#128078; {downvotes}</span>

                </div><br />
            </>
        })}
    </div><br /></>
}

