import { getAuditorScore } from '../../api/mockCompute'

import { Tooltip } from '../Tooltip'

const rates = [
    { color: 'grey', score: 0, img: '/UnknownBadge.svg' },
    { color: 'red', score: 1 / 3, img: '/unsafe.svg'  },
    { color: 'orange', score: 2 / 3, img: '/PossiblySafe.svg'  },
    { color: 'green', score: 1, img: '/SafeBadge.svg'  }
]// .reverse()

export const SnapScoreBadge = (props: any) => {
    const score = props.score

    const rate = score !== 0 ? rates.reduce((a: any, b: any, index: number) => {
        const next: any = rates[index + 1]
        if (score > a.score) {
            if (next) {
                return next
            }

            return b
        }

        return a
    }, rates[0]) : rates[0]

    return (<>
        <Tooltip text={`Score: ${score}`}>
            {/*<span style={{ fontSize: 20, color: rate.color }}> &#9679;</span>*/}
            <img src={rate.img} style={{ width: 26, height: 26 }} />
        </Tooltip>
        {/*<img src={'/shield.svg'} style={{ width: 26, height: 26 }} /> */}

    </>)
}