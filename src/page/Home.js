import Barchart from "../graphs/Barchart";
import Donutchart from "../graphs/Donutchart";
import Linechart from "../graphs/Linechart";
import MultiLinechart from "../graphs/MultiLinechart";
import Piechart from "../graphs/Piechart";

function Home() {
    return (
        <div className="Home-wrapper">
            <div className="First-wrapper">
                <div className="Barchart-wrapper">
                    <Barchart />
                </div>
                <div className="Piechart-wrapper">
                    <select id="selectButton1"></select>
                    <Piechart />
                </div>
            </div>
            <div className="First-wrapper">
                <div className="Linechart-wrapper">
                    <select id="selectButton"></select>
                    <Linechart />
                </div>
                <div className="Donutchart-wrapper">
                    <select id="selectButton2"></select>
                    <Donutchart />
                </div>
            </div>
        </div>
    );
}

export default Home;