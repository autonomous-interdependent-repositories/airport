import {diToken}            from '@airport/di'
import {IActiveQueries}     from './store/ActiveQueries'
import {IIdGenerator}       from './store/IdGenerator'
import {ISequenceGenerator} from './store/SequenceGenerator'

export const ACTIVE_QUERIES     = diToken<IActiveQueries>()
export const ID_GENERATOR       = diToken<IIdGenerator>()
export const SEQUENCE_GENERATOR = diToken<ISequenceGenerator>()