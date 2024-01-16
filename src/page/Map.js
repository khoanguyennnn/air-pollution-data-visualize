import NitroPollution from "../graphs/maps/NitroPollution";
import PlasticOcean from "../graphs/maps/PlasticOcean";

function Map() {
    return (
        <div className="Map-wrapper">
            <svg id="nitro-pollution" width="800" height="700">
                <NitroPollution />
            </svg>
            <div className="map-title">
                <h5>Shown is how much nitrogen pollution countries caused compared with
                    how much they reduced their yield gaps relative to directly neighboring countries.
                    <br />
                    Positive values (light to dark) indicate a country overapplied nitrogen without gains in yield.</h5>
            </div>
        </div>
    );
}

export default Map;