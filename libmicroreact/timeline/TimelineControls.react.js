import React from 'react';
import PropTypes from 'prop-types';

import Slider from '../slider';
import ControlsButton from '../controls-button';
import RadioSelect from '../radio-select';
import ControlsMenu from '../controls-menu';

import defaults from '../defaults';

export const timeUnits = {
  year: 'Year',
  quarter: 'Quarter',
  month: 'Month',
  week: 'Week',
  day: 'Day',
};

export const timeSpeeds = {
  1: '1 second',
  3: '3 seconds',
  10: '10 seconds',
  20: '20 seconds',
  30: '30 seconds',
  60: '60 seconds',
};

const timeUnitItems =
  Object.keys(timeUnits).map(key => ({
    value: key,
    label: timeUnits[key],
  }));

export default class extends React.Component {
  static displayName = 'TimelineControls'

  static propTypes = {
    bounds: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    maxNodeSize: PropTypes.number,
    minNodeSize: PropTypes.number,
    nodeSize: PropTypes.number.isRequired,
    onBoundsChange: PropTypes.func.isRequired,
    onNodeSizeChange: PropTypes.func.isRequired,
    onSpeedChange: PropTypes.func.isRequired,
    onUnitChange: PropTypes.func.isRequired,
    speed: PropTypes.string.isRequired,
    timelineMax: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
  }

  static defaultProps = {
    maxNodeSize: defaults.MAX_NODE_SIZE,
    minNodeSize: defaults.MIN_NODE_SIZE,
    nodeSize: defaults.NODE_SIZE,
  }

  state = {
    isPlaying: false,
    isMovingWindow: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPlaying !== this.state.isPlaying) {
      if (this.state.isPlaying) {
        this.startTimelinePlay();
      } else {
        this.stopTimelinePlay();
      }
    }
  }

  componentWillUnmount() {
    this.stopTimelinePlay();
  }

  moveBounds(startDelta, endDelta) {
    const min = this.props.bounds.min + startDelta;
    const max = this.props.bounds.max + endDelta;

    if (min >= 0 && max <= this.props.timelineMax) {
      this.props.onBoundsChange({ min, max });
    }

    return max >= this.props.timelineMax;
  }

  togglePlayTimeline(event) {
    this.setState({
      isPlaying: !this.state.isPlaying,
      isMovingWindow: event.metaKey || event.ctrlKey,
    });
  }

  startTimelinePlay() {
    this.timerTick(true);
  }

  stopTimelinePlay() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.timeoutID = null;
  }

  timerTick(rewind = false) {
    const isFinished = this.moveBounds(this.state.isMovingWindow ? +1 : 0, +1);
    const timeout = parseInt(this.props.speed, 10) * 1000;
    if (isFinished) {
      if (rewind) {
        this.props.onBoundsChange({
          min: 0,
          max: 1,
        });
        this.timeoutID = setTimeout(() => this.timerTick(), timeout);
      } else {
        this.setState({ isPlaying: false });
      }
    } else {
      this.timeoutID = setTimeout(() => this.timerTick(), timeout);
    }
  }

  render() {
    return (
      <>
        <ControlsButton
          title="Reset zoom"
          onClick={() =>
            this.props.onBoundsChange({
              min: this.props.bounds.min,
              max: this.props.bounds.max,
            })
          }
        >
          <i className="material-icons">zoom_out_map</i>
        </ControlsButton>
        <div className="libmr-Panel-control-group">
          <ControlsButton
            title="Skip to end"
            onClick={() =>
              this.props.onBoundsChange({
                min: this.props.timelineMax - (this.props.bounds.max - this.props.bounds.min),
                max: this.props.timelineMax,
              })
            }
          >
            <i className="material-icons">skip_next</i>
          </ControlsButton>
          <ControlsButton
            title="Fast-forward"
            onClick={() => this.moveBounds(+1, +1)}
          >
            <i className="material-icons">fast_forward</i>
          </ControlsButton>
          <ControlsButton
            active={this.state.isPlaying}
            onClick={(event) => this.togglePlayTimeline(event)}
            title={this.state.isPlaying ? 'Pause' : 'Play timeline. Hold Ctrl/Cmd + click for moving window.'}
          >
            <i className="material-icons">{this.state.isPlaying ? 'pause' : 'play_arrow'}</i>
          </ControlsButton>
          <ControlsButton
            title="Rewind"
            onClick={() => this.moveBounds(-1, -1)}
          >
            <i className="material-icons">fast_rewind</i>
          </ControlsButton>
          <ControlsButton
            title="Back to start"
            onClick={() =>
              this.props.onBoundsChange({
                min: 0,
                max: this.props.bounds.max - this.props.bounds.min,
              })
            }
          >
            <i className="material-icons">skip_previous</i>
          </ControlsButton>
        </div>
        <div className="libmr-Panel-control-group">
          <ControlsMenu
            active={false}
            align="right"
            size="narrow"
            summary={<strong>{timeSpeeds[this.props.speed]}</strong>}
            title="Speed"
          >
            <RadioSelect
              items={
                Object.keys(timeSpeeds).map(key => ({
                  value: key,
                  label: `1 ${this.props.unit}/${timeSpeeds[key]}`,
                }))
              }
              onChange={this.props.onSpeedChange}
              value={this.props.speed}
            />
          </ControlsMenu>
          <ControlsMenu
            active={false}
            align="right"
            size="narrow"
            summary={<strong>{timeUnits[this.props.unit]}</strong>}
            title="Group by"
          >
            <RadioSelect
              items={timeUnitItems}
              onChange={this.props.onUnitChange}
              value={this.props.unit}
            />
          </ControlsMenu>
          <ControlsMenu
            align="right"
            title="Nodes"
          >
            <Slider
              label="Node size"
              onChange={this.props.onNodeSizeChange}
              min={this.props.minNodeSize}
              max={this.props.maxNodeSize}
              unit="px"
              value={this.props.nodeSize}
            />
          </ControlsMenu>
        </div>
      </>
    );
  }
}
