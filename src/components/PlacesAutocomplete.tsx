import React from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/round-borders.css';

interface PlacesAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (location: any) => void;
  className?: string;
}

const API_KEY = 'a33de519f1e14d9096c56a9ac7455470';

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  placeholder,
  value,
  onChange,
  onSelect,
  className,
}) => {
  const handlePlaceSelect = (place: any) => {
    if (place) {
      // Extract the formatted address
      const formattedAddress = place.properties.formatted;
      
      // Update the input value
      onChange(formattedAddress);
      
      // Call the optional onSelect callback with the full place data
      if (onSelect) {
        onSelect(place);
      }
    }
  };

  return (
    <GeoapifyContext apiKey={API_KEY}>
      <GeoapifyGeocoderAutocomplete
        placeholder={placeholder}
        value={value}
        placeSelect={handlePlaceSelect}
        suggestionsChange={() => {}}
        className={className}
      />
    </GeoapifyContext>
  );
};

export default PlacesAutocomplete;