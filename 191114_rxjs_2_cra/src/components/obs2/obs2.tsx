import React, { useState, SyntheticEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Subscriber, Subject } from 'rxjs';

export function Obs2(props: InferProps<typeof Obs2['propTypes']>) {
  const [clickStream] = useState(() => new Subject<React.MouseEvent<HTMLButtonElement, MouseEvent>>());
  const [count, setCount] = useState(0);
  const [events, setEvents] = useState<number[]>([]);

  clickStream.subscribe(e => {
    console.log('abcdefghijkl');
    setEvents(events.concat(e.clientX))
  });

  return <>
    <div>
      Hello World
      <button
        style={{height: 200, width: 200}}
        onClick={clickStream.next.bind(clickStream)}
      >CLick on me
      </button>
      <div><ol>{events.map((e, i) => <div key={i}>{`event: ${e}`}</div>)}</ol></div>
    </div>
    </>;
}


Obs2.propTypes = {
  // color: PropTypes.string.isRequired,
}
