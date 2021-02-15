import React from 'react'
import P from 'prop-types'

import PrintData from './PrintData'

class PrayerRequestPrintView extends React.PureComponent {
  render() {
    const { title, data } = this.props

    return (
      <div className="print-container">
        <div className="w-full px-8 py-4">
          <h5 className="text-xl text-left">{title}</h5>
        </div>

        <div>
          <table>
            <thead>
              <tr>
                <th width="2%">#</th>
                <th width="15%">Date Created</th>
                <th>Category</th>
                <th>Requestor</th>
                <th>Prayer For</th>
                <th>Prayer From</th>
                <th width="15%">Date of Mass</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <PrintData data={data} />
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

PrayerRequestPrintView.propTypes = {
  title: P.string,
  data: P.array
}

export default PrayerRequestPrintView
