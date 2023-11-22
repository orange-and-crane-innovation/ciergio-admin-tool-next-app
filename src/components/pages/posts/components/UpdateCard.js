import Button from '@app/components/button'
import { FiDownload } from 'react-icons/fi'
import PropTypes from 'prop-types'
import QRCode from 'react-qr-code'
import React from 'react'
import { useRouter } from 'next/router'

const saveSvgAsPng = require('save-svg-as-png')

const Component = ({ type, title, data }) => {
  const router = useRouter()
  const isQRCodePage = router.pathname === '/qr-code'
  let typeName = ''

  if (type === 'unpublished') {
    typeName = 'unpublish'
  } else if (type === 'trashed') {
    typeName = 'move to trash'
  } else if (type === 'deleted') {
    typeName = 'delete permanently'
  } else if (type === 'draft') {
    typeName = 'restore'
  }

  const downloadQR = () => {
    const imageOptions = {
      scale: 5,
      encoderOptions: 1,
      backgroundColor: 'white'
    }

    saveSvgAsPng.saveSvgAsPng(
      document.querySelector('.qrCode > svg'),
      'qr.png',
      imageOptions
    )
  }

  return (
    <div className="text-base font-normal">
      {type === 'draft' ? (
        <>
          <p>
            {`Are you sure you want to `} {typeName}
            <strong>{` "${title}"? `}</strong>
          </p>
          <br />
          <p>
            The post will be automatically saved as <strong>DRAFT</strong>.
          </p>
        </>
      ) : type === 'preview' ? (
        <>
          <p>
            To capture all the changes made in your post, we need to save it to
            drafts first.
          </p>
        </>
      ) : type === 'preview-edit' ? (
        <>
          <p>
            To capture all the changes made in your post, we need to save it
            first.
          </p>
        </>
      ) : type === 'download-qr' ? (
        <div className="qrCode flex flex-col items-center justify-center">
          <QRCode
            value={`${window.location.origin}/public-qr-posts/view/${data._id}`}
          />
          <Button
            default
            label="Download"
            onClick={downloadQR}
            leftIcon={<FiDownload />}
            className="mt-4"
          />
        </div>
      ) : isQRCodePage && type === 'trashed' ? (
        <>
          <p>
            This will also deactivate the QR Code. Are you sure you want to move
            this post to trash?
          </p>
        </>
      ) : type === 'remove-video' ? (
        <>
          <p>
            To successfuly update this article with a new video, you need to
            save this post after uploading the new video.
          </p>
        </>
      ) : (
        <>
          <p>
            {`You are about to ${typeName} `}
            <strong>{`"${title}" `}</strong>
            {`from the list.`}
          </p>
          <br />
          <p>Do you want to continue?</p>
        </>
      )}

      <br />
    </div>
  )
}

Component.propTypes = {
  type: PropTypes.string,
  title: PropTypes.any,
  data: PropTypes.array
}

export default Component
