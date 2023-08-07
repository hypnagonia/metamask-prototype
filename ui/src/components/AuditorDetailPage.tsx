import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend} from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../api/mockCompute'

import { Audits } from './Audits'
import { shortenString } from '../utils'


export const AuditorDetailPage = (props: any) => {
    const [votes, setVotes] = useState([])

    useEffect(() => {
        const run = async () => {
        }

        run()
    }, [])


    const { id } = useParams() as any
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

                    Audits Issued: <b>{reviewsCount}</b><br />
                    Upvotes: <b>{thumbsUpTotal}</b><br />
                    Downvotes: <b>{thumbsDownTotal}</b><br />
                    <br />
                    <div className="strategy-btn">Follow</div>
                </div>

            </div>

        </div>

        <Audits auditorAddress={id} reviews={reviews} />
    </div></>


}

