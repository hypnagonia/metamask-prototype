
import { useEffect, useState, useCallback } from 'react'
import { shortenString } from '../../utils'
import { UseIdentity,getSocial, getEns } from '../hooks/UseIdentity'
import { SnapScoreBadge } from './SnapScoreBadge'
import { UseCompute, getAddressScore } from '../hooks/UseCompute'

const images: any = {
    lens: '/LensAddress.svg',
    farcaster: '/farcaster.svg'
}


export const Address = (props: any) => {
    const address = props.address.toLowerCase()
    const isShorten = props.shorten
    const isIconHidden = props.isIconHidden
    let shortenLength = props.shortenLength || 16
    const { identities, loadAttestations } = UseIdentity(address)
    const { attestations: computeAttestations } = UseCompute()
    const [identityState, setIdentityState] = useState({} as any)
    const scoreCompute = getAddressScore(address, computeAttestations)

    useEffect(() => {

        const load = async () => {
            await loadAttestations(address)
        }

        load()
    }, [address])

    const identity = identities[address] || identityState[address]

    let displayString = address
    let DisplayExtra = null

   //  console.log({ identity, address })

    const social = getSocial(identity)
    const ens = getEns(identity)
    if (typeof identity === 'string') {
        shortenLength = props.shortenLength || 24
        displayString = `${identity}`
    } else if (ens) {
        displayString = ens.profileName
    } else if (social) {
        shortenLength = props.shortenLength || 24
        const app = social.dappName || ''
        if (!isIconHidden && images[app]) {
            DisplayExtra = <><img src={images[app]} /></>
            displayString = social.profileName
        } else {
            displayString = `${app}:${social.profileName}`
        }

    }

    if (isShorten) {
        displayString = shortenString(displayString, shortenLength)
    }


    if (DisplayExtra) {
        return <div style={{ display: 'flex' }}>{DisplayExtra}&nbsp;{displayString}</div>
    }

    return (<>
        {displayString}&nbsp;
        {/*<SnapScoreBadge score={scoreCompute}/>*/}
    </>)
}