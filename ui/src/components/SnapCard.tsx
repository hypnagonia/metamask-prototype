import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, createAttestation, schemas } from '../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../api/mockCompute'
import { UseCounts } from './hooks/UseCounts'
import { useAttestations } from './hooks/UseAttestations'
import { ethers } from 'ethers'
import { AvatarList } from './common/AvatarList'
import { SnapScoreBadge } from './common/SnapScoreBadge'
import { liveSnapsData } from '../api/liveSnaps'

import { UseCompute, getSnapScore } from './hooks/UseCompute'

export const SnapCard = (props: any) => {
    const id = props.id
    const e = props.snapData
    const { getCounts } = UseCounts()
    const { attestations } = useAttestations()
    const { attestations: computeAttestations } = UseCompute()

    const latestVersion = e.versionList[e.versionList.length - 1]
    const scoreCompute = getSnapScore(latestVersion, computeAttestations)

    const score: number = scoreCompute.review
    const auditScore: number = scoreCompute.audit

    const devIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none">
      <path d="M5.5 3.20999L10 5.80999L14.5 3.20999M5.5 18.79V13.6L1 11M19 11L14.5 13.6V18.79M1.27 5.95999L10 11.01L18.73 5.95999M10 21.08V11M19 15V6.99999C18.9996 6.64927 18.9071 6.3048 18.7315 6.00116C18.556 5.69751 18.3037 5.44536 18 5.26999L11 1.26999C10.696 1.09446 10.3511 1.00204 10 1.00204C9.64893 1.00204 9.30404 1.09446 9 1.26999L2 5.26999C1.69626 5.44536 1.44398 5.69751 1.26846 6.00116C1.09294 6.3048 1.00036 6.64927 1 6.99999V15C1.00036 15.3507 1.09294 15.6952 1.26846 15.9988C1.44398 16.3025 1.69626 16.5546 2 16.73L9 20.73C9.30404 20.9055 9.64893 20.9979 10 20.9979C10.3511 20.9979 10.696 20.9055 11 20.73L18 16.73C18.3037 16.5546 18.556 16.3025 18.7315 15.9988C18.9071 15.6952 18.9996 15.3507 19 15Z" stroke="#543A69" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
    const audits = attestations
        .filter((a: any) => {
            if (!e.versionList.includes(ethers.toUtf8String(a.attestationData[0]))) {
                return false
            }

            if (a.schemaId !== schemas.KarmaAuditAttestorSchemaId) {
                return false
            }

            return true
        }
        )

    const reviews = attestations
        .filter((a: any) => {
            if (!e.versionList.includes(ethers.toUtf8String(a.attestationData[0]))) {
                return false
            }

            if (a.schemaId !== schemas.KarmaReviewAttestorSchemaId) {
                return false
            }

            return true
        }
        )

    const imageIcon = liveSnapsData.find(a => a.name === e.meta.name)  
    // @ts-ignore  
    const img: string = imageIcon ? imageIcon.icon : `/Snap${~~(id % 4+ 1)}.png`
    
    return <><div className="post">
        <div className="post-internal-container">

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div className="snap-img-placeholder"><img src={img}/></div>
                <div style={{ width: '50%' }}>

                    <Link to={e.versionList.length ? "/snap/" + id : '/'}> <h3 style={{ fontSize: 16, color: '#543A69' }}>{e.meta.name}<br />
                        <span style={{ color: '#543A69' }}>
                            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

                        </span>
                        <span style={{ color: '#F3E3FF' }}>
                            {[...Array(5 - ~~score)].map((a: any) => <>&#11089;</>)}

                        </span>

                        &nbsp;<span style={{ fontSize: 13 }}>{score === 0 ?
                            <span style={{ color: 'gray' }}>&nbsp;Not Reviewed</span> : score.toFixed(2)}</span>
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
                    <SnapScoreBadge score={auditScore} />
                </div>
            </div>

            <div className="small-font" style={{
                marginTop: 10, overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', fontSize: 16, color: 'rgba(84, 58, 105, 0.80)'
            }}>
                {e.meta.description}<br />

            </div>
            <br />
            <div style={{
                color: 'rgba(84, 58, 105, 0.65)',
                fontSize: 14,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '70%'
            }}>
                <div>
                    Developer<br />
                    <div style={{
                        display: 'flex', flexDirection: 'row',
                    }}>
                        <div dangerouslySetInnerHTML={{ __html: devIcon }} />&nbsp;&nbsp;
                        {e.meta.author}

                    </div>


                </div>
                <div>Audits
                    <br />
                    <AvatarList attestations={audits} />
                </div>
                <div>Reviews<br />
                    <AvatarList attestations={reviews} />
                </div>
            </div>
            {/*<div className="small-font">
                Developer: <b>{e.meta.author}</b><br />
                {e.versionList.length === 0 && <>No versions found<br /></>}
                {e.versionList.length > 0 && <>     Versions: <b>{e.versionList.length}</b><br /></>}
                Audits: <b>{getCounts(id).audits}</b><br />
                Reviews: <b>{getCounts(id).reviews}</b><br />


        </div>*/}


        </div>
    </div ></>


}

