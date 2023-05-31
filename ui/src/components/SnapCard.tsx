import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, voteCreate as saveVoteRecordToBackend, voteGetAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

import { Web3Button } from '@web3modal/react'

import {shortenString} from '../utils'

const createScheme = (o: any) => {
    // order
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

    return <><div className="post">
        <div>
            <Link to={"/snap/" + id}> <h2>#{id} {e.meta[0]}</h2><br /></Link>
            {e.meta[1]}<br />
            <a href={e.meta[4]} target="_blank">{e.meta[4]}</a>
        </div>
        <br />

        {e.versionList.length === 0 && <>No versions found</>}

        {e.versionList.map((v: string) => {
            const version = e.versions[v]

            const r = reviewsForSnap.filter((a: any) => v === a.scheme[2][1])

            return <div style={{ marginTop: 10 }}>
                Version: <b>{v}</b><br />
                Origin: {version[0]}<br />
                Checksum: {shortenString(version[1], 20)}<br />
                Signature: {shortenString(version[2], 20)}<br />
                Change Log: {version[3]}<br />

                {r && r.length > 0 && <div style={{ backgroundColor: 'lightblue', padding: 15, margin: 15, borderRadius: 10 }}>
                    <h3>Reviews</h3><br/>
                    {r.map((e: any) => {

                        const upvotes = votes.filter((a: any)=> e.signature === a.scheme[2][1] && a.scheme[0][1] === 'upvote').length
                        const downvotes = votes.filter((a: any)=> e.signature === a.scheme[2][1] && a.scheme[0][1] === 'downvote').length
                        console.log({votes})
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
                                Score: {e.scheme[0][1]}
                            </div>
                            <div>
                                Address: {e.address}
                            </div>
                            <div>
                                Signature: {shortenString(e.signature)}
                            </div>
                            
                            <div style={{ color: 'black', margin: 20 }}>
                                <span
                                    onClick={() => {
                                        saveData(upvoteMessage as any)
                                    }}
                                    className="btn">Upvote ({upvotes})</span>&nbsp;
                                <span
                                    onClick={() => {
                                        saveData(downvoteMessage as any)
                                    }}
                                    className="btn">
                                    Downvote  ({downvotes})</span>
                            </div>
                        </>
                    })}
                </div>}

                <div>
                    <br />
                    <b>Rate&nbsp;</b>
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
                            className="btn"
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                saveData(message as any)
                            }}>{score}&nbsp;</span>
                    })}
                </div>
            </div>
        })}



        <div style={{ borderBottom: '1px solid gray', marginBottom: 15, marginTop: 15 }}></div>
    </div></>


}

