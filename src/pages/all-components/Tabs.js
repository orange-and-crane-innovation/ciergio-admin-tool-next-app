import Tabs from '@app/components/tabs'

const ToastPage = () => {
  return (
    <div className="flex">
      <div className="w-full p-8">
        <h1 className="text-xl font-semibold mb-4">Tabs</h1>
        <Tabs defaultTab="1">
          <Tabs.TabLabels>
            <Tabs.TabLabel id="1">Tab 1</Tabs.TabLabel>
            <Tabs.TabLabel id="2">Tab 2</Tabs.TabLabel>
            <Tabs.TabLabel id="3">Tab 3</Tabs.TabLabel>
          </Tabs.TabLabels>
          <Tabs.TabPanels>
            <Tabs.TabPanel id="1">Tab 1</Tabs.TabPanel>
            <Tabs.TabPanel id="2">Tab 2</Tabs.TabPanel>
            <Tabs.TabPanel id="3">Tab 3</Tabs.TabPanel>
          </Tabs.TabPanels>
        </Tabs>
      </div>
    </div>
  )
}

export default ToastPage
