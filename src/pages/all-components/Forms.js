import { Button, FormInput, FormSelect } from '@app/components/globals'
import Highlight from './highlight'

function Components() {
  return (
<div className="grid grid-cols-3 gap-4">
      <div className="">
        <h1 className="text-xl font-semibold">Inputs</h1>
        <FormInput
          label="Label"
          placeholder="Type your name"
          hint="Ciergio invite will be sent to this email."
        />
        <Highlight
          code={`<FormInput 
  type="password" //defaul to text
  label="Label" //optional
  placeholder="Type your name" optional
  className="custom-class" //optional
  hint="Ciergio invite will be sent to this email." />
/>`} />
        <FormInput
          label="With Icon"
          placeholder="Search"
          rightIcon="ciergio-search"
        />
        <Highlight
          code={`<FormInput 
  label="With Icon"
  placeholder="Search"
  rightIcon="ciergio-search"
/>`}
        />
        </div>
        <div className="">
        <h1 className="text-xl font-semibold">Buttons</h1>
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
        <div className="mb-2">
          <Button full leftIcon="ciergio-circle-plus" label="Custom Label"/>
        </div>
        
        <Highlight
          code={`<Button primary />
<Button full />
<Button label="Custom" />
<Button primary full />
<Button onClick="(e)=>{}" />
<Button 
  full 
  leftIcon="ciergio-circle-plus" 
  label="Custom Label"
/>
`}
        />
      </div>
    {/* SELECT FORM */}
        <div className="">
        <h1 className="text-xl font-semibold">Select</h1>
        <FormSelect
              options={[{ label: 'Option 1', value: 'option1val' },{ label: 'Option 2', value: 'option2val' }]}
            />
        
        <Highlight
          code={`<FormSelect
  options={[
    { label: 'Option 1', value: 'option1val' },
    { label: 'Option 2', value: 'option2val' }
  ]}
/>`}
        />
        <FormSelect
              options={[{ label: 'Option 1', value: 'option1val' },{ label: 'Option 2', value: 'option2val' }]}
              label="With Label"
              hint="and hint"
            />
        
        <Highlight
          code={`<FormSelect
  options={[
    { label: 'Option 1', value: 'option1val' },
    { label: 'Option 2', value: 'option2val' }
  ]}
/>`}
        />
      </div>
  </div>
  )
}

export default Components
