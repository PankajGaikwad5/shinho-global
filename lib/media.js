// Placeholder stock media for the concept pages (Mixkit free licence + Unsplash).
// Swap for the client's own footage/photography later — keep the same keys.
import { U } from "./materials";

const mix = (id) => ({
  src: `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`,
  poster: `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`,
});

export const VIDEO = {
  factoryAerial: mix(14631),     // Industrial manufacturing factory from above
  factoryNight: mix(1673),       // Aerial view of a factory at night
  factoryNightTop: mix(1675),    // Top aerial view of a factory at night
  machinery: mix(17675),         // Mechanical machinery close up
  lathe: mix(2244),              // Worker operating an industrial lathe
  cutting: mix(2250),            // Industrial machine cutting
  slitter: mix(2252),            // Industrial razor cutter
  workshop: mix(2233),           // Steel workshop machine
  foundry: mix(20906),           // Molten metal in a foundry
  liquidSteam: mix(17024),       // Liquid metal and steam
  liquidMetal: mix(30734),       // Liquid metal shapes in motion
  metalLight: mix(30741),        // Light reflections on a metal surface
  marble: mix(34488),            // Smooth marble surface texture
  marbleWhite: mix(34498),       // White marble with grey
  engraved: mix(34505),          // Metal surface engraved with ornaments
  quarry: mix(46295),            // Marble quarry, Carrara
  quarryCliffs: mix(46293),      // Marble mine cliffs, Italy
  ink: mix(152),                 // Black ink underwater
  inspector: mix(33006),         // Inspector checking production
  corridor: mix(23378),          // Worker walking machine corridor
  conveyor: mix(20770),          // Parcels on a conveyor belt
  cargoShip: mix(35869),         // Cargo ship leaving port
  robot: mix(47257),             // Robot on a production line
  sparks: mix(46082),            // Angle grinder sparks
  woodPlant: mix(21950),         // Wood processing plant
};

export const IMG = {
  facility: (w = 2000) => U('1717386255767-52643970d483', w),
  ceiling: (w = 1600) => U('1766445318570-1dc4bf3f5d79', w),
  metallic: (w = 1600) => U('1656055448548-e26753307fc7', w),
  oak: (w = 1600) => U('1768591189203-8c05a55a36f5', w),
  aluminium: (w = 1600) => U('1667892702884-faa077e80d7b', w),
  contact: (w = 2000) => U('1513828646384-e4d8ec30d2bb', w),
  compounding: (w = 1600) => U('1610891015188-5369212db097', w),
  line: (w = 1600) => U('1717386255773-1e3037c81788', w),
  coating: (w = 1600) => U('1675176785803-bffbbb0cd2f4', w),
  control: (w = 1600) => U('1598299803204-b73796f43289', w),
  dispatch: (w = 1600) => U('1496247749665-49cf5b1022e9', w),
};
