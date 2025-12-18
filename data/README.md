# Data Files

## visited-countries.json

This file contains the list of countries you've visited that will be highlighted on the travel map.

### How to add a new country:

1. Open `visited-countries.json`
2. Add the country name to the `countries` array
3. Make sure to use the exact country name as it appears in GeoJSON data

### Supported country names (that have ISO3 mappings):

- Åland Islands
- Albania
- Azerbaijan
- Cyprus
- Jordan
- Kosovo
- Kuwait
- Oman
- Saudi Arabia
- Ukraine
- Uzbekistan

### To add a new country not in this list:

1. Add the country name to `visited-countries.json`
2. Add the ISO3 code mapping in `map.html` in the `countryNameToISO3` object
3. ISO3 codes can be found at: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3

Example:
```javascript
const countryNameToISO3 = {
    'United States': 'USA',
    'United Kingdom': 'GBR',
    'France': 'FRA',
    // ... add more as needed
};
```
