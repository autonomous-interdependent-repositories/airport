import { APPLICATION as AIRPORT_CODE } from '@airport/airport-code/lib/generated/application'
import { APPLICATION as HOLDING_PATTERN } from '@airport/holding-pattern-runtime/lib/application'
import { APPLICATION as AIRSPACE } from '@airport/airspace/lib/generated/application'
import { APPLICATION as TRAVEL_DOCUMENT_CHECKPOINT } from '@airport/travel-document-checkpoint-runtime/lib/application'
import { APPLICATION as MOVING_WALKWAY } from '@airport/moving-walkway/lib/generated/application'

export const BLUEPRINT = [
	AIRPORT_CODE,
	TRAVEL_DOCUMENT_CHECKPOINT,
	AIRSPACE,
	HOLDING_PATTERN,
	MOVING_WALKWAY
]
