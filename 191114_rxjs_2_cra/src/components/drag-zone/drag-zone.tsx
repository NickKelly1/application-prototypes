// import * as qwe 
import React, { useEffect, useState, useRef } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import * as rx from 'rxjs';
import * as op from 'rxjs/operators';


type DragZoneProps = {
  color: 'red' | 'green' | 'blue'
};

const defaultProps = {
  height: 500,
  width: 500,
};

function mouseClickSubject() { return new rx.Subject(); }

export function DragZone(
  props: InferProps<typeof DragZone['propTypes']> & DragZoneProps
) {
  const height = props.height || defaultProps.height;
  const width = props.height || defaultProps.height;
  const { color } = props;

  const btnRef = useRef<HTMLButtonElement>(null);
  const dragTarget = useRef<HTMLDivElement>(null);
  const dragZone = useRef<HTMLDivElement>(null);

  // const [ buttonClicks ] = useState(() => new rx.Subject<React.SyntheticEvent<HTMLButtonElement, MouseEvent>>());
  // const [ buttonDowns ] = useState(() => new rx.Subject<React.SyntheticEvent<HTMLButtonElement, MouseEvent>>());
  // const [ buttonUps ] = useState(() => new rx.Subject<React.SyntheticEvent<HTMLButtonElement, MouseEvent>>());
  const [ mouseDowns ] = useState(() => new rx.Subject<React.MouseEvent<HTMLDivElement, MouseEvent>>());
  const [ mouseUps ] = useState(() => new rx.Subject<React.MouseEvent<HTMLDivElement, MouseEvent>>());
  const [ mouseMoves ] = useState(() => new rx.Subject<React.MouseEvent<HTMLDivElement, MouseEvent>>());

  // useEffect(() => void mouseMoves
  //   .pipe(
  //     op.skipUntil(buttonDowns),
  //     op.takeUntil(buttonUps),
  //     op.repeat(),
  //   )
  //   .forEach((e) => {
  //     console.log('Button positioning', e.pageX, e.pageX);
  //     if (divRef.current) divRef.current.style.top = `${e.pageY}px`;
  //     if (divRef.current) divRef.current.style.left = `${e.pageX}px`;
  //   })
  // , []);

  useEffect(() => void mouseDowns
    .pipe(
      op.map(md => {
        // console.log('md');
        return md;
      }),
      op.mergeMap((md) => mouseMoves),
      op.takeUntil(mouseUps),
      op.repeat(),
    )
    .subscribe((e) => {
      // console.log('Button positioning', e.pageX, e.pageX);
      if (dragTarget.current) dragTarget.current.style.top = `${e.pageY - (parseInt(e.currentTarget.style.width, 10) / 4)}px`;
      if (dragTarget.current) dragTarget.current.style.left = `${e.pageX - (parseInt(e.currentTarget.style.height, 10) / 4)}px`;
    })
  , [])

  // useEffect(() => void buttonDowns.forEach((e) => console.log('got a down :)')), []);

  // useEffect(() => )


  return (
    <div
      ref={dragZone}
      style={{ height: '100vh', width: '100vw', position: 'relative', backgroundColor: 'purple' }}
      onMouseMove={(q) => {
        // console.log('omm');
        return mouseMoves.next.bind(mouseMoves)(q);
      }}
      onMouseDown={(q) => {
        // console.log('omd');
        return mouseDowns.next.bind(mouseDowns)(q);
      }}
      onMouseUp={(q) => {
        // console.log('omu');
        return mouseUps.next.bind(mouseUps)(q);
      }}
    >
      <div
        ref={dragTarget}
        style={{ height: 50, width: 50, position: 'absolute', backgroundColor: 'springgreen' }}
      />
    </div>
  )
}

DragZone.propTypes = {
  color: PropTypes.oneOf(['red', 'green', 'blue']).isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
