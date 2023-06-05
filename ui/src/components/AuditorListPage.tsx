import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, voteCreate as saveVoteRecordToBackend, voteGetAll } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../api/mockCompute'
import { Web3Button } from '@web3modal/react'

import { shortenString } from '../utils'


export const AuditorListPage = (props: any) => {
    const [votes, setVotes] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await voteGetAll()
            setVotes(d)
        }

        run()
    }, [])

    const reviews = props.reviews

    const auditors = new Set()
    reviews.forEach((a: any) => {
        auditors.add(a.address)
    })
    const auditorList = Array.from(auditors)


    return <>{
        auditorList.map((a: any) => {

            const id = a
            const auditorScore = getAuditorScore(id)

            const reviewsCount = reviews.filter((e: any) => id === e.address).length

            const thumbsUpTotal = votes.filter((e: any) => e.scheme[0][1] === 'upvote' && e.scheme[1][1] === id).length
            const thumbsDownTotal = votes.filter((e: any) => e.scheme[0][1] === 'downvote' && e.scheme[1][1] === id).length

        

            return <><div className="container" style={{ marginTop: 30 }}>

                <div className="post-full small-font">
                    <h3>{id}</h3><br />
                    <div>
                        Address: <b style={{ color: '#2a2a72' }}>{id}</b><br />
                        Auditor Score: <b>{auditorScore}</b><br />
                        Reviews: <b>{reviewsCount}</b><br />
                        Thumbsup: <b>{thumbsUpTotal}</b><br />
                        Thumbsdown: <b>{thumbsDownTotal}</b><br />
                    </div>


                </div>
            </div></>


        })}</>
}

