/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import { Button, Card } from '@app/components/globals'
import Highlight from './highlight'

function Components() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="">
        <h1 className="text-xl font-semibold">Basic</h1>
        <Card
          title="Title"
          content={<div className="p-5">content with padding</div>}
        />
        <Highlight
          code={`<Card 
  title="Title"
  content={
    <div className="p-5">content with padding</div>  
  }
/>`}
        />
      </div>
      <div className="">
        <h1 className="text-xl font-semibold">With Actions</h1>
        <Card
          title="Title"
          actions={[<Button leftIcon="ciergio-circle-plus" label="Action" />]}
          content={<div className="p-5">content with padding</div>}
        />
        <Highlight
          code={`
<Card 
  title="Title"
  actions={[<Button leftIcon="ciergio-circle-plus" label="Action" />]}
  content={
    <div className="p-5">content with padding</div>  
  }
/>
`}
        />
      </div>
      <div className="col-span-2">
        <h1 className="text-xl font-semibold">
          Multiple actions and "List Type" content
        </h1>
        <Card
          title="All Posts"
          actions={[
            <Button primary leftIcon="ciergio-circle-plus" label="Action 1" />,
            <Button leftIcon="ciergio-circle-plus" label="Action 2" />
          ]}
          content={
            <ul>
              <li>test</li>
              <li>test</li>
            </ul>
          }
        />
        <Highlight
          code={`<Card 
  title="All Posts"
  actions={[
    <Button primary leftIcon="ciergio-circle-plus" label="Action 1" />,
    <Button leftIcon="ciergio-circle-plus" label="Action 2" />
  ]}
  content={
    <ul>
    <li>test</li>
    <li>test</li>
  </ul>
  }
/>`}
        />
      </div>
    </div>
  )
}

export default Components
