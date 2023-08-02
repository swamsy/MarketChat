import { BeatLoader } from 'react-spinners';
import { PulseLoader } from 'react-spinners';

export function CustomBeatLoader() {
  return <BeatLoader color={'#3777c0'} loading={true} size={10} />;
}

export function CustomPulseLoader () {
  return <PulseLoader color={'#14243d'} loading={true} size={5} style={{paddingTop: "0px"}} />;
}
