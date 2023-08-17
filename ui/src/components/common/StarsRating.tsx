export const StarsRating = (props: any) => {
    const score = props.score
    const scoreMax = 5
    // todo half of
    
    return (<>
        <span style={{ color: 'orange' }}>
            {[...Array(~~score)].map((a: any) => <>&#11089;</>)}

        </span>
        <span style={{ color: 'lightgrey' }}>
            {[...Array(scoreMax - ~~score)].map((a: any) => <>&#11089;</>)}

        </span></>)
}