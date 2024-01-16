import DeathAirPollution from "../graphs/maps/DeathAirPollution";
import PlasticOcean from "../graphs/maps/PlasticOcean";

function Plastic() {
    return (
        <div className="Map-wrapper">
            <div className="map-title">
                <h5>This is one of the main causes of air pollution for human life.

                    <br />
                    Map share of global plastic waste emitted to the ocean in 2019
                </h5>
            </div>
            <svg id="nitro-pollution" width="800" height="700">
                <PlasticOcean />
            </svg>

        </div>
    );
}

export default Plastic;