import React from 'react';
import { Observable, Subscription, Subscriber } from 'rxjs';
// import { share } from 'rxjs/operators';

// https://github.com/gcanti/prop-types-ts

interface Example1Props {
  incomingProp?: string;
}

interface Example1State {
  items: Set<string>;
  search: string;
  subscribers: Subscription[];
}

export class Example1 extends React.Component<Example1Props, Example1State> {
  private observable: Observable<string>;
  private tick: number | null = null;

  /**
   * @constructor
   */
  public constructor(props: Example1Props) {
    super(props);

    let subscriberCount = 0;

    this.observable = Observable.create((producer: Subscriber<string>) => {
      const id = ++subscriberCount;
      try {
        producer.next(`(${id}) - hey guys!`);
        producer.next(`(${id}) - How are you?`);
        let counter = 0;
        this.tick = window.setInterval(() => void producer.next(`(${id}) - (${counter++}) ticking...`), 1500);
      } catch (err) {
        producer.error(err);
      }
    });

    this.state = {
      items: new Set(),
      subscribers: [],
      search: '',
    };
  }

  /**
   * @inheritdoc
   */
  public componentWillMount() {
    this.subscribe();
  }

  /**
   * @inheritdoc
   */
  public componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * @description
   * Subscribe to the observer
   */
  private subscribe = () => {
    const { subscribers } = this.state;

    subscribers.push(
      this.observable.subscribe(
        // on next
        (x: string, ...args: any[]) => {
          console.log('_[next]_', x, args);
          this.addItem(x);
        },
        // on error
        (error: any, ...args: any[]) => {
          console.log('_[error]_', args);
          this.addItem(String(error));
        },
        // on completion
        (...args: any[]) => {
          console.log('_[completion]_', args);
          this.addItem('Completed..!!');
        },
      ),
    );

    this.setState({ subscribers });
  };

  /**
   * @description
   * Unsubscribe from the observable
   */
  private unsubscribe = () => {
    const { subscribers } = this.state;
    const lastSubscriber = subscribers.pop();
    if (lastSubscriber) lastSubscriber.unsubscribe();
    this.setState({ subscribers });
  };

  /**
   * @description
   * Add a unique item to the set
   *
   * @param val
   */
  private addItem = (val: string) => this.setState({ items: this.state.items.add(val) });

  /**
   * @description
   * Fired when the button is clicked
   */
  public handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    void this.addItem(`(${this.state.items.size}) : ${e.clientX} - ${e.clientY}`);

  /**
   * @description
   * Fired when a key is pressed in the search term input
   */
  public handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) =>
    void (e.keyCode === 13 ? this.addItem(this.state.search) : null);

  /**
   * @description
   * Fired when the search term is changed
   */
  public handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    void this.setState({ search: e.currentTarget.value });

  /**
   * @inheritdoc
   */
  public render() {
    const { items, search, subscribers } = this.state;

    return (
      <div className="example">
        <div>{subscribers.length}</div>
        <div>
          <input value={search} onKeyDown={this.handleKeyDownSearch} onChange={this.handleChangeSearch} />
        </div>
        <div>
          <button onClick={this.unsubscribe}>Remove subscriber</button>
        </div>
        <div>
          <button onClick={this.subscribe}>Add subscriber</button>
        </div>
        <ul>
          {[...items].reverse().map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}
