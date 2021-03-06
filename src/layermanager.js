import React, { Component } from 'react';

class LayerPreview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            src: null,
            alt: ""
        }
    }

    componentDidMount() {
        this.updatePreview();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) this.updatePreview();
    }

    updatePreview = () => {
        this.props.asset.render().then(() => 
            this.setState({src: this.props.asset.src, alt: this.props.asset.name})
        );
    }

    render() {
        return (
            <img src={this.state.src} alt={this.state.alt} title={this.state.alt} />
        );
    }
}

class Layer extends Component {
    constructor(props) {
        super(props);

        this.asset = props.asset;
    }

    changeColor = (colorIndex, color) => {
        this.asset.colors[colorIndex] = color.target.value;
        this.asset.color().then(() => this.updateLayer());
    }

    changeColorThrottled = (colorIndex, color) => {
        if (this.awaitUpdate) return;
        this.awaitUpdate = true;
        this.changeColor(colorIndex, color);

        setTimeout(() => {
            this.changeColor(colorIndex, color);
            this.awaitUpdate = false;
        }, 100);
        //add throttle limit slider?
        //ehh idk, this and a few other things would be fixed with a custom color picker
    }

    changeBlendMode = (blend) => {
        this.asset.propagateBlendMode(blend.target.value);
        this.updateLayer();
    }

    updateLayer = () => this.props.updateLayer(this.props.index, this.asset);

    moveLayer = change => this.props.moveLayer(this.props.index, change);

    removeLayer = () => this.props.removeLayer(this.props.index);

    render() {
        const colors = [];
        if (this.asset?.colors) {
            this.asset.colors.forEach((color, i) => {
                if (color !== "null" && color !== "erase" && (!this.asset.advanced[i] || this.props.advanced)) {
                    colors.push(
                        <input key={i + this.asset.id} type="color" defaultValue={color} onChange={this.changeColorThrottled.bind(this, i)} />
                    );
                }
            });
        }

        return (
            <div className="manager-layer container">
                <p>{this.asset.name}</p>
                <span>
                    <LayerPreview asset={this.asset} />
                    <div className="manager-layer-buttons">
                        <button onClick={this.moveLayer.bind(this, -1)}>/\</button>
                        <button onClick={this.moveLayer.bind(this, 1)}>\/</button>
                        <button onClick={this.removeLayer.bind(this)}>X</button>
                    </div>
                    <div className="manager-layer-colors">
                        {colors}
                    </div>
                </span>
                {this.props.advanced &&
                    <span>
                        <label htmlFor={"blendSelector" + this.asset.id}>Blend Mode:</label>
                        <select id={"blendSelector" + this.asset.id} value={this.asset.blend} onChange={this.changeBlendMode.bind(this)}>
                            <option value="source-over">Source Over</option>
                            <option value="source-in">Source In</option>
                            <option value="source-out">Source Out</option>
                            <option value="source-atop">Source Atop</option>
                            <option value="destination-over">Destination Over</option>
                            <option value="destination-in">Destination In</option>
                            <option value="destination-out">Destination Out</option>
                            <option value="destination-atop">Destination Atop</option>
                            <option value="lighter">Lighter</option>
                            <option value="copy">Copy</option>
                            <option value="xor">XOR</option>
                            <option value="multiply">Multiply</option>
                            <option value="screen">Screen</option>
                            <option value="overlay">Overlay</option>
                            <option value="darken">Darken</option>
                            <option value="lighten">Lighten</option>
                            <option value="color-dodge">Color Dodge</option>
                            <option value="color-burn">Color Burn</option>
                            <option value="hard-light">Hard Light</option>
                            <option value="soft-light">Soft Light</option>
                            <option value="difference">Difference</option>
                            <option value="exclusion">Exclusion</option>
                            <option value="hue">Hue</option>
                            <option value="saturation">Saturation</option>
                            <option value="color">Color</option>
                            <option value="luminosity">Luminosity</option>
                        </select>
                    </span>
                }
            </div>
        );
    }
}

class LayerManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            advanced: false,
            layers: props.layers
        };

        this.layers = props.layers;
    }

    setAdvanced = (e) => {
        this.setState({advanced: e.target.checked});
    }

    updateLayers = () => {
        this.setState({layers: this.layers});
        this.props.updateLayers(this.layers);
    }

    updateLayer = (index, newLayer) => {
        this.layers[index] = newLayer;
        this.updateLayers();
    }

    moveLayer = (index, change) => {
        if (index + change < 0 || index + change >= this.layers.length) return;
        const layer = this.layers.sublayers[index]
        this.layers.sublayers.splice(index, 1);
        this.layers.sublayers.splice(index + change, 0, layer);
        this.updateLayers();
    }

    removeLayer = (index) => {
        this.layers.sublayers.splice(index, 1);
        this.updateLayers();
    }

    render() {
        let elem = <div />;
        if (this.state.layers.sublayers.length) {
            elem = this.state.layers.sublayers.map((asset, i) => 
                <Layer key={asset.id} asset={asset} index={i} updateLayer={this.updateLayer} moveLayer={this.moveLayer} removeLayer={this.removeLayer} advanced={this.state.advanced}/>
            );
        }

        return (
            <div className="layer-manager">
                <span>
                    <label htmlFor="advancedToggle">Advanced mode</label>
                    <input type="checkbox" id="advancedToggle" onClick={this.setAdvanced.bind(this)}/>
                </span>
                {elem}
            </div>
        );
    }
}

export default LayerManager