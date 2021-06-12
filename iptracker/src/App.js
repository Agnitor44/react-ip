import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './styles/App.css';
import 'leaflet/dist/leaflet.css';
import arrow from './images/icon-arrow.svg'
import loc from './images/icon-location.svg'
import { useState, useRef, useEffect } from 'react';
import L from 'leaflet'
const API_KEY = 'at_yV3AWqLhFc4uteXVzyicnMerkpNYi'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({

  iconUrl: loc,

})
function App() {
  const inputRef = useRef()
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState(false)
  const [data, setData] = useState({ip: "192.212.174.101", location: "Brooklyn, NY 10001", timezone: "UTC - 05:00", isp: "SpaceX Starlink", cords: [34.04915, -118.09462]  })


  const handleSub = async(e) => {
    e.preventDefault()
    if(!inputRef.current.value) return alert('please provaid an IP address') 
    setErr(false)
    setLoad(true)
   await fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${inputRef.current.value}`).then(res => res.json()).then(response => {
          console.log(response)
        if(response.code === 422) return null
           
            setData({ip: response.ip, location: response.location.city, timezone: response.location.timezone, isp: response.isp, cords: [ response.location.lat , response.location.lng ]})  
    })
    await fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&domain=${inputRef.current.value}`).then(res => res.json()).then(response => {
   
    if(response.code === 422) return setErr(true)
      setData({ip: response.ip, location: response.location.city, timezone: response.location.timezone, isp: response.isp, cords: [ response.location.lat , response.location.lng ]})  
})
 
   setLoad(false)
  }
  return (
    <div className="App">
      <section className="upperPanel">
        <div className="inputZone">
        <h3>IP Address Tracker</h3>
        <form onSubmit = {handleSub}>
        <input ref = {inputRef} placeholder = 'Search for any IP address or domain' type="text" />
        <button> <img src= {arrow} alt="" /></button>
        </form>
        </div>
        <div className="resultPanel">
          <ul>
            <li>
              <h4>ip address</h4>
              <h2>{err ? "Error" : data.ip}</h2>
            </li>
            <li>
            <h4>location</h4>
              <h2>{err ? "Error" :data.location}</h2>
            </li>
            <li>
            <h4>timezone</h4>
              <h2>{err ? "Error" :data.timezone}</h2>
            </li>
            <li>
            <h4>isp</h4>
              <h2>{err ? "Error" :data.isp}</h2>
            </li>
          </ul>
        </div>
      </section>

    
{
  load ?
  <h1>load</h1>:
      <MapContainer className="map" center={data.cords} zoom={13} scrollWheelZoom={false} >

      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={data.cords}>
   
        <Popup className = 'pop' >
        <p>{data.isp}</p>
        </Popup>
      </Marker>
    </MapContainer>
}



    </div>
  );
}

export default App;
