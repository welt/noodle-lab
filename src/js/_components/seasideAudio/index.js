import SeasideAudio from './classes/seasideAudio';

if (!customElements.get("seaside-audio")) {
  customElements.define("seaside-audio", SeasideAudio);
}

export default SeasideAudio;

export { SeasideAudio };
