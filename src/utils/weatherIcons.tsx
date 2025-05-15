// import {
//   WiDaySunny,
//   WiCloudy,
//   WiFog,
//   WiRain,
//   WiSnow,
//   WiThunderstorm,
// } from "react-icons/wi";

// export const getWeatherIcon = (weatherCode: number, className: string) => {
//   if (weatherCode === 0) return <WiDaySunny className={className} />;
//   if (weatherCode >= 1 && weatherCode <= 3)
//     return <WiCloudy className={className} />;
//   if (weatherCode === 45 || weatherCode === 48)
//     return <WiFog className={className} />;
//   if (weatherCode >= 51 && weatherCode <= 67)
//     return <WiRain className={className} />;
//   if (weatherCode >= 71 && weatherCode <= 77)
//     return <WiSnow className={className} />;
//   if (weatherCode >= 95 && weatherCode <= 99)
//     return <WiThunderstorm className={className} />;
//   return null;
// };
export const getWeatherIcon = (weatherCode: number, className?: string) => {
  let icon = "";
  switch (weatherCode) {
    case 0:
      icon = "☀️"; // Clear sky
      break;
    case 1:
    case 2:
    case 3:
      icon = "⛅"; // Mainly clear, partly cloudy, overcast
      break;
    case 45:
    case 48:
      icon = "🌫️"; // Fog
      break;
    case 51:
    case 53:
    case 55:
      icon = "🌦️"; // Drizzle
      break;
    case 61:
    case 63:
    case 65:
      icon = "🌧️"; // Rain
      break;
    case 71:
    case 73:
    case 75:
      icon = "❄️"; // Snow
      break;
    case 95:
      icon = "⛈️"; // Thunderstorm
      break;
    default:
      icon = "🌥️"; // Default for unknown codes
  }
  return <span className={className}>{icon}</span>;
};
