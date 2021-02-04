import P from 'prop-types'
import EditButton from './EditButton'

function AudienceType({
  audienceType,
  specificCompanies,
  excludedCompanies,
  onShowAudienceModal
}) {
  const ALL_AUDIENCE_EXCEPT = audienceType === 'allExcept'
  const SPECIFIC_AUDIENCE = audienceType === 'specific'

  return (
    <div className="flex mb-2">
      <span>Audience:</span>{' '}
      <div className="flex ml-2">
        <p className="font-bold mr-2 capitalize">
          {ALL_AUDIENCE_EXCEPT ? 'All except' : audienceType}
        </p>
        {(ALL_AUDIENCE_EXCEPT || SPECIFIC_AUDIENCE) && (
          <p className="font-bold mr-2">
            {excludedCompanies ? (
              <div>{`Companies (${excludedCompanies?.length}) `}</div>
            ) : null}
            {specificCompanies ? (
              <div>{`Companies (${specificCompanies?.length}) `}</div>
            ) : null}
          </p>
        )}
        <EditButton handleClick={onShowAudienceModal} />
      </div>
    </div>
  )
}

AudienceType.propTypes = {
  audienceType: P.string,
  specificCompanies: P.array,
  excludedCompanies: P.array,
  onShowAudienceModal: P.func
}

export default AudienceType
