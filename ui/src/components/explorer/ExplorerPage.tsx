import { useEffect, useState, useCallback } from 'react'
import ExplorerList from './ExplorerList'
import {getAll, getAllByType} from '../../api/api'

export default function ExplorerPage(props: any) {
    const [attestations, setAttestations] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await getAll()
            setAttestations(d)
        }

        run()
    }, [])

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <div>
                <h2>Explorer</h2>
            </div>
            <br/>
            <div>
                <ExplorerList attestations={attestations} type='table'/>
            </div>
            <br/>
        </div>
    )
}


