import { useEffect, useState, useCallback } from 'react'
import ExplorerList from './ExplorerList'
import { getAll, getAllByType, schemas } from '../../api/api'
import { getSnaps } from '../../api/registry'
import { useAttestations } from '../hooks/UseAttestations'
import { useSnaps } from '../hooks/UseSnaps'
import { Select } from '../common/Select'
import { Search } from '../Search'

export default function ExplorerPage(props: any) {
    const [gridView, setGridView] = useState('cards')
    const [filterBy, setFilterBy] = useState('All')
    const [search, setSearch] = useState('')

    const { attestations } = useAttestations()
    const { snaps } = useSnaps()

    const onSelectSortBy = useCallback((option: any) => {
        setFilterBy(option)
    }, [filterBy])

    const filteredAttestations = attestations.filter((a: any) => {
        if (filterBy === 'All') {
            return true
        }
        if (filterBy === 'Audits') {
            return a.schemaId === schemas.KarmaAuditAttestorSchemaId
        }

        if (filterBy === 'Reviews') {
            return a.schemaId === schemas.KarmaReviewAttestorSchemaId
        }


        if (filterBy === 'Audits Votes') {
            return a.schemaId === schemas.KarmaAuditApprovalAttestorSchemaId
        }


        if (filterBy === 'Reviews Votes') {
            return a.schemaId === schemas.KarmaReviewApprovalAttestorSchemaId
        }

        if (filterBy === 'Follow') {
            return a.schemaId === schemas.KarmaFollowersAttestorSchemaId
        }

        return true
    }).filter((a: any) => {
        if (!search) {
            return true
        }

        return a.attester.toLowerCase().indexOf(search) !== -1 || 
        (a.attestationDataHex[0] || '').toLowerCase().indexOf(search) !== -1
    })

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
            <div style={{ marginBottom: 30, marginTop: 15, width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div style={{
                    alignItems: 'center',
                    width: '200px',
                    display: 'flex'
                }}>
                    <Search onSearch={setSearch} />
                </div>
                <div style={{
                    justifyContent: 'flex-end', alignItems: 'center',
                    width: '200px',
                    display: 'flex'
                }}>
                    <Select currentOption={filterBy} options={['All', 'Audits', 'Reviews', 'Review Upvotes', 'Audit Upvotes', 'Follows']}
                        onSelect={(o: any) => { onSelectSortBy(o) }} />
                </div>
            </div>
            <br />
            <div>
                <ExplorerList attestations={filteredAttestations} type={gridView} snaps={snaps} />
            </div>
            <br />
        </div>
    </>)
}


