import { useEffect, useState, useCallback } from 'react'
import ExplorerList from './ExplorerList'
import { getAll, getAllByType } from '../../api/api'
import { getSnaps } from '../../api/registry'

export default function ExplorerPage(props: any) {
    const [attestations, setAttestations] = useState([])
    const [gridView, setGridView] = useState('table')
    const [snaps, setSnaps] = useState([])

    useEffect(() => {
        const run = async () => {
            const d = await getAll()
            setAttestations(d)
            const snaps = await getSnaps()
            setSnaps(snaps)
        }

        run()
    }, [])


    return (
        <div className="container" style={{ marginTop: 30 }}>
            <div>
                <h2>Explorer</h2>
            </div>
            <div style={{ width: '100%', textAlign: 'left' }}>
                <span
                    className={'strategy-btn ' + (gridView === 'table' ? ' primary' : '')}

                    onClick={() => {
                        setGridView('table')
                    }}>Table</span>
                &nbsp;&nbsp;
                <span
                    className={'strategy-btn ' + (gridView !== 'table' ? ' primary' : '')}
                    onClick={() => {
                        setGridView('cards')
                    }}>Cards</span>
            </div>
            <br />
            <div>
                <ExplorerList attestations={attestations} type={gridView} snaps={snaps} />
            </div>
            <br />
        </div>
    )
}


