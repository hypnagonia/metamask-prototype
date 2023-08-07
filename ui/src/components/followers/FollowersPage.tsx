import { useEffect, useState, useCallback } from 'react'
import FollowersNew from './FollowersNew'
import FollowersList from './FollowersList'
import {getAll, getAllByType} from '../../api/api'

export default function FollowersPage(props: any) {
    const [followers, setFollowers] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await getAllByType('follow')
            setFollowers(d)
        }

        run()
    }, [])

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <div>
                <h2>Followers</h2>
            </div>
            <div>
                <FollowersNew />
            </div>
            <div>
                <FollowersList followers={followers}/>
            </div>
            <br/>
        </div>
    )
}


