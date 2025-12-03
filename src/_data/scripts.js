export default function () {
  return [
    { name: "main", prod: "main.js", dev: "bundle.esm.js", path: "/js/" },
    {
      name: "audioLoops",
      prod: "audioLoops.js",
      dev: "audioLoops.js",
      path: "/js/audioLoops/",
    },
    {
      name: "digitalRain",
      prod: "digitalRain.js",
      dev: "digitalRain.js",
      path: "/js/digitalRain/",
    },
    {
      name: "pixelMangler",
      prod: "pixelMangler.js",
      dev: "pixelMangler.js",
      path: "/js/pixelMangler/",
    },
  ];
}
