import { getAuditorScore } from '../../api/mockCompute'
import { Tooltip } from '../Tooltip'
import { Address } from './Address'

export const AvatarList = (props: any) => {
    const attestations = props.attestations || []
    const previewCount = props.count || 3
    const tooltip = props.tooltip || false
    const isFrom = props.from && !props.to
    const list = tooltip ? attestations.map((a: any) => <div><Address address={isFrom ? a.attester : a.attestee} /></div>) : []
    const listDisplay = list.length ? <>{list}</> : null

    const previews = attestations.filter((a: any, i: number) => i < previewCount)

    if (attestations.length === 0) {
        return <>&mdash;</>
    }

    return (<>
        <Tooltip text={listDisplay}>
            <div style={{
                display: 'flex', flexDirection: 'row',
            }}>
                {previews.map((p: any) => {
                    const id = getAuditorScore(isFrom ? p.attester : p.attestee)
                    return <div style={{ marginRight: -5 }}>
                        <img src={`/avatar${id}.png`} className="circle-avatar-small" />
                    </div>
                })}
                {attestations.length > previewCount && <>
                    <div style={{ marginRight: -5 }}>
                        <div className="circle-avatar-small circle-avatar-placeholder" >
                            +{attestations.length}
                        </div>
                    </div>
                </>}
            </div>
        </Tooltip>
    </>)
}