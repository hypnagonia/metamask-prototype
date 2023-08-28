import { getAuditorScore } from '../../api/mockCompute'

export const Avatar = (props: any) => {
    const id = props.id
    const styles = props.styles
    const auditorScore = getAuditorScore(id)

    return (<>
        <div >
            <img src={`/avatar${auditorScore}.png`} style={{ width: 64, height: 64, borderRadius: 104, ...styles }} />
        </div>
    </>)
}