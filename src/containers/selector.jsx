import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import SelectorComponent from '../components/asset-panel/selector.jsx';

class Selector extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'refFactory'
            // 'handleBack',
            // 'handleCancel',
            // 'handleCapture',
            // 'handleLoaded',
            // 'handleSubmit',
            // 'setCanvas'
        ]);

        this.elements = [];
        this.boxes = null;

        this.state = {
            // capture: null,
            // access: false,
            // loaded: false
        };
    }
    refFactory (index) {
        return el => {
            // console.log(`setting ref ${index} to ${el}`);
            this.elements[index] = el;
        };
    }
    componentWillReceiveProps (newProps) {
        if (newProps.dragging && !this.props.dragging) {
            // console.log('resetting boxes');
            this.boxes = this.elements.map(el => el && el.getBoundingClientRect());
        }
        if (!newProps.dragging && this.props.dragging) {
            this.boxes = null;
            this.props.onReorder(this.props.draggingId, this.mouseOverIndex);
        }
    }
    render () {
        let mouseOverIndex = null;
        let items = this.props.items;

        if (this.props.currentOffset) {
            // console.log(midpoints, this.props.currentOffset.y);
            mouseOverIndex = this.boxes.length;
            for (let n = 0; n < this.boxes.length; n++) {
                const box = this.boxes[n];
                const max = box.top + box.height;
                const min = n === 0 ? -Infinity : this.boxes[n - 1].top + this.boxes[n - 1].height;

                if (this.props.currentOffset.y > min && this.props.currentOffset.y <= max) {
                    mouseOverIndex = n;
                }
            }
            this.mouseOverIndex = mouseOverIndex;
            items = items.slice(0, this.props.draggingId).concat(items.slice(this.props.draggingId + 1));
            items.splice(this.mouseOverIndex, 0, this.props.items[this.props.draggingId]);
        }

        // if (this.dragging) {
        //     items = items.slice(0, this.props.draggingId).concat(items.slice(this.props.draggingId + 1));
        //     console.log(this.props.items.map(i => i.name), items.map(i => i.name));
        //     items.splice(this.mouseOverIndex, 0, this.props.items[this.draggingId]);
        //     console.log(this.props.items.map(i => i.name), items.map(i => i.name));
        // }
        // console.log(this.props.draggingId, this.mouseOverIndex, this.props.items.map(i => i.name), items.map(i => i.name));
        return (
            <SelectorComponent
                mouseOverIndex={this.mouseOverIndex}
                refFactory={this.refFactory}
                {...this.props}
                items={items}
            />
        );
    }
}

Selector.propTypes = {
    onClose: PropTypes.func,
    onNewCostume: PropTypes.func
};

const mapStateToProps = state => ({
    dragging: state.scratchGui.assetDrag.dragging,
    currentOffset: state.scratchGui.assetDrag.currentOffset,
    draggingId: state.scratchGui.assetDrag.id,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        // dispatch(closeCameraCapture());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Selector);
