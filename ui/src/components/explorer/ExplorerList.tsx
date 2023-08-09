import { useEffect, useState, useCallback } from 'react'
import ExplorerCard from './ExplorerCard'

export default function FollowersList(props: any) {
	const attestations = props.attestations || []
	const [inputValue, setInputValue] = useState('')
	const handleInputChange = useCallback((event: any) => {
		setInputValue(event.target.value)
	}, [])

	const filteredAttestations =
		inputValue ?
			attestations.filter((a: any) => {
				return true
			})
			: attestations
	return (<>
		<div className="container" style={{ marginTop: 30 }}>
			<div className="post-full small-font">

				<div>
					<input
						value={inputValue}
						onChange={handleInputChange}
						placeholder="Search"
						className="normal-input"
					/>
				</div>


			</div></div>
		<div>
			{attestations.map((r: any) => {
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


