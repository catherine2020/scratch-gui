import React from 'react';
import PropTypes from 'prop-types';
import styles from './drag-layer.css';
import {Motion, spring} from 'react-motion';

/* eslint no-confusing-arrow: ["error", {"allowParens": true}] */
// const DragLayer = ({dragging, img, currentOffset}) => (
class DragLayer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            img: props.img,
            currentOffset: {x: 0, y: 0}
        };
    }
    componentWillReceiveProps (newProps) {
        if (newProps.currentOffset && newProps.img) {
            this.setState({img: newProps.img, currentOffset: newProps.currentOffset});
        }
    }
    render () {
        const {currentOffset, img} = this.state;

        return (
            <Motion
                style={{
                    scale: this.props.dragging ? spring(1, {stiffness: 200, damping: 10}) :
                        spring(0, {stiffness: 200, damping: 10})
                }}
            >
                {({scale}) => (
                    <div className={styles.dragLayer}>
                        <div
                            className={styles.imageWrapper}
                            style={{
                                transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
                            }}
                        >
                            <img
                                className={styles.image}
                                src={img}
                                style={{
                                    transform: `scale(${Math.abs(scale)})`
                                }}
                            />
                        </div>
                    </div>
                )}
            </Motion>
        );
    }
}

DragLayer.propTypes = {
    dragging: PropTypes.bool.isRequired,
    img: PropTypes.string
};

export default DragLayer;
