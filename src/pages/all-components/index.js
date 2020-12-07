import { Button, FormInput } from '@app/components/globals'
import Highlight from './highlight'

function ComponentsPage() {
  return (
    <div className="flex">
      <div className="w-96 p-8">
        <h1 className="text-2xl font-semibold">Form Components</h1>

        <h1 className="text-xl font-semibold my-5">Inputs</h1>
        <FormInput 
        label="Label" 
        placeholder="Type your name" 
        hint="Ciergio invite will be sent to this email." />
        <Highlight
          code={`<FormInput 
  type="password" //defaul to text
  label="Label" //optional
  placeholder="Type your name" optional
  className="custom-class" //optional
  hint="Ciergio invite will be sent to this email." />
/>`}
        />

        <h1 className="text-xl font-semibold my-5">Buttons</h1>
        <div className="inline-flex space-x-4 mb-2">
          <div className="flex-1">
            <Button />
          </div>
          <div className="flex-1">
            <Button primary />
          </div>
          <div className="flex-1">
            <Button label="Custom" />
          </div>
        </div>
        <div className="mb-2">
          <Button primary full />
        </div>
        <Highlight
          code={`<Button primary />
<Button full />
<Button label="Custom" />
<Button primary full />
<Button onClick="(e)=>{}" />`}
        />
      </div>
    </div>
  )
}

export default ComponentsPage
