import { useEffect, useState, useCallback } from 'react'
import ExplorerList from '../explorer/ExplorerList'
import {getAll, getAllByType} from '../../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'

export default function AuditDetailsPage(props: any) {
    const [attestations, setAttestations] = useState([])
    const [reviews, setReviews] = useState([])
    const { id } = useParams() as any

    useEffect(() => {
        const run = async () => {
            const d = await getAll()

            const attestationsMain = d.filter((a:any) => id.toLowerCase() === a.attestationId.toLowerCase())
            const attestationReviews = d.filter((a:any) => id.toLowerCase() === a.attestationId.toLowerCase())
            setAttestations(attestationsMain)
            setReviews(attestationReviews)
        }

        run()
    }, [])

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <div>
                <h2>Audit</h2>
            </div>
            <br/>
            <div>
                <ExplorerList attestations={attestations} showSearch={false} />
            </div>
            
            <div>
                <h3>Reviews</h3>
            </div>
            <br/>
            <div>
                <ExplorerList attestations={attestations } showSearch={false} />
            </div>
        </div>
    )
}


