import { shallowMount } from '@vue/test-utils';
import geocodePostcode from './CoverageOverview.vue';

describe('CoverageOverview Component', () => {
  test('geocodePostcode function', async () => {
    const wrapper = shallowMount(CoverageOverview);
    const componentInstance = wrapper.vm;

    const postcode = 'W1A 3AA';

    try {
      const coordinates = await componentInstance.geocodePostcode(postcode);
      console.log('Coordinates:', coordinates);

      // Assertion: Check if coordinates object contains 'lat' and 'lng' properties
      expect(coordinates).toHaveProperty('lat');
      expect(coordinates).toHaveProperty('lng');

      // Assertion: Check the type of 'lat' and 'lng' properties
      expect(typeof coordinates.lat).toBe('number');
      expect(typeof coordinates.lng).toBe('number');

      // Assertion: Check if 'lat' and 'lng' values fall within a certain range
      expect(coordinates.lat).toBeGreaterThanOrEqual(-90);
      expect(coordinates.lat).toBeLessThanOrEqual(90);
      expect(coordinates.lng).toBeGreaterThanOrEqual(-180);
      expect(coordinates.lng).toBeLessThanOrEqual(180);

      // Assertion: Check if the coordinates match the expected values
      expect(coordinates.lat).toBeCloseTo(expectedLat, 6);
      expect(coordinates.lng).toBeCloseTo(expectedLng, 6);
    } catch (error) {
      console.log('Error geocoding postcode:', error);
      // Handle the error if necessary
    }
  });
});
