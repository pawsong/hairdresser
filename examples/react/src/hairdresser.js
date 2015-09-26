import Hairdresser from '../../../src/Hairdresser';

export default function createHairdresser() {
  const hairdresser = Hairdresser.create();
  hairdresser.override().title('Hairdresser Example');
  return hairdresser;
}
