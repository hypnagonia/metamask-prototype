import { useEffect, useState, useCallback } from 'react'
import ExplorerList from './ExplorerList'
import { getAll, getAllByType } from '../../api/api'
import { getSnaps } from '../../api/registry'
import { useAttestations } from '../hooks/UseAttestations'
import { useSnaps } from '../hooks/UseSnaps'

export default function ExplorerPage(props: any) {
    const [gridView, setGridView] = useState('cards')
    const { attestations } = useAttestations()
    const { snaps } = useSnaps()

    return (<>
        <div className="container" style={{ marginTop: 30 }}>
            <div>
                {/*<h2>Explorer</h2>*/}
                <div>
					<div style={{ height: 130, marginTop: -20 }}>
						<div className="color2" style={{
							fontSize: 26, fontWeight: 'bold', cursor: 'pointer',
							lineHeight: 1
						}}>
							<br />
							<span style={{ fontSize: 36 }}>Attestation Explorer</span>
						</div>
					</div>
				</div>
            </div>
           {/*  <div style={{ width: '100%', textAlign: 'left' }}>
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
            </div>*/}
            <br />
            <div>
                <ExplorerList attestations={attestations} type={gridView} snaps={snaps} />
            </div>
            <br />
        </div>
        </>)
}


