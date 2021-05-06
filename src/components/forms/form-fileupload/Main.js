import Button from '@app/components/button'
import P from 'prop-types'
import { useState, useMemo, useRef, useCallback } from 'react'
import { FaPencilAlt, FaSpinner } from 'react-icons/fa'
import styles from './Main.module.css'
import showToast from '@app/utils/toast'
import Link from 'next/link'
import clsx from 'clsx'

export default function FileUpload({
  label,
  maxSize,
  containerClassname,
  fileUrl,
  getFile,
  error,
  className,
  disabled,
  loading,
  ...rest
}) {
  const [fileName, setFileName] = useState(null)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFileUpload = e => {
    e.preventDefault()
    inputRef.current.click()
  }

  const handleFile = useCallback(
    e => {
      const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]
      const max = maxSize ? maxSize * (1024 * 1024) : 5 * (1024 * 1024)
      if (file.size < max) {
        setFileName(file.name)
        setFile(file)
        getFile && getFile(e)
      } else {
        showToast('danger', `File should be less than ${maxSize || 5}mb`)
      }
    },
    [getFile, maxSize]
  )

  const inputFileUpload = useMemo(
    () => (
      <input
        type="file"
        className="hidden"
        accept="application/pdf"
        onChange={handleFile}
        ref={inputRef}
        {...rest}
        key="file1"
      />
    ),
    [inputRef, handleFile, rest]
  )

  const editFile = useMemo(() => {
    return (
      <div className={styles.editContainer}>
        <FaPencilAlt onClick={handleFileUpload} className="cursor-pointer" />

        <Link href={fileName}>
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
        {!label && fileUrl ? (
          <div className={styles.editContainer}>
            {!disabled && (
              <FaPencilAlt
                onClick={handleFileUpload}
                className="cursor-pointer mr-2"
              />
            )}
            <a
              target="_blank"
              rel="noreferrer"
              className={styles.fileUrl}
              style={{ direction: 'rtl', width: '200px' }}
              href={fileUrl}
            >
              {fileName || 'View File'}
            </a>
          </div>
        ) : (
          <Button
            link
            label={label || 'Upload File'}
            onClick={handleFileUpload}
          />
        )}
      </>
    )
  }, [label, fileUrl])

  const containerClasses = useMemo(
    () =>
      clsx(styles.FormDatePicker, containerClassname, {
        [styles.hasError]: !!error
      }),
    [containerClassname, error]
  )
  // editFile : inputFile
  return (
    <div className={containerClasses}>
      {inputFileUpload}
      {loading ? (
        <FaSpinner className="icon-spin" />
      ) : file ? (
        editFile
      ) : (
        inputFile
      )}
    </div>
  )
}

FileUpload.propTypes = {
  label: P.string,
  maxSize: P.number,
  containerClassname: P.string,
  error: P.string,
  fileUrl: P.string,
  className: P.string,
  disabled: P.bool,
  getFile: P.func,
  loading: P.bool
}
