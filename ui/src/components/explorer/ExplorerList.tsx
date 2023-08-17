import { useEffect, useState, useCallback } from 'react'
import ExplorerCard from './ExplorerCard'
import ExplorerTable from './ExplorerTable'

export default function ExplorerList(props: any) {
	const attestations = props.attestations || []
	const gridType = props.type || ''

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


	const searchComponent = <>
		<div className="post-full small-font">
			<div>
				<input
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Search"
					className="normal-input"
				/>
			</div>


		</div></>

	if (gridType === 'table') {
		return <>
			{searchComponent}
			<div className="post-full small-font" >
				<ExplorerTable attestations={filteredAttestations} />
			</div>
		</>
	}

	return (<>
		<div className="container" style={{ marginTop: 30 }}>

		</div>
		<div>
			{filteredAttestations.map((r: any) => {
				return (
					<div key={r.attestationId}>
						<ExplorerCard data={r} />
					</div>
				)
			})}
		</div>
	</>
	)
}


