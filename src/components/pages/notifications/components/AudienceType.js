import P from 'prop-types'
import EditButton from './EditButton'

import { ACCOUNT_TYPES } from '@app/constants'

function AudienceType({
  audienceType,
  specificCompanies,
  excludedCompanies,
  specificComplexes,
  excludedComplexes,
  specificBuildings,
  excludedBuildings,
  onShowAudienceModal
}) {
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const isSystemPray = system === 'pray'
  const ALL_AUDIENCE_EXCEPT = audienceType === 'allExcept'
  const SPECIFIC_AUDIENCE = audienceType === 'specific'

  return (
    <div className="flex">
      <span style={{ minWidth: '65px' }}>Audience:</span>
      <div className="flex flex-col">
        <div className="flex">
          <p className="font-bold mr-2">
            {ALL_AUDIENCE_EXCEPT
              ? 'Only show to those selected'
              : SPECIFIC_AUDIENCE
              ? 'All those registered except'
              : 'All those registered'}
          </p>

          {!isSystemPray ||
            (isSystemPray && accountType !== ACCOUNT_TYPES.COMPXAD.value && (
              <EditButton onClick={onShowAudienceModal} />
            ))}
        </div>

        <div className="flex flex-col">
          <p className="font-bold mr-2">
            {accountType !== ACCOUNT_TYPES.COMPYAD.value && (
              <>
                {excludedCompanies && (
                  <div>{`Companies (${excludedCompanies?.length}) `}</div>
                )}
                {specificCompanies && (
                  <div>{`Companies (${specificCompanies?.length}) `}</div>
                )}
              </>
            )}

            {accountType !== ACCOUNT_TYPES.COMPXAD.value && (
              <>
                {excludedComplexes && (
                  <div>{`Complexes (${excludedComplexes?.length}) `}</div>
                )}
                {specificComplexes && (
                  <div>{`Complexes (${specificComplexes?.length}) `}</div>
                )}
              </>
            )}

            {accountType !== ACCOUNT_TYPES.BUIGAD.value && (
              <>
                {excludedBuildings && (
                  <div>{`Buildings (${excludedBuildings?.length}) `}</div>
                )}
                {specificBuildings && (
                  <div>{`Buildings (${specificBuildings?.length}) `}</div>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

AudienceType.propTypes = {
  audienceType: P.string,
  specificCompanies: P.array,
  excludedCompanies: P.array,
  specificComplexes: P.array,
  excludedComplexes: P.array,
  specificBuildings: P.array,
  excludedBuildings: P.array,
  onShowAudienceModal: P.func
}

export default AudienceType
