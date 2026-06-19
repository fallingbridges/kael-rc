import { Cellular, Wifi, Battery } from './Icons.jsx'

export default function StatusBar({ tone = 'light' }) {
  return (
    <div className="statusbar" data-tone={tone}>
      <div className="island" />
      <span className="sb-time">9:41</span>
      <span className="sb-right">
        <Cellular size={17} />
        <Wifi size={17} />
        <Battery size={25} />
      </span>
    </div>
  )
}
