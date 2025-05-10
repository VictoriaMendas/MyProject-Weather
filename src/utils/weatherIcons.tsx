import {
  WiDaySunny,
  WiCloudy,
  WiFog,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export const getWeatherIcon = (weatherCode: number, className: string) => {
  if (weatherCode === 0) return <WiDaySunny className={className} />;
  if (weatherCode >= 1 && weatherCode <= 3)
    return <WiCloudy className={className} />;
  if (weatherCode === 45 || weatherCode === 48)
    return <WiFog className={className} />;
  if (weatherCode >= 51 && weatherCode <= 67)
    return <WiRain className={className} />;
  if (weatherCode >= 71 && weatherCode <= 77)
    return <WiSnow className={className} />;
  if (weatherCode >= 95 && weatherCode <= 99)
    return <WiThunderstorm className={className} />;
  return null;
};
