
import { useEffect, useState, useCallback } from 'react'
import { shortenString } from '../../utils'
import { UseIdentity } from '../hooks/UseIdentity'
import { SnapScoreBadge } from './SnapScoreBadge'
import { UseCompute, getAddressScore } from '../hooks/UseCompute'

const images: any = {
    lens: '/LensAddress.svg'
}

export const Address = (props: any) => {
    const address = props.address.toLowerCase()
    const isShorten = props.shorten
    let shortenLength = 16
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

    console.log({identity, address})
    if (identity) {
        
        try {
            if (typeof identity === 'string') {
                shortenLength = 24
                displayString = `${identity}`
            } else {

                const socials = identity.Wallet.socials
                
                if (socials) {
                    console.log({socials, address})
                    shortenLength = 24
                    const app = socials[0].dappName || ''
                    if (images[app]) {
                        DisplayExtra = <><img src={images[app]} /></>
                        displayString = socials[0].profileName
                    } else {
                        displayString = `${app}:${socials[0].profileName}`
                    }
                }
            }
        } catch (e) { }
    } else {


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