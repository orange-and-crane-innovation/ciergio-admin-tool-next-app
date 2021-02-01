import Button from '@app/components/button'
import P from 'prop-types'
import { useState, useEffect, useMemo, useRef } from 'react'
import { isNull } from 'lodash'
import { FaPencilAlt } from 'react-icons/fa'
import styles from './Main.module.css'
import showToast from '@app/utils/toast'
import Link from 'next/link'

export default function FileUpload({ label, maxSize }) {
  const [fileName, setFileName] = useState(null)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFileUpload = e => {
    e.preventDefault()
    inputRef.current.click()
  }

  const handleChangeFile = e => {
    const file = e.target.files[0]
    const reader = new FileReader()
    const max = maxSize && maxSize * (1024 * 1024)
    if (file.size < max) {
      setFileName(file.name)

      reader.onload = function (e) {
        setFile(e.target.result)
      }
      reader.readAsDataURL(e.target.files[0])
    } else {
      showToast('danger', `File should be less than ${maxSize || 5}mb`)
    }
  }

  const editFile = useMemo(() => {
    return (
      <div className={styles.editContainer}>
        <FaPencilAlt onClick={handleFileUpload} className="cursor-pointer" />
        <input
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleChangeFile}
          ref={inputRef}
        />
        <Link href="/">
          <a
            className={styles.longName}
            style={{ direction: 'rtl', width: '150px' }}
          >
            {fileName}
          </a>
        </Link>
      </div>
    )
  }, [fileName])

  const inputFile = useMemo(() => {
    return (
      <>
        <input
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleChangeFile}
          ref={inputRef}
        />
        <Button
          full
          label={label || 'Upload File'}
          onClick={handleFileUpload}
        />
      </>
    )
  }, [label])
  return <>{file ? editFile : inputFile}</>
}

FileUpload.propTypes = {
  label: P.string,
  maxSize: P.number
}
