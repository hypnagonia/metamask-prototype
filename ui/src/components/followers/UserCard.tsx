import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { getAuditorScore } from '../../api/mockCompute'

import { shortenString } from '../../utils'
import { UseCounts } from '../hooks/UseCounts'

export const UserCard = (props: any) => {
    const address = props.address.toLowerCase()
    const reviews = [] as any // props.reviews
    const auditorScore = getAuditorScore(address)
    const { getCounts } = UseCounts()

    const reviewsCount = reviews.filter((e: any) => address === e.address).length

    const thumbsUpTotal = 0
    const thumbsDownTotal = 0

    return <><div className="container" style={{ marginTop: 30 }}>

        <div className="post-full small-font" >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h3>{address}</h3>

                <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15 }}>
                    <span> Score:&nbsp;</span>
                    <span style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', fontSize: 15, color: '#2a2a72' }}>
                        {auditorScore}
                    </span>
                </div>
            </div><br />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div ><img src={`/avatar${(auditorScore)}.png`} /></div>
                <div style={{ marginLeft: 20, width: '70%' }}>
                    {/*Address: <b style={{ color: '#2a2a72' }}>{id}</b><br />*/}

                    Audits: <b>{getCounts(address).audits}</b><br />
                    Reviews: <b>{getCounts(address).reviews}</b><br />
                    Upvotes: <b>{getCounts(address).auditApprovals + getCounts(address).reviewApprovals}</b><br />
                    Downvotes: <b>{getCounts(address).auditDisapprovals + getCounts(address).reviewDisapprovals}</b><br />
                    <br />
                    <div className="strategy-btn">Follow</div>
                </div>

            </div>

        </div>
    </div></>


}

