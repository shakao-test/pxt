import * as React from 'react';
import { connect } from 'react-redux';
import { ImageEditorStore, TilemapState, TileCategory } from '../store/imageReducer';

export interface MinimapProps {
    colors: string[];
    tileset: pxt.sprite.TileSet;
    tilemap: pxt.sprite.ImageState;
}


class MinimapImpl extends React.Component<MinimapProps, {}> {
    protected tileColors: string[] = [];
    protected canvas: HTMLCanvasElement;

    componentDidMount() {
        this.canvas = this.refs["minimap-canvas"] as HTMLCanvasElement;
        this.redrawCanvas();
    }

    componentDidUpdate() {
        this.redrawCanvas();
    }

    render() {
        return <div className="minimap-outer">
            <canvas ref="minimap-canvas" className="paint-surface" />
        </div>
    }

    redrawCanvas() {
        const { tilemap } = this.props;

        const context = this.canvas.getContext("2d");
        const bitmap = pxt.sprite.Tilemap.fromData(tilemap.bitmap);

        this.canvas.width = bitmap.width;
        this.canvas.height = bitmap.height;
        this.tileColors = [];

        for (let x = 0; x < bitmap.width; x++) {
            for (let y = 0; y < bitmap.height; y++) {
                const index = bitmap.get(x, y);
                if (index) {
                    context.fillStyle = this.getColor(index);
                    context.fillRect(x, y, 1, 1);
                }
                else {
                    context.clearRect(x, y, 1, 1);
                }
            }
        }
    }

    protected getColor(index: number) {
        if (!this.tileColors[index]) {
            const { tileset, colors } = this.props;

            if (index >= tileset.tiles.length) {
                return "#ffffff";
            }
            const bitmap = pxt.sprite.Bitmap.fromData(tileset.tiles[index].data);
            this.tileColors[index] = pxt.sprite.computeAverageColor(bitmap, colors);
        }

        return this.tileColors[index];
    }
}


function mapStateToProps({ store: { present }, editor }: ImageEditorStore, ownProps: any) {
    let state = (present as TilemapState);
    if (!state) return {};
    return {
        tilemap: state.tilemap,
        tileset: state.tileset,
        colors: state.colors
    };
}

const mapDispatchToProps = {

};


export const Minimap = connect(mapStateToProps, mapDispatchToProps)(MinimapImpl);