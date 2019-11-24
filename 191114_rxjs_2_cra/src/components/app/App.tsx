import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DragZone } from '../drag-zone/drag-zone';
import { Obs2 } from '../obs2/obs2';
import { reduce } from 'rxjs/operators';

// function pipeProps(...fns) {
//   return fn(props) {
//     //
//   }
//   //
// }

function pipeProps(...operators: any[]) {
  const [first, ...restOperators] = operators;
  return function takeProps(props: any) {
    const { children, ...restProps } = props;
    const transformedRestProps = first
      ? restOperators.reduce((a, n) => n(a), first(restProps))
      : restProps;
    return children(transformedRestProps);
  }
}

const ChildRenderer = pipeProps(
  (props: any) => ({ ...props, abc: props.abc + 1 }),
  (props: any) => ({ ...props, abc: props.abc + 1 }),
  (props: any) => ({ ...props, abc: props.abc + 1 }),
  (props: any) => props,
  (props: any) => props,
);



function App() {
  return (
    <ChildRenderer abc={1} ghi={2}>
      {(props: any) => {
        return <>
          <div>Hello World</div>
          <ul>{Object
            .entries(props)
            .map(([k, v], i) => <div key={i}>
              {`${k}: ${v}`}
            </div>)}</ul>
        </>
      }}
    </ChildRenderer>
  );
}

export default App;
