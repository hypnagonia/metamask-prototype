import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, getAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../api/mockCompute'
import ExplorerList from './explorer/ExplorerList'

import { Audits } from './Audits'
import { shortenString } from '../utils'


export const AuditorDetailPage = (props: any) => {
    const [votes, setVotes] = useState([])
    const { id } = useParams() as any
    const [attestations, setAttestations] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await getAll()
            console.log({d})
            const filtered = d.filter((a: any) => a.attester.toLowerCase() === id.toLowerCase())
            setAttestations(filtered)
        }

        run()
    }, [id])


    const reviews = props.reviews
    const auditorScore = getAuditorScore(id)

    const reviewsCount = reviews.filter((e: any) => id === e.address).length

    const thumbsUpTotal = votes.filter((e: any) => e.scheme[0][1] === 'upvote' && e.scheme[1][1] === id).length
    const thumbsDownTotal = votes.filter((e: any) => e.scheme[0][1] === 'downvote' && e.scheme[1][1] === id).length

    const { data: dataSign, error, isLoading, signMessage, variables } = useSignMessage()
    const account = useAccount()


    return <><div className="container" style={{ marginTop: 30 }}>

        <div className="post-full small-font" >

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h3>{id}</h3>

                <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15 }}>
                    <span> Score:&nbsp;</span>
                    <span style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15, color: '#2a2a72' }}>
                        {auditorScore}
                    </span>
                </div>
            </div><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div ><img src={`/avatar${auditorScore}.png`} /></div>
                <div style={{ marginLeft: 20, width: '70%' }}>
                    {/*Address: <b style={{ color: '#2a2a72' }}>{id}</b><br />*/}

                    Audits: <b>{reviewsCount}</b><br />
                    Reviews: <b>{reviewsCount}</b><br />
                    Upvotes: <b>{thumbsUpTotal}</b><br />
                    Downvotes: <b>{thumbsDownTotal}</b><br />
                    <br />
                    <div className="strategy-btn">Follow</div>
                </div>

            </div>

        </div>
    </div>
        <div className="container" >
            <ExplorerList attestations={attestations} />
        </div>
    </>


}

