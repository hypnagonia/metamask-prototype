import { getAuditorScore } from '../../api/mockCompute'

export const Avatar = (props: any) => {
    const id = props.id

    const auditorScore = getAuditorScore(id)

    return (<>
        <div >
            <img src={`/avatar${auditorScore}.png`} />
        </div>
    </>)
}