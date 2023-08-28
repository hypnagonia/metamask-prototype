import { useEffect, useState, useCallback } from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { create as saveRecordToBackend, createAttestation, schemas } from '../../api/api'
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom'
import { computeSnapScore } from '../../api/mockCompute'
import { UseCounts } from '../hooks/UseCounts'
import { useAttestations } from '../hooks/UseAttestations'
import { ethers } from 'ethers'
import { AvatarList } from '../common/AvatarList'
import { Avatar } from '../common/Avatar'
import { shortenString } from '../../utils'

export const CommunityCard = (props: any) => {
    const id = props.id
    const e = props.data.toLowerCase()
    const { getCounts, getGroups } = UseCounts()
    const { attestations } = useAttestations()

    const metrics = getGroups(e)

    return <><div className="post-user">
        <div className="post-internal-container">

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Avatar id={e} />
                <div style={{ width: '50%' }}>

                    <Link to={"/auditor/" + e}> <h3 style={{ fontSize: 16, color: '#543A69' }}>
                        {shortenString(e, 18)}<br />
                    </h3></Link>
                </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>

                </div>
            </div>

            <div style={{
                marginTop: 15,
                color: 'rgba(84, 58, 105, 0.65)',
                fontSize: 14,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%'
            }}>
                <div>Followers
                    <br />
                    {<AvatarList attestations={metrics.followers} />}
                </div>
                <div>Following<br />    
                <AvatarList attestations={metrics.following} />
                </div>
                <div>Audits
                    <br />
                    <AvatarList attestations={metrics.audits} />
                    {/*<AvatarList attestations={audits} />*/}
                </div>
                <div>Reviews<br />
                <AvatarList attestations={metrics.reviews} />
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

