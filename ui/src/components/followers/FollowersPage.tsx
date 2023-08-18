import { useEffect, useState, useCallback } from 'react'
import FollowersNew from './FollowersNew'
import FollowersList from './FollowersList'
import { getAll, getAllByType } from '../../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { UserCard } from './UserCard'

export default function FollowersPage(props: any) {
    const [followers, setFollowers] = useState([])
    const { attestor = '' } = useParams() as any
    
    useEffect(() => {
        const run = async () => {
            const d = await getAllByType('follow')
            const filtered = d.filter((r: any) => r.attester.toLowerCase() === attestor.toLowerCase())
            setFollowers(attestor ? filtered : d)
        }

        run()
    }, [attestor])

    return (
        <div className="container" style={{ marginTop: 30 }}>
            {!attestor && <> <div>
                <h2>Followers</h2>
            </div>
                <div>
                    <FollowersNew />
                </div>
            </>}
            {attestor && <> <div>
                <UserCard address={attestor} /></div>
            </>}
            <div>
                <FollowersList followers={followers} />
            </div>
            <br />
        </div>
    )
}


