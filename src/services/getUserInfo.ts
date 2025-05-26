import axios from "axios";

export interface Coords {
  latitude: number;
  longitude: number;
}

interface CityDetailsResponse {
  results: {
    formatted: string;
    bounds: {
      northeast: {
        lng: number;
        lat: number;
      };
    };
    components: {
      city: string;
    };
  }[];
}

export interface CityDetails {
  city: string;
  location: Coords;
}

export const getCityDetailsByCoords = async ({
  latitude,
  longitude,
}: Coords): Promise<CityDetails> => {
  const apiKey = "d4683b09d0c94ec0aebf0b2e043decbf";
  const urlPosition = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}`;
  const { data } = await axios.get<CityDetailsResponse>(urlPosition, {
    params: {
      key: apiKey,
      language: "en",
    },
  });

  return {
    city: data.results[0].components.city,
    location: {
      latitude: data.results[0].bounds.northeast.lat,
      longitude: data.results[0].bounds.northeast.lng,
    },
  };
};

export const getCityDetailsByQuery = async (
  query: string
): Promise<CityDetails> => {
  const apiKey = "d4683b09d0c94ec0aebf0b2e043decbf";
  const urlPosition = `https://api.opencagedata.com/geocode/v1/json?q=${query}`;
  const { data } = await axios.get<CityDetailsResponse>(urlPosition, {
    params: {
      key: apiKey,
      language: "en",
    },
  });

  if (!data.results[0]) throw new Error(`City ${query} not found`);

  return {
    city: data.results[0].formatted,
    location: {
      latitude: data.results[0].bounds.northeast.lat,
      longitude: data.results[0].bounds.northeast.lng,
    },
  };
};
