// @ts-ignore
import Modal, { closeStyle } from 'simple-react-modal'
import { useEffect, useState, useCallback } from 'react'
import { getAllWithHistory } from '../../api/compute'
import moment from 'moment'
import { Tooltip } from '../Tooltip'

export const HistoricalScores = (props: any) => {
    const computeId = props.computeId

    const [isVisible, setIsVisible] = useState(false)
    const [data, setData] = useState([])

    const openModal = useCallback(() => {
        const run = async () => {
            const res = await getAllWithHistory(computeId)
            // @ts-ignore
            setData(res)
        }

        run()
        setIsVisible(true)
    }, [computeId])

    return (<>
        <div
            onClick={() => openModal()}
            style={{ fontSize: 12, color: 'gray', cursor: 'pointer' }}>
            Historical Scores
        </div>

        <Modal
            closeOnOuterClick={true}
            show={isVisible}
            containerStyle={{ width: 600 }}
            onClose={() => setIsVisible(false)}>

            <div style={{ color: '#7000FF', fontSize: 14, alignItems: 'center', padding: 20, cursor: 'unset' }}>
                {data.length === 0 ? 'Loading...' : <>
                    <div style={{ width: '100%', fontSize: 14, alignItems: 'left', padding: 5, marginBottom: 10 }}>
                        {computeId}
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', color: 'rgb(84, 58, 105)', fontSize: 14, alignItems: 'left', padding: 5, cursor: 'unset', borderBottom: '1px solid lightgray', marginBottom: 10 }}>
                        <div style={{ width: '40%' }}>Date</div>
                        <div style={{ width: '30%' }}>Audit Score</div>
                        <div style={{ width: '30%' }}>Review Score</div>

                    </div>
                    {data.map(((a: any) => {
                        const ago = moment(a.timestamp).fromNow(true)

                        return <>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', color: 'rgb(84, 58, 105)', fontSize: 14, alignItems: 'left', padding: 5, fontWeight: 'normal' }}>
                                <div style={{ width: '40%' }}>
                                    <Tooltip text={a.timestamp}>
                                        {ago}&nbsp;ago
                                    </Tooltip>
                                </div>
                                <div style={{ width: '30%', color: '#7000FF', fontWeight: 'bold' }}> {a.audits || '-'}</div>
                                <div style={{ width: '30%', color: '#7000FF', fontWeight: 'bold' }}>{a.reviews || '-'}</div>

                            </div>
                        </>
                    }))}
                </>}
            </div>

        </Modal>
    </>)
}