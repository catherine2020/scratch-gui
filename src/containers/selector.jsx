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
        ]);

        this.elements = [];
        this.boxes = null;
    }
    componentWillReceiveProps (newProps) {
        if (newProps.dragging && !this.props.dragging) {
            this.boxes = this.elements.map(el => el && el.getBoundingClientRect());
        }
        if (!newProps.dragging && this.props.dragging) {
            this.boxes = null;
            this.props.onReorder(this.props.draggingId, this.mouseOverIndex);
        }
    }
    refFactory (index) {
        return el => {
            this.elements[index] = el;
        };
    }
    render () {
        let mouseOverIndex = null;
        let items = this.props.items;

        if (this.props.currentOffset) {
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
    currentOffset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    dragging: PropTypes.bool,
    draggingId: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired
    })),
    onClose: PropTypes.func,
    onReorder: PropTypes.func
};

const mapStateToProps = state => ({
    dragging: state.scratchGui.assetDrag.dragging,
    currentOffset: state.scratchGui.assetDrag.currentOffset,
    draggingId: state.scratchGui.assetDrag.id,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Selector);
