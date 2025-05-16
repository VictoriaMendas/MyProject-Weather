import {
  WiDaySunny,
  WiDayCloudy,
  WiFog,
  WiRainMix,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiCloudy,
} from "react-icons/wi";

export const getWeatherIcon = (weatherCode: number, className?: string) => {
  switch (weatherCode) {
    case 0:
      return <WiDaySunny className={className} />; // Clear sky
    case 1:
    case 2:
    case 3:
      return <WiDayCloudy className={className} />; // Mainly clear, partly cloudy, overcast
    case 45:
    case 48:
      return <WiFog className={className} />; // Fog
    case 51:
    case 53:
    case 55:
      return <WiRainMix className={className} />; // Drizzle
    case 61:
    case 63:
    case 65:
      return <WiRain className={className} />; // Rain
    case 71:
    case 73:
    case 75:
      return <WiSnow className={className} />; // Snow
    case 95:
      return <WiThunderstorm className={className} />; // Thunderstorm
    default:
      return <WiCloudy className={className} />; // Default for unknown codes
  }
};
