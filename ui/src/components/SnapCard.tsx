import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, createAttestation } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'
import { UseCounts } from './hooks/UseCounts'

export const SnapCard = (props: any) => {
    const id = props.id
    const e = props.snapData
    const {getCounts} = UseCounts()
    
    const score: number = 5


    return <><div className="post">
        <div className="post-internal-container">

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '80%' }}>
                    <Link to={"/snap/" + id}> <h3>{e.meta.name}<br />
                        <span style={{ color: 'orange' }}>
                            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                        </span>
                        <span style={{ color: 'lightgrey' }}>
                            {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                        </span>

                        &nbsp;<span style={{ fontSize: 13 }}>{score === 0 ?
                            <span style={{ color: 'gray' }}>&nbsp;Not Audited</span> : score.toFixed(2)}</span>
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                    <img src={'/shield.svg'} style={{ width: 26, height: 26 }} />
                </div>
            </div>

            <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>

            <div className="small-font" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}> 
            {e.meta.description}<br />

            </div>
            <br />

            <div className="small-font">
                Developer: <b>{e.meta.author}</b><br />
                {e.versionList.length === 0 && <>No versions found<br /></>}
                {e.versionList.length > 0 && <>     Versions: <b>{e.versionList.length}</b><br /></>}
                Audits: <b>{getCounts(id).audits}</b><br />
                Reviews: <b>{getCounts(id).reviews}</b><br />


            </div>


        </div>
        <br />

        <div className="delimiter" style={{ marginTop: 15, marginBottom: 15 }}></div>
        <div>
            <Link to={"/snap/" + id}>
                <span
                    className="strategy-btn"
                    style={{ marginRight: 20, backgroundColor: '#009ffd', color: 'white' }}
                >More</span>
            </Link>
        </div>
    </div></>


}

