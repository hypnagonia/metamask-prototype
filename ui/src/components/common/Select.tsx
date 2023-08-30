import { getAuditorScore } from '../../api/mockCompute'

export const Select = (props: any) => {
    const id = props.id
    const styles = props.styles
    

    return (<>
        <div className='dropdown' >
           Rating
           <img src='/chevron-down.svg'/>
        </div>
    </>)
}