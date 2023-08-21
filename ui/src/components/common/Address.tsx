import { shortenString } from '../../utils'

export const Address = (props: any) => {
    const address = props.address
    const isShorten = props.shorten

    if (isShorten) {
        return <>{shortenString(address, 16)}</>
    }

    return (<>
        {address}
    </>)
}