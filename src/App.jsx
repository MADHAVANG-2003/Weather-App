import { useState } from 'react'
import '../src/App.css'
import sun from '/images/sun.png'
import cloudy from '/images/cloudy.png'
import rain from '/images/rain.png'
import snow from '/images/snow.png'

function WeatherDetails({icon,temp,city,country}){
  return(
    <>
      <div className="image">
        <img src={icon} alt="" />
      </div>
      <div className="temp">{temp}&deg;C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
    </>
  )
}

function App() {

  const [icon,setIcon] = useState(sun)
  const [temp,setTemp] = useState(0)
  const [city,setCity] = useState("")
  const [country,setCountry] = useState("")
  const [text,setText] = useState("")
  const [loading,setLoading] = useState(false)
  const [citynotfound,setCitynotfound] = useState(false)
  const [error,setError] = useState();
  const [value,setValue] = useState(false)

  const [logo,setLogo] = useState();

  var logos = {
    "01d":sun,
    "02d":sun,
    "03d":sun,
    "04d":cloudy,
    "09d":cloudy,
    "10d":rain,
    "11d":rain,
    "13d":snow,
    "50d":snow
  }

  const search = async()=>{
    setLoading(true)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=6472f90f75381836579e114fd8aa1759&units=metric`;

    try{
      const weatherData = await fetch(url);
      const data = await weatherData.json();
      console.log(data)
      if(data.cod === "404"){
        setCitynotfound(true)
        setLoading(false)
        return;
      }
      if(text == ""){
        setValue(true)
      }
      setCity(data.name);
      setCountry(data.sys.country);
      setTemp(Math.floor(data.main.temp))
      setCitynotfound(false)
      setValue(false)
      setError(false)
      const logocode = data.weather[0].icon;
      console.log(logocode)
      setIcon(logos[logocode] || sun)
    }
    catch(err){
      setError("An error accurred while fetching weather data")
    }finally{
      setLoading(false)
    }

    
    
  }
  const cityfn = (e)=>{
    setText(e.target.value)
  }
  const keydownfn = (e)=>{
    if(e.key === "Enter"){
      search()
    }
  }
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityInput' value={text} onKeyDown={keydownfn} onChange={cityfn} placeholder='Enter the City Name'/>
          <div className="search-icon" onClick={()=>search()} >
          <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
       
        {loading && <div className="load">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {citynotfound && !value && <div className="citynot">City Not Found</div>}
        {value && <div className="valueDiv">Please Enter the Value</div>}
        {!citynotfound && !loading && !value && <WeatherDetails icon={icon} temp={temp} city={city} country={country}/>}
      </div>
    </>
  )
}


export default App
