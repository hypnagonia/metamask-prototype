import { useEffect, useState, useCallback } from 'react'
import FollowersCard from './FollowersCard'

export default function FollowersList(props: any) {
	const followers = props.followers

	if (followers.length === 0) {
		return <>
			<div>No records found</div>
		</>
	}
	
	return (
		<>
			{followers.map((r: any) => {
				return (
					<div key={r.attestationId}>
						<FollowersCard data={r} />
					</div>
				)
			})}
		</>
	)
}


