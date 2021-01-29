import { BiLoaderAlt } from 'react-icons/bi'

export default function Spinner() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <BiLoaderAlt className="animate-spin text-4xl text-gray-500" />
    </div>
  )
}
