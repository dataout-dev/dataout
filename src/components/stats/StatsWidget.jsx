import { widgetRegistry } from './widgets/index.jsx'

function StatsWidget({ widget }) {
  if (!widget) return null
  const Widget = widgetRegistry[widget]
  if (!Widget) return null
  return <Widget />
}

export default StatsWidget
