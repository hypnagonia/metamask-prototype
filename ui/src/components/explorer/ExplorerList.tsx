import { useEffect, useState, useCallback } from 'react'
import ExplorerCard from './ExplorerCard'
import ExplorerTable from './ExplorerTable'
import { useSnaps } from '../hooks/UseSnaps'

export default function ExplorerList(props: any) {
	const attestations = props.attestations || []
	const gridType = props.type || ''
	const showSearch = props.showSearch !== undefined ? props.showSearch : false
	const { snaps } = useSnaps()
	const [inputValue, setInputValue] = useState('')
	const handleInputChange = useCallback((event: any) => {
		setInputValue(event.target.value.toLowerCase())
	}, [])

	const filteredAttestations =
		inputValue ?
			attestations.filter((a: any) => {
				if (a.attestee.toLowerCase().indexOf(inputValue) !== -1)
					return true
				if (a.attester.toLowerCase().indexOf(inputValue) !== -1)
					return true
				return false
			})
			: attestations

	if (attestations.length === 0) {
		return <>No records found</>
	}

	const searchComponent = showSearch ? <>
		<div className="post-full small-font">
			<div>
				<input
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Search"
					className="normal-input"
				/>
			</div>
		</div></> : null

	if (gridType === 'table') {
		return <>
			{searchComponent}
			<div className="post-full small-font" >
				<ExplorerTable attestations={filteredAttestations} snaps={snaps} />
			</div>
		</>
	}

	return (<>
		{searchComponent}
		<div>
			{filteredAttestations.map((r: any) => {
				return (
					<div>
						<ExplorerCard data={r} />
					</div>
				)
			})}
		</div>
	</>
	)
}


