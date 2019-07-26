import React from 'react';

interface SplashPageProps {
  //
}

class SplashPage extends React.Component {
  /**
   * @constructor
   *
   * @param {props}
   */
  public constructor(props: SplashPageProps) {
    super(props);
  }

  /**
   * @inheritdoc
   */
  public render() {
    console.log({ ...this.props });
    return (
      <div>
        <div>SplashPage</div>
        <div>
          <div>Threads Header</div>
          <div>
            <div>Thread 1</div>
            <div>Thread 2</div>
            <div>Thread 3</div>
            <div>Thread 4</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SplashPage;
