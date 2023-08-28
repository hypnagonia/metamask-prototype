import { getAuditorScore } from '../../api/mockCompute'

export const AvatarList = (props: any) => {
    const attestations = props.attestations || []
    const previewCount = props.count || 3

    const previews = attestations.filter((a: any, i: number) => i < previewCount)

    if (attestations.length === 0) {
        return <>&mdash;</>
    }

    return (<>
        <div style={{
            display: 'flex', flexDirection: 'row',
        }}>
            {previews.map((p: any) => {
                const id = getAuditorScore(p.attester)
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
    </>)
}