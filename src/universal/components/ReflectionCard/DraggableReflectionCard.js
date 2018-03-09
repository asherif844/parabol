/**
 * A drag-and-drop enabled reflection card.
 *
 * @flow
 */
import type {Node} from 'react';
import type {Props as ReflectionCardProps} from './ReflectionCard';
import type {ReflectionID} from 'universal/types/retro';

import React, {Component} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import {getEmptyImage} from 'react-dnd-html5-backend';
import shortId from 'shortid';

import compose from 'universal/utils/compose';
import {REFLECTION_CARD} from 'universal/utils/constants';
import without from 'universal/utils/without';

import ReflectionCard from './ReflectionCard';
import ReflectionGroup from 'universal/components/ReflectionGroup/ReflectionGroup';

const newId = () => shortId.generate();

type DragItem = {
  id: ReflectionID
};

type Props = {
  ...ReflectionCardProps,
  canDrop: boolean,
  connectDragPreview: (Node) => Node,
  connectDragSource: (Node) => Node,
  connectDropTarget: (Node) => Node,
  handleCancelDrag: (draggedCardId: ReflectionID) => any,
  handleBeginDrag: (draggedCardId: ReflectionID) => any,
  handleDrop: (draggedCardId: ReflectionID, droppedCardId: ReflectionID) => any,
  isDragging: boolean,
  isOver: boolean
};

class DraggableReflectionCard extends Component<Props> {
  render() {
    const {
      canDrop,
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      contentState,
      id,
      isOver,
      stage
    } = this.props;
    const reflectionCardProps = {
      ...without(this.props, 'connectDragSource'),
      hovered: isOver && canDrop
    };
    connectDragPreview(getEmptyImage());
    const connect = compose(connectDragSource, connectDropTarget);
    return connect(
      isOver && canDrop ? (
        <div style={{display: 'inline-block'}}>
          <ReflectionGroup
            id={newId()}
            reflections={[
              {id, content: contentState, stage}
            ]}
            hovered
          />
        </div>
      ) : (
        <div style={{display: 'inline-block'}}>
          <ReflectionCard {...reflectionCardProps} />
        </div>
      )
    );
  }
}

const dragSpec = {
  beginDrag(props: Props): DragItem {
    const {handleBeginDrag, id} = props;
    handleBeginDrag(id);
    return {id};
  },

  endDrag(props: Props, monitor) {
    if (!monitor.didDrop()) {
      props.handleCancelDrag(props.id);
      return;
    }
    const {id: droppedId} = monitor.getDropResult();
    const {handleDrop, id: draggedId} = props;
    handleDrop(draggedId, droppedId);
  }
};

const dragCollect = (connect, monitor) => ({
  connectDragPreview: connect.dragPreview(),
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const dropSpec = {
  canDrop(props: Props, monitor) {
    return props.id !== monitor.getItem().id;
  },

  // Makes the id of the card-dropped-into available in the dragSpec's endDrag method.
  drop(props: Props) {
    return {id: props.id};
  }
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({shallow: true}),
  item: monitor.getItem(),
  canDrop: monitor.canDrop()
});

export default compose(
  DragSource(REFLECTION_CARD, dragSpec, dragCollect),
  DropTarget(REFLECTION_CARD, dropSpec, dropCollect)
)(DraggableReflectionCard);
