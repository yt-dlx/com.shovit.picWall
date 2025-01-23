// src/database/index.ts
import Abstract_Anime from "./styles/Abstract - Anime";
import Abstract_Cinematic from "./styles/Abstract - Cinematic";
import Abstract_Geometry from "./styles/Abstract - Geometry";
import Abstract_Realism from "./styles/Abstract - Realism";
import Landscapes_Anime from "./styles/Landscapes - Anime";
import Landscapes_Cinematic from "./styles/Landscapes - Cinematic";
import Landscapes_Geometry from "./styles/Landscapes - Geometry";
import Landscapes_Realism from "./styles/Landscapes - Realism";
import Minimalist_Anime from "./styles/Minimalist - Anime";
import Minimalist_Cinematic from "./styles/Minimalist - Cinematic";
import Minimalist_Geometry from "./styles/Minimalist - Geometry";
import Minimalist_Realism from "./styles/Minimalist - Realism";
import Surreal_Anime from "./styles/Surreal - Anime";
import Surreal_Cinematic from "./styles/Surreal - Cinematic";
import Surreal_Geometry from "./styles/Surreal - Geometry";
import Surreal_Realism from "./styles/Surreal - Realism";
import Urban_Anime from "./styles/Urban - Anime";
import Urban_Cinematic from "./styles/Urban - Cinematic";
import Urban_Geometry from "./styles/Urban - Geometry";
import Urban_Realism from "./styles/Urban - Realism";
import Wonders_Anime from "./styles/Wonders - Anime";
import Wonders_Cinematic from "./styles/Wonders - Cinematic";
import Wonders_Geometry from "./styles/Wonders - Geometry";
import Wonders_Realism from "./styles/Wonders - Realism";
const metaBase = {
  Abstract: {
    Anime: Abstract_Anime,
    Cinematic: Abstract_Cinematic,
    Geometry: Abstract_Geometry,
    Realism: Abstract_Realism
  },
  Landscapes: {
    Anime: Landscapes_Anime,
    Cinematic: Landscapes_Cinematic,
    Geometry: Landscapes_Geometry,
    Realism: Landscapes_Realism
  },
  Minimalist: {
    Anime: Minimalist_Anime,
    Cinematic: Minimalist_Cinematic,
    Geometry: Minimalist_Geometry,
    Realism: Minimalist_Realism
  },
  Surreal: {
    Anime: Surreal_Anime,
    Cinematic: Surreal_Cinematic,
    Geometry: Surreal_Geometry,
    Realism: Surreal_Realism
  },
  Urban: {
    Anime: Urban_Anime,
    Cinematic: Urban_Cinematic,
    Geometry: Urban_Geometry,
    Realism: Urban_Realism
  },
  Wonders: {
    Anime: Wonders_Anime,
    Cinematic: Wonders_Cinematic,
    Geometry: Wonders_Geometry,
    Realism: Wonders_Realism
  }
};
export default metaBase;
